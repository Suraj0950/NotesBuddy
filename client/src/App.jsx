import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import NotesContextProvider from './components/context/NotesContextProvider';
import SavedNotesContextProvider from './components/context/SavedNotesContextProvider';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { auth } from './firebase';
import ContributorAuth from './components/ContributorAuth';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import AboutMe from './components/AboutMe';


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
          <div className = 'min-h-screen bg-linear-to-br flex items-center flex-col from-amber-300 to-amber-50'>
            <Navbar user={user}/>
            <main className='w-full max-w-4xl px-4 py-8'>
              <Routes>
                <Route path = '/' element = {<Dashboard/>}/>
                <Route path = '/auth' element = {<ContributorAuth/>}/>
                <Route path='about' element = {<AboutMe/>}/>
              </Routes>
            </main>  
          </div>
        </Router>
      </SavedNotesContextProvider>
    </NotesContextProvider>
  )
}

export default App
