import { Link } from 'react-router-dom';
import { BookOpen, LogOutIcon, UserIcon, User, MessageCircle, HandHeart, CloudUpload } from 'lucide-react';
import placeHolder from '../assets/placeholder.svg';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import myProfile from '../assets/myProfile.jpg';
import './loader.css';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';


function Navbar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  

  const handleSignOut = async () => {
    const userConfirmed = window.confirm("Are you sure you want to sign out?");

    if (userConfirmed) {
      try {
        await signOut(auth);
        navigate('/')
      } catch (error) {
        console.error("Error signing out:", error);
      }
    } else {
      console.log("Sign out canceled by the user.");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((p) => !p);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="w-full h-20 shadow-md fixed border  flex items-center z-50 bg-[#101827] px-4 md:px-25">
      <div className="container mx-auto flex justify-between items-center p-2">
        <Link to="/" className="text-white text-2xl md:text-3xl">
          Notes<span className="text-[blue] ">Buddy</span>
        </Link>

        <div className="flex items-center">
          {user ? (
            <div className="flex items-center gap-4">
              
              <Link to="/upload" className="text-white flex items-center justify-center gap-2 bg-blue-700/10  hover:text-white delay-200 transition-all contributeButton  text-sm w-full text-center md:w-fit md:text-sm  md:py-2 px-3 py-2 md:px-4 rounded-full">
                <CloudUpload color="#00ffee" strokeWidth={2} absoluteStrokeWidth />
                Upload 
              </Link>

              {/* Profile button / dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  className="flex items-center justify-center rounded-full focus:outline-none focus:ring-4 focus:ring-amber-300 p-0"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full overflow-hidden ring-2 ring-amber-100 shadow-sm">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL || placeHolder}
                        alt={user?.displayName ?? 'Profile'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-full h-full p-2 bg-gray-200 text-gray-500" />
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      className="
                        absolute right-0 mt-3 w-64
                        rounded-3xl
                        border border-white/30
                        bg-white/80 backdrop-blur-2xl
                        shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                        z-50 overflow-hidden
                      "
                      initial={{ opacity: 0, scale: 0.94, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.94, y: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {/* Stylish Arrow */}
                      <div className="absolute -top-2 right-6 w-5 h-5 bg-white/60 backdrop-blur-xl border border-white/20 rotate-45 shadow-md"></div>

                      {/* User Header */}
                      <div className="flex items-center gap-2 px-4 py-4 border-b  border-gray-100/60 bg-white/40">

                        {user?.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt="Profile"
                            className="h-12 w-12 rounded-3xl object-cover shadow-md border-2 border-gray-300"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-2xl bg-amber-200 flex items-center justify-center text-amber-900 font-bold text-lg shadow-md">
                            {user?.displayName?.charAt(0).toUpperCase() ||
                              user?.email?.charAt(0).toUpperCase() ||
                              "U"}
                          </div>
                        )}

                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-slate-800 truncate">
                            {user?.displayName || "User"}
                          </span>
                          <span className="text-xs text-slate-500 truncate">{user?.email}</span>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <ul className="py-3 ">
                        <li>
                          <Link
                            to="/userpage"
                            onClick={toggleMenu}
                            className="
                              flex items-center gap-3 px-5 py-3 
                              hover:bg-amber-50/70 active:bg-amber-100 
                              transition-all duration-150 rounded-xl mx-3
                            "
                          >
                            <span className="bg-amber-100 text-amber-700 p-2 rounded-xl shadow-sm">
                              <UserIcon size={16} />
                            </span>
                            <p className="text-sm font-medium text-slate-800">Your Profile</p>
                          </Link>
                        </li>

                        <li>
                          <Link
                            to="/about"
                            onClick={toggleMenu}
                            className="
                              flex items-center gap-3 px-5 py-3 
                              hover:bg-amber-50/70 active:bg-amber-100 
                              transition-all duration-150 rounded-xl mx-3
                            "
                          >
                            <span className="bg-amber-100 text-amber-700 p-2 rounded-xl shadow-sm">
                              <BookOpen size={16} />
                            </span>
                            <p className="text-sm font-medium text-slate-800">About us</p>
                          </Link>
                        </li>

                        {/* Divider */}
                        <div className="my-3 mx-5 h-px bg-gray-500/60"></div>

                        <li>
                          <button
                            onClick={handleSignOut}
                            className="
                              w-full flex items-center gap-3 px-5 py-3 
                              text-red-600  active:bg-red-100 
                              transition-all duration-150 rounded-xl mx-3
                              cursor-pointer
                            "
                          >
                            <span className="bg-red-100 text-red-600 p-2 rounded-xl shadow-sm">
                              <LogOutIcon size={16} />
                            </span>
                            <p className="font-semibold text-sm">Log Out</p>
                          </button>
                        </li>
                      </ul>
                    </motion.div>

                  )}
                </AnimatePresence> 
              </div>
            </div>
          ) : (
            // NOT LOGGED IN view
            <div className="flex items-center gap-4 md:gap-3">
              <div className="relative group">
                
              </div>

              <Link to="/auth" className="text-white flex items-center justify-center gap-2 bg-blue-700/10  hover:text-white delay-200 transition-all contributeButton  text-sm w-full text-center md:w-fit md:text-sm  md:py-2 px-3 py-2 md:px-4 rounded-full">
                <CloudUpload color="#00ffee" strokeWidth={2} absoluteStrokeWidth />
                Upload Notes
              </Link>

              <Link to="/about" aria-label="About">
               <div className="w-10 h-10 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white">
                 <img
                   src={myProfile || placeHolder}
                   alt="Profile"
                   className="w-full h-full object-cover object-center hover:brightness-70 transition-all"
                 />
                </div>
              </Link>

            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

