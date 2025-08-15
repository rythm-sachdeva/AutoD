import { useState,useEffect } from "react";

//@ts-ignore
export function LoginFailedToast({ message, onClose }) {
  // State to manage the fade-out animation
  const [isExiting, setIsExiting] = useState(false);

  // Automatically close the toast after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
    }, 5000); // 5 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  // Handle the actual close after the animation completes
  useEffect(() => {
    if (isExiting) {
      const exitTimer = setTimeout(onClose, 300); // Corresponds to animation duration
      return () => clearTimeout(exitTimer);
    }
  }, [isExiting, onClose]);


  const handleClose = () => {
    setIsExiting(true);
  };

  return (
    <div
      className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x divide-gray-200 rounded-xl shadow-lg dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800 transition-all duration-300 ease-in-out transform ${isExiting ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}
      role="alert"
    >
      {/* Error Icon */}
      <div className="flex-shrink-0 text-red-500 dark:text-red-400">
        <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/>
        </svg>
        <span className="sr-only">Error icon</span>
      </div>
      {/* Message */}
      <div className="pl-4 text-sm font-normal">{message}</div>
      {/* Close Button */}
      <button
        type="button"
        className="p-1.5 -m-1.5 ml-auto inline-flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 hover:bg-gray-100 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
        aria-label="Close"
        onClick={handleClose}
      >
        <span className="sr-only">Close</span>
        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
        </svg>
      </button>
    </div>
  );
}