import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import NotesContextProvider from './components/context/NotesContextProvider';
import SavedNotesContextProvider from './components/context/SavedNotesContextProvider';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import { auth } from './firebase';
import ContributorAuth from './components/ContributorAuth';
import { useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';


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
          <div className = 'min-h-screen bg-linear-to-r flex items-center flex-col from-yellow-50 to-amber-50'>
            <Navbar user={user}/>
            <Routes>
              <Route path = '/' element = {<Dashboard/>}/>
              <Route path = '/auth' element = {<ContributorAuth/>}/>


            </Routes>
          </div>
        </Router>
      </SavedNotesContextProvider>
    </NotesContextProvider>
  )
}

export default App
