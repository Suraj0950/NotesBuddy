import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, addNote, getNotes } from '../firebase';
import { normalizeForStorage, toTitleCase } from '../lib/utils';
import CustomSelect from '../components/CustomSelect';
import PopUpMessage from "../components/PopUpMessage";
import { UploadIcon } from 'lucide-react';
import './loader.css';

import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

function Upload() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const fetchedNotes = await getNotes();

        const normalizedNotes = fetchedNotes.map(note => ({
          ...note,
          subject: note.subject || '',
        }));

        const fetchedsubjects = [...new Set(normalizedNotes.map(note => note.subject))];

        const formattedSubjects = fetchedsubjects.map(subject => toTitleCase(subject));
        formattedSubjects.sort();
        formattedSubjects.push('Not mentioned');

        setSubjects(formattedSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        setError(error.message);
      }
    };

    fetchNotes();
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setContributorName(user.displayName || "");
      } else {
        setContributorName("");
      }
    });

    return () => unsubscribe();
  }, []);

  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [semester, setSemester] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [contributorName, setContributorName] = useState('');
  const [module, setModule] = useState('');

  const messages = [
    "Uploading... slower than my grandma's Wi-Fi!",
    "Hold up, the bytes are arguing.",
    "Almost there... if 'there' is still far!",
    "Uploading... slower than me on a treadmill.",
    "Oops, the bytes took a wrong turn!",
    "This upload’s in the queue behind a snail.",
    "Almost done... or am I lying?",
    "Uploading... because teleporting bytes is illegal.",
    "Waiting... because why not?",
    "Hold on, it’s buffering its confidence.",
    "Uploading... powered by hamster wheels!",
    "Relax, it’s on bytecation.",
    "Loading... slower than my last breakup.",
    "This upload’s stuck in existential dread!",
    "Uploading... we’re counting sheep, too!",
    "Hold up... the bytes are stretching first.",
    "Uploading... not running, just strolling.",
    "Bytes loading... but first, a selfie!",
    "Processing... the bytes are shy today.",
    "Uploading... slower than a dial-up modem.",
    "Relax, the bytes are on union break!",
    "Almost there... on a cosmic timeline.",
    "Uploading... the file’s learning patience.",
    "Loading... as reliable as my alarm clock.",
    "Hang tight... I bribed the server with cookies!",
    "This upload is practicing yoga. Namaste!",
    "Loading... because teleportation is not an option!",
    "Uploading... one byte at a time, literally!",
    "Oops, the pixels went on a coffee break!",
    "Patience, the file’s catching its breath!",
    "99% done... like my eternal procrastination!",
    "Uploading... like it’s dragging its feet home.",
    "Relax, the file's just stuck in traffic!",
    "Loading... it’s in no rush, unlike you.",
    "Uploading... fueled by hopes and prayers.",
    "Processing... with the speed of a sloth!",
    "Just a sec... or maybe an eternity.",
    "Uploading... trying to find the right vibe!",
    "Loading... it's waiting for applause!",
    "Oops, it took the scenic route!",
    "Loading... it's meditating on life choices.",
    "Uploading... like it’s writing a novel.",
    "Pixels stuck in a philosophical debate.",
    "Uploading... slower than me before coffee.",
    "Processing... powered by wishful thinking!",
    "Hold tight... the bytes are gossiping!",
    "Uploading... powered by good vibes only.",
    "Almost done... just redefining 'almost.'",
    "Uploading... even turtles are laughing!",
    "Loading... it’s probably napping!",
    "Uploading... let’s just hope for the best.",
    "Relax... the bytes are on their way!"
  ];

  const [message, setMessage] = useState(messages[Math.floor(Math.random() * messages.length)]);
  useEffect(() => {
    const interval = setInterval(() => {
      const index = Math.floor(Math.random() * messages.length);
      setMessage(messages[index]);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const [uploadedFileLink, setUploadedFileLink] = useState('');
  const [uploadedFileId, setUploadedFileId] = useState('');
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [notesUploaded, setNotesUploaded] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const preAuthenticate = async () => {
      try {
        auth.onAuthStateChanged(async (user) => {
          if (user) {
            await user.getIdToken();
          } else {
            console.log("No user authenticated");
          }
        });
      } catch (error) {
        console.error("Error pre-authenticating:", error);
      }
    };
    preAuthenticate();
  }, []);

  // ONLINE / OFFLINE 
  useEffect(() => {
    function handleOnline() {
      setError(null);
    }
    function handleOffline() {
      setError("You're Offline — Reconnect to upload.");
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // initial state
    if (!navigator.onLine) {
      setError("You're Offline — Reconnect to upload.");
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Helper: retry an async op on transient errors (simple exponential backoff)
  const retryOperation = async (fn, attempts = 3, initialDelay = 500) => {
    let attempt = 0;
    while (attempt < attempts) {
      try {
        return await fn();
      } catch (err) {
        attempt++;
        // If not a network/transient error, throw immediately.
        // We'll treat common network indicators: message contains 'network' or 'offline' or no response property.
        const msg = (err && err.message) ? err.message.toLowerCase() : '';
        const isNetworkError = !navigator.onLine || msg.includes('network') || msg.includes('offline') || msg.includes('timeout');
        if (!isNetworkError || attempt >= attempts) throw err;
        const wait = initialDelay * Math.pow(2, attempt - 1);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  };

  // NEW: Upload to Firebase Storage (resumable)
  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (!navigator.onLine) {
      setError('No internet connection. Please reconnect before uploading.');
      return;
    }

    // Validate size (100MB) and type (PDF)
    if (selectedFile.size > 100 * 1024 * 1024) {
      setError('File size must be less than 100MB');
      return;
    }

    // Accept PDF only
    if (selectedFile.type !== 'application/pdf') {
      // sometimes browser doesn't set correct mime; fallback to extension check
      const nameLower = selectedFile.name.toLowerCase();
      if (!nameLower.endsWith('.pdf')) {
        setError('Only PDF files are allowed.');
        return;
      }
    }

    setFile(selectedFile);
    setError(null);

    try {
      setFileUploaded(false);
      setFileUploading(true);
      setUploadProgress(0);

      const user = auth.currentUser;
      if (!user) {
        navigate('/auth');
        throw new Error('User not authenticated');
      }

      // Build a storage path with user id and timestamp to avoid collisions
      const uid = user.uid;
      const timestamp = Date.now();
      const safeName = selectedFile.name.replace(/\s+/g, '_').substring(0, 120); // sanitize
      const storagePath = `notes/${uid}/${timestamp}_${safeName}`; // you can change folder structure

      const storage = getStorage(); // uses default app
      const fileRef = storageRef(storage, storagePath);

      const metadata = {
        contentType: 'application/pdf',
        customMetadata: {
          uploadedBy: uid,
          originalName: selectedFile.name,
        },
      };

      // Upload with resumable so we can show progress
      const uploadTask = uploadBytesResumable(fileRef, selectedFile, metadata);

      uploadTask.on('state_changed',
        (snapshot) => {
          // progress handler
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(percent);
          // optional: set message based on progress
          if (percent === 100) setMessage('Finishing up... almost done!');
        },
        (uploadError) => {
          // error handler
          console.error('Upload error:', uploadError);
          // Show helpful error depending on network vs other error
          if (!navigator.onLine) {
            setError('Upload interrupted — you appear to be offline. It will resume when your connection returns.');
          } else {
            setError('Failed to upload file to storage. Try again.');
          }
          setFileUploading(false);
          setFileUploaded(false);
        },
        async () => {
          // success handler: get download URL
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setUploadedFileLink(downloadURL);
            setUploadedFileId(storagePath); // store path as id
            setFileUploaded(true);
            setFileUploading(false);
            setUploadProgress(100);
            console.log('File uploaded. downloadURL:', downloadURL, 'storagePath:', storagePath);
          } catch (err) {
            console.error('Failed to get download URL:', err);
            setError('Uploaded but failed to get file URL. Contact support.');
            setFileUploading(false);
            setFileUploaded(false);
          }
        }
      );

    } catch (error) {
      console.error('Error during file upload:', error);
      setError('Failed to upload file. Please try again.');
      setFileUploading(false);
      setFileUploaded(false);
    }
  };

  const [selectedSubject, setSelectedSubject] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const newSubjectInputRef = useRef(null);

  useEffect(() => {
    if (selectedSubject === 'Not mentioned' && newSubjectInputRef.current) {
      setTimeout(() => {
        newSubjectInputRef.current.focus();
      }, 100);
    }
  }, [selectedSubject]);

  const getSubjectForSubmission = () => {
    if (selectedSubject === 'Not mentioned') {
      return normalizeForStorage(newSubject.trim() || '');
    }
    return normalizeForStorage(selectedSubject);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setError('You must be authenticated to submit the form.');
      alert('Redirecting to login page...');
      navigate('/auth');
      return;
    }

    if (!navigator.onLine) {
      setError('No internet connection. Please reconnect before submitting.');
      return;
    }

    const subjectToSubmit = getSubjectForSubmission();

    if (!subjectToSubmit) {
      setError('Please select a subject or enter a new subject name.');
      return;
    }

    if (fileUploading) {
      setUploading(true);
    }

    if (!fileUploaded) {
      setUploading(true);
    }

    setError(null);

    try {
      // Build noteData WITHOUT client-side timestamps/authorUid
      const noteData = {
        name: title,
        semester: Number(semester), // ensure number type
        subject: subjectToSubmit,
        contributorName: contributorName || auth.currentUser.displayName || '',
        module,
        fileUrl: uploadedFileLink,
        fileId: uploadedFileId,
        likes: 0,
      };

      // Use retryOperation to handle transient network errors when writing to Firestore
      await retryOperation(() => addNote(noteData), 3, 500);

      console.log('Form submitted successfully.');

      setNotesUploaded(true);
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      // More useful message for network vs validation/rules error
      const msg = (error && error.message) ? error.message.toLowerCase() : '';
      if (!navigator.onLine || msg.includes('network') || msg.includes('offline')) {
        setError('Submission failed due to network. Please reconnect and try again.');
      } else if (msg.includes('permission') || msg.includes('denied')) {
        setError('Permission denied. Check your Firestore rules and authentication.');
      } else {
        setError('Submission failed. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto md:mt-20 mt-24 px-4 pt-2">
      <h1 className="text-3xl font-bold md:my-6 mb-3 text-center">Upload Notes</h1>
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-600 text-red-600 rounded backdrop-blur-lg">
          {error}
        </div>
      )}

      {notesUploaded && (
        <PopUpMessage
          message="Notes Uploaded 🎉🎉!"
          type="success"
          duration={5000}
        />
      )}

      <form onSubmit={handleSubmit} className="upload-container max-w-md bg-linear-to-r px-8 py-7 rounded-2xl mx-auto space-y-4">

        {fileUploading ? (
          <div>
            {fileUploaded ? (
              <div className='border-dashed border-2 border-blue-600  rounded-xl p-3'>
                <p className=' text-green-500 font-bold text-center'>Uploaded 🎉</p>
                <p className='text-gray-500 text-sm text-center font-semibold'>click Upload Note !</p>
                <PopUpMessage
                  message="SUBMIT NOW! ,File uploaded ✅!"
                  type="success"
                />
              </div>
            ) : (
              <div className='border-dashed border-blue-600 border-2 flex flex-col justify-center items-center rounded-xl p-3'>
                <div className='justify-center flex items-center'>
                  <p className=' text-red-500 text-center font-bold  '>uploading... {uploadProgress}%</p>
                  <p className='loader2 text-center flex align-middle justify-center'></p>
                </div>
                <p className='text-gray-500 text-sm text-center font-semibold'>{message}</p>
              </div>
            )}
          </div>
        ) : (<div>
          <div className='flex justify-center hover:bg-yellow-50 transition-all'>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="w-full text-center items-center  flex justify-center p-4 border-dashed border-black cursor-pointer hover:bg-green-00 transition-all border rounded-xl focus:ring-2 focus:ring-green-500"
            >
              <UploadIcon className="inline-block mr-5 size-5 items-center" />
              Upload File (PDF)
            </label>
          </div>
        </div>)}

        <div>
          <CustomSelect
            options={subjects}
            placeholder={selectedSubject || "Select a subject"}
            onChange={(selectedOption) => setSelectedSubject(selectedOption)}
          />

          {selectedSubject === 'Not mentioned' && (
            <div className="mt-2">
              <input
                ref={newSubjectInputRef}
                type="text"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                placeholder="Enter new subject name..."
                className="w-full p-2 border-2 border-blue-500 rounded-lg focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          )}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full p-2 border md:hover:bg-yellow-50 cursor-pointer transition-all border-gray-400 rounded-lg"
              required
            >
              <option value="">Select Semester</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full p-2 border-gray-400 md:hover:bg-yellow-50 cursor-pointer transition-all border rounded-lg"
              required
            >
              <option value="">Select Module</option>
              {["Module: 1", "Module: 2", "Module: 3", "Module: 4", "Module: 5", "assignment 1","assignment 2","All modules","Module: 1,2","Module: 2,3","Module: 3,4","Module: 4,5","Book", "questions", "others"].map(mod => (
                <option key={mod} value={mod}>{mod}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            College Name <span className='text-red-500'>*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: GEC Palamu, BIT Sindri "
            className="w-full p-2 border rounded-lg  font-semibold"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name (optional)
          </label>
          <input
            type="text"
            value={contributorName}
            onChange={(e) => setContributorName(e.target.value)}
            placeholder="Enter your name"
            className="w-full p-2 font-semibold border rounded-lg focus:ring-1"
          />
        </div>

        <button
          type="submit"
          disabled={uploading || !file || !fileUploaded}
          className={`w-full ${uploading || !file || !fileUploaded
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
            } text-black font-semibold  p-2 rounded-lg transition duration-200`}
        >
          {uploading ? 'Uploading...' : 'Upload Notes'}
        </button>
      </form>

      {uploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 transition-all z-50">
          <h1 className='loader'></h1>
        </div>
      )}

    </div>
  );
}

export default Upload;
