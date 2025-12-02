import React, { useState, useRef } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  getAuth
} from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

function ContributorAuth() {
  const [phone, setPhone] = useState(''); // expect international format e.g. +919876543210
  const [otp, setOtp] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);

  const [isLoading, setIsLoading] = useState({
    googleSignIn: false,
    sendOtp: false,
    verifyOtp: false,
    createAccount: false,
    signIn: false
  });

  const recaptchaRenderedRef = useRef(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(prev => ({ ...prev, googleSignIn: true}));
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      navigate('/upload');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, googleSignIn: false }));
    }
  };

  //  Hamko yhn se phone number with otp verification system add karna hai.

  // setup reCAPTCHA - invisible. 
  const setupRecaptcha = () => {
    // If already rendered, try to return existing verifier instance from window
    if (recaptchaRenderedRef.current && window.recaptchaVerifierInstance) {
      return window.recaptchaVerifierInstance;
    }

    // Clear any previous instance to avoid cross-instance mismatches
    if (window.recaptchaVerifierInstance) {
      try {
        if (typeof window.recaptchaVerifierInstance.clear === 'function') {
          window.recaptchaVerifierInstance.clear();
        }
      } catch (err) {
        console.warn('Failed to clear previous Recaptcha instance:', err);
      }
      delete window.recaptchaVerifierInstance;
      recaptchaRenderedRef.current = false;
    }

    // Ensure auth instance exists; fallback to getAuth()
    let authInstance = auth;
    try {
      if (!authInstance) {
        authInstance = getAuth(); // fallback
        console.warn("Using getAuth() fallback — check firebase.js export.");
      }
    } catch (err) {
      console.error('getAuth() fallback error:', err);
    }

    // Debug logs
    console.log("setupRecaptcha - authInstance:", authInstance);
    if (!authInstance) {
      throw new Error(
        "Firebase Auth instance is undefined. Ensure firebase.js exports: export const auth = getAuth(app)"
      );
    }

    // DEV ONLY: avoid internal Recaptcha constructor error by allowing auth to have this testing flag.
    // Wrapped in hostname check so it only runs on localhost.
    try {
      if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        authInstance.settings = authInstance.settings || {};
        authInstance.settings.appVerificationDisabledForTesting = true;
        console.warn('Temporarily set authInstance.settings.appVerificationDisabledForTesting = true (dev only)');
      }
    } catch (e) {
      console.warn('Could not set appVerificationDisabledForTesting (non-fatal):', e);
    }

    const verifier = new RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' },
      authInstance
    );

    // render() returns a promise that resolves to widgetId
    verifier.render().then(() => {
      window.recaptchaVerifierInstance = verifier;
      recaptchaRenderedRef.current = true;
    }).catch((err) => {
      // rendering can fail silently; keep verifier reference anyway
      console.warn('reCAPTCHA render failed:', err);
      window.recaptchaVerifierInstance = verifier;
      recaptchaRenderedRef.current = true;
    });

    // return verifier reference (may or may not be fully rendered yet)
    window.recaptchaVerifierInstance = verifier;
    return verifier;
  };

 
  const createLocalAppVerifier = () => {
    const mock = {
      type: 'invisible',
      verify: () => {
        // Return a resolved promise with a fake token. The SDK won't validate this token
        // when auth emulator or appVerificationDisabledForTesting is used.
        return Promise.resolve('mock-verifier-token');
      },
      clear: () => {
        // no-op
      }
    };
    return mock;
  };

  const getAppVerifier = () => {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      // Use mock verifier (dev only)
      return createLocalAppVerifier();
    }
    // Production / remote hosts: use real RecaptchaVerifier
    return setupRecaptcha();
  };

  // Send OTP to phone number
  const sendOtp = async (e) => {
    e.preventDefault();

    // Basic phone validation (international format)
    if (!phone || !/^\+\d{6,15}$/.test(phone)) {
      alert('Please enter phone in international format, e.g. +919876543210');
      return;
    }

    setIsLoading(prev => ({ ...prev, sendOtp: true }));
    try {
      // Use getAppVerifier() which returns mock verifier on localhost
      const appVerifier = getAppVerifier(); // RecaptchaVerifier instance OR mock
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setVerificationSent(true);
      alert(`OTP sent to ${phone}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      // Common error codes: auth/invalid-phone-number, auth/quota-exceeded, auth/app-not-authorized
      alert('Failed to send OTP. Check console for details.');
      // If reCAPTCHA caused issues (already rendered), you might need to clear and recreate in future attempts.
    } finally {
      setIsLoading(prev => ({ ...prev, sendOtp: false }));
    }
  };

  // Verify OTP entered by user
  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || !confirmationResult) {
      alert('No OTP verification in progress or OTP is empty.');
      return;
    }

    setIsLoading(prev => ({ ...prev, verifyOtp: true }));
    try {
      const userCredential = await confirmationResult.confirm(otp);
      console.log('Phone verified, user:', userCredential.user);
      navigate('/upload');
    } catch (error) {
      console.error('OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, verifyOtp: false }));
    }
  };

  const resetForm = () => {
    setPhone('');
    setOtp('');
    setVerificationSent(false);
    setConfirmationResult(null);
    // Keep recaptcha rendered (unless you want to clear it)
  };

  const Loader = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className='container mx-auto md:mt-20 mt-50 px-4 py8 '>
      {/* Logo div */}
      <div className='flex items-center justify-center mt-40'>
        <h1 className="text-black text-2xl md:text-3xl font-bold font-mono">
          Notes
          <span className="text-[blue] font-bold ">
            Buddy
          </span>
        </h1>
      </div>

      {/* Container div */}
      <div className='mt-5 max-w-md mx-auto login-container p-8 rounded-2xl'>
        <button 
          className='w-full flex flex-row justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 bg-amber-50 items-center font-bold py-3 text-black rounded-2xl transition-colors duration-300 disabled:opacity-50'
          disabled={isLoading.googleSignIn}
          onClick={handleGoogleSignIn}
        >
          <lord-icon
            src="https://cdn.lordicon.com/eziplgef.json"
            delay="2500"
            trigger="loop"
            state="in-reveal"
          >
          </lord-icon>
          <span>SignIn with Google</span>
        </button>

        <h1 className='text-center mt-2 text-black font-bold pb-4'>OR</h1>

        {/* PHONE OTP FLOW */}
        {!verificationSent ? (
          <form onSubmit={sendOtp} className="space-y-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone (e.g. +919876543210)"
              className="w-full p-3.5 border-2 bg-indigo-400/10 border-gray-300 rounded-2xl font-semibold"
              required
              disabled={isLoading.sendOtp || isLoading.verifyOtp}
            />

            <button
              type="submit"
              disabled={isLoading.sendOtp}
              className="w-full font-bold p-3 rounded-full mt-4 bg-linear-to-r from-blue-950 to-black text-white hover:bg-blue-600 transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading.sendOtp ? <Loader /> : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyOtp} className="space-y-4">
            <div className="text-center text-green-500 mb-2">
              OTP sent to {phone}. Enter OTP to verify.
            </div>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 border-2 rounded-lg"
              required
              disabled={isLoading.verifyOtp}
            />

            <button
              type="submit"
              disabled={isLoading.verifyOtp}
              className="w-full mt-2 font-bold p-2 rounded bg-linear-to-r from-cyan-400 to-green-400 text-black hover:bg-green-600 transition-colors duration-300 disabled:opacity-50"
            >
              {isLoading.verifyOtp ? <Loader /> : 'Verify OTP'}
            </button>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  // Allow user to change number / resend - reset verification state
                  resetForm();
                }}
                className="flex-1 text-sm underline"
              >
                Use different number
              </button>
             
              <button
                type="button"
                onClick={async () => {
                  // Resend OTP to same number
                  if (!phone) {
                    alert('Phone is empty.');
                    return;
                  }
                  setIsLoading(prev => ({ ...prev, sendOtp: true }));
                  try {
                    const appVerifier = getAppVerifier();
                    const result = await signInWithPhoneNumber(auth, phone, appVerifier);
                    setConfirmationResult(result);
                    setVerificationSent(true);
                    alert(`OTP resent to ${phone}`);
                  } catch (err) {
                    console.error('Resend failed:', err);
                    alert('Failed to resend OTP.');
                  } finally {
                    setIsLoading(prev => ({ ...prev, sendOtp: false }));
                  }
                }}
                className="flex-1 text-sm underline"
              >
                Resend OTP
              </button>
            </div>
          </form>
        )}

        {/* reCAPTCHA container required by Firebase Phone Auth */}
        <div id="recaptcha-container" />

      </div>
    </div>
  );
}

export default ContributorAuth;
