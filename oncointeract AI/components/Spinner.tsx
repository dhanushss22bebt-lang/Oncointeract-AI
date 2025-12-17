import React from 'react';

const Spinner: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full animate-pulse"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
      </div>
      {message && <p className="text-blue-700 font-medium animate-pulse">{message}</p>}
    </div>
  );
};

export default Spinner;
