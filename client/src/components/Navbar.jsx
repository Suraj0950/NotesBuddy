import { Link } from 'react-router-dom';
import { BookOpen, LogOutIcon, UserIcon, User, MessageCircle, HandHeart, CloudUpload } from 'lucide-react';
import placeHolder from '../assets/placeholder.svg';
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import myProfile from '../assets/myProfile.jpg';
import './loader.css';

function Navbar({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // // Contributor logout: ensure signOut and auth are imported where you manage auth
  // const handleSignOut = async () => {
  //   const userConfirmed = window.confirm('Are you sure you want to sign out?');
  //   if (userConfirmed) {
  //     try {
  //       // await signOut(auth); // <-- uncomment and import signOut & auth
  //       console.log('Sign out placeholder (import signOut/auth to actually sign out)');
  //     } catch (error) {
  //       console.error('Error signing out:', error);
  //     }
  //   }
  // };

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
            <div className="flex items-center">
              {/* ChatBot link (hidden on small screens) */}
              <div className="relative group">
                <a
                  className="font-semibold hidden md:inline-block mx-5 border border-amber-400 p-2 rounded text-yellow-500 hover:bg-amber-100 transition-all duration-200"
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ChatBot
                </a>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full w-max bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                  OpenRoom
                </span>
              </div>

              <Link
                to="/upload"
                className="text-black uploadButton text-sm md:text-base px-3 py-1 md:px-5 md:py-2 mr-2 md:mr-4 border border-black rounded-full font-semibold hover:rounded-xl transition-all duration-300"
              >
                Upload
              </Link>

              {/* Profile button / dropdown */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={toggleMenu}
                  aria-haspopup="true"
                  aria-expanded={isMenuOpen}
                  className="flex items-center justify-center rounded-full transition-opacity focus:outline-none focus:ring-2 focus:ring-amber-300 p-1"
                >
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL || placeHolder}
                      alt={user?.displayName ?? 'Profile'}
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full object-cover aspect-square shadow-sm ring-1 ring-amber-100 hover:brightness-95 transition-all"
                    />
                  ) : (
                    <User className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full p-1 bg-gray-200 text-gray-500" />
                  )}
                </button>

                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10"
                      initial={{ opacity: 0, scale: 0.95, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -8 }}
                      transition={{ duration: 0.15 }}
                    >
                      <ul className="pb-2 px-1 bg-amber-50 rounded-xl">
                        <li className="py-2 border-b border-gray-300 hover:bg-amber-100 transition-all font-semibold cursor-pointer">
                          <Link to="/userpage" onClick={toggleMenu} className="flex items-center px-4">
                            <UserIcon size={18} className="mr-2" />
                            <span>Your Profile</span>
                          </Link>
                        </li>

                        <li className="mt-2 py-0 hover:bg-amber-100 rounded-2xl transition-all font-semibold cursor-pointer">
                          <Link to="/donate" onClick={toggleMenu} className="flex items-center px-4">
                            <HandHeart size={18} className="mr-2" />
                            <span>Donate us</span>
                          </Link>
                        </li>

                        <li className="py-1 hover:bg-amber-100 transition-all">
                          <Link to="/about" onClick={toggleMenu} className="flex items-center px-4">
                            <BookOpen size={18} className="mr-2" />
                            <span>About us</span>
                          </Link>
                        </li>

                        <li className="py-2">
                          <a
                            className="flex items-center px-4 font-semibold text-green-600 hover:bg-green-100 transition-all rounded"
                            href=""
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle size={18} className="mr-2" />
                            OpenRoom
                          </a>
                        </li>

                        <li
                          className="px-4 pt-3 pb-2 text-red-500 flex items-center rounded-2xl hover:bg-amber-100 transition-all font-semibold cursor-pointer"
                          onClick={handleSignOut}
                        >
                          <LogOutIcon size={16} className="mr-2" />
                          <span>Log Out</span>
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

