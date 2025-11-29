import React from 'react';

function ContributorAuth() {



  return (
    // Main div
    <div className='container mx-auto md:mt-20 mt-14 px-4 py8'>
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
      <div className='mt-5 max-w-md mx-auto login-container p-8 rounded-xl'>
        <button>
          This is button
        </button>
      </div>
      
    </div> 
  );
}

export default ContributorAuth;
