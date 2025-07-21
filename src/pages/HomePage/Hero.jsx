import React from 'react';
import { Link } from 'react-router';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-white min-h-screen flex justify-center px-6 md:px-20 py-12 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-100 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 rounded-full bg-blue-200 opacity-15 blur-3xl"></div>
        
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, #3b82f6 1px, transparent 1px),
              linear-gradient(to bottom, #3b82f6 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)"
          }}
        />
      </div>

      <div className="z-10 max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 md:gap-20">
        <div className="saira text-center md:text-left space-y-6 md:space-y-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
            Secure Your Future with <span className="text-sky-600">Elyzian</span>
          </h1>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl">
            We provide trusted insurance solutions to protect what matters most - your family, your health, and your peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to="/policies" className="px-8 py-3 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-medium transition-all cursor-pointer">
              Get Free Quote
            </Link>
          </div>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">24/7 Customer Support</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-gray-700">Customized Plans</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="relative z-10">
            <img
             src="https://i.postimg.cc/HL8ySzj7/freepik-assistant-1753026447055.png"
              alt="Family Protection"
              className="w-[300px] md:w-[450px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;