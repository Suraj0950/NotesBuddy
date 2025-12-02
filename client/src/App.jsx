import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import NotesContextProvider from './components/context/NotesContextProvider';
import SavedNotesContextProvider from './components/context/SavedNotesContextProvider';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ContributorAuth from './components/ContributorAuth';
import AboutMe from './components/AboutMe';
import bg from './assets/bg3.jpg';
import Chatbot from './components/Chatbot';
import Upload from './components/Upload';
import UserPage from './components/UserPage';


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <NotesContextProvider>
      <SavedNotesContextProvider>
        <Router>
          <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center flex-col"
            style={{ backgroundImage: `url(${bg})` }}
          >
            <Navbar user={user} />
            <Chatbot/>
            <main className="w-full max-w-4xl px-4 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auth" element={<ContributorAuth />} />
                <Route path="/about" element={<AboutMe />} />
                <Route path="/upload" element={<Upload/>} />
                <Route path="/userpage" element={<UserPage/>} />
                
              </Routes>
            </main>
          </div>
        </Router>
      </SavedNotesContextProvider>
    </NotesContextProvider>
  );
}

export default App;
