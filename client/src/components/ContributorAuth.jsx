import React, { useState } from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
//import {GoogleLogo} from '../assets/GoogleLogo.gif';

function ContributorAuth() {
  const [isLoading, setIsLoading] = useState({
    googleSignIn: false,
    sendOtp: false,
    verifyOtp: false,
    createAccount: false,
    signIn: false
  });

  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(prev => ({ ...prev, googleSignIn: true}));
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user;
      // Check the email ends with .com
      if ( user.email.endsWith('.com')) {
        // Sign Out the user if they don't have an email ends with .com
        await auth.signOut();
        alert('Only .com email address area allowed');
        return;
      }
      navigate('/upload')
    } catch (error) {
      console.error('Error signing in with Google:', error);
      alert('Google Sign-In failed. Please try again.');
    } finally {
      setIsLoading(prev => ({ ...prev, googleSignIn: false }));
    }
  };



  return (
    // Main div
    <div className='container mx-auto md:mt-20 mt-14 px-4 py8 '>
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
      <div className='mt-5 max-w-md mx-auto login-container p-6 rounded-2xl'>
        <button 
          className='w-full flex flex-row justify-center gap-2 border-2 border-gray-200 hover:border-gray-300 bg-amber-50 items-center font-bold py-3 text-black rounded-2xl transition-colors duration-300 disabled:opacity-50'
          disabled = {isLoading.googleSignIn}
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
      </div>
      
    </div> 
  );
}

export default ContributorAuth;
