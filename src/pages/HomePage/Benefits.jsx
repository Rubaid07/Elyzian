import React from 'react';

const benefits = [
  {
    title: "Instant Quote Calculation",
    description: "Get an immediate estimate of your policy premium based on your needs with our advanced algorithm.",
    icon: (
      <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
      </svg>
    ),
    gradient: "from-blue-50 to-white"
  },
  {
    title: "Expert Agent Support",
    description: "Our dedicated, licensed agents provide personalized guidance at every step of your insurance journey.",
    icon: (
      <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636a9 9 0 010 12.728m0 0l-5.044-5.044m5.044 5.044L14.707 18.364l-2.03-2.03m-2.293-2.293L7.757 11.243a1 1 0 010-1.414l5.657-5.657a1 1 0 011.414 0z"></path>
      </svg>
    ),
    gradient: "from-green-50 to-white"
  },
  {
    title: "100% Online Application",
    description: "Complete your entire application digitally with our streamlined, paperless process.",
    icon: (
      <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1v-3.25m-7.667 0C5.166 17.087 5 17.584 5 18a2 2 0 002 2h10a2 2 0 002-2c0-.416-.166-.913-.333-1.25M17 11V9a2 2 0 00-2-2H9a2 2 0 00-2 2v2M7 11h10"></path>
      </svg>
    ),
    gradient: "from-purple-50 to-white"
  },
  {
    title: "Secure Online Payments",
    description: "Bank-level encryption protects all transactions through our PCI-compliant payment system.",
    icon: (
      <svg className="w-12 h-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
      </svg>
    ),
    gradient: "from-red-50 to-white"
  },
  {
    title: "Real-Time Claim Tracking",
    description: "24/7 access to your claim status with automated updates at every processing stage.",
    icon: (
      <svg className="w-12 h-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197 2.132A1 1 0 0110 13.047V10.16c0-.417.387-.697.747-.577l3.197 1.066z"></path>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    ),
    gradient: "from-yellow-50 to-white"
  },
  {
    title: "Personalized Dashboard",
    description: "Your centralized hub for policy management, documents, and premium payments.",
    icon: (
      <svg className="w-12 h-12 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
      </svg>
    ),
    gradient: "from-teal-50 to-white"
  },
];

const Benefits = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-sky-600">Elyzian</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We combine cutting-edge technology with human expertise to deliver an insurance experience that's simple, smart, and secure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="group relative overflow-hidden bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              <div className="relative z-10 p-8 h-full flex flex-col">
                <div className="mb-6 p-3 bg-white rounded-lg shadow-sm w-16 h-16 flex items-center justify-center group-hover:bg-opacity-90 transition-all">
                  {benefit.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-sky-700 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {benefit.description}
                </p>
                <div className="mt-auto">
                  <div className="w-10 h-1 bg-sky-500 group-hover:w-16 transition-all duration-300"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;