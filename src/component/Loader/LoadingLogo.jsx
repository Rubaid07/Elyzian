import logo from '../../assets/logo.png';
import { useEffect, useState } from 'react';

const LoadingLogo = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 10));
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 space-y-6">
      <div className="animate-bounce duration-1000 ease-in-out infinite">
        <img 
          src={logo} 
          alt="Loading..." 
          className="h-8" 
        />
      </div>
      
      <div className="w-48 bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-sky-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <p className="text-gray-600 font-medium">
        Loading {progress}%
      </p>
    </div>
  );
};

export default LoadingLogo;