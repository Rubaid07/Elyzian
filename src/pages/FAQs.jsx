import React, { useState } from 'react';
import { FaQuestionCircle, FaInfoCircle, FaPhoneAlt, FaEnvelope, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqItems = [
    {
      question: "How do I apply for a policy?",
      answer: "You can apply for your chosen policy directly through our website. Simply select the policy that meets your needs, click 'Apply Now,' and follow the instructions to complete the application form and upload any required documents. Our streamlined process typically takes less than 10 minutes to complete.",
      extended: "For corporate policies or group coverage, please contact our business solutions team who will guide you through the specialized application process tailored for organizations."
    },
    {
      question: "What payment methods are available for premiums?",
      answer: "We offer several convenient payment options for your premiums, including online gateways like bKash, Nagad, Rocket, and major credit/debit cards.",
      extended: "For annual payments, we provide a 5% discount on most policies. You can also set up automatic payments through our customer portal to ensure you never miss a payment deadline."
    },
    {
      question: "Can I manage my policy online?",
      answer: "Yes, our dedicated customer portal allows you to easily manage your policy online.",
      extended: "Features include: viewing policy details, making premium payments, updating personal information, downloading policy documents, submitting claims, tracking claim status, and accessing your digital insurance card 24/7."
    },
    {
      question: "What is the claim submission process?",
      answer: "To submit a claim, please visit the 'Claims' section on our website or contact our helpline.",
      extended: "The process involves: 1) Completing the claim form, 2) Submitting required documents (medical reports, police reports for accidents, etc.), 3) Claim assessment by our team (typically 5-7 business days), 4) Approval and disbursement of funds. We assign a dedicated claims officer to guide you through each step."
    },
    {
      question: "How is my personal data secured?",
      answer: "We prioritize the security of your personal information with advanced encryption and robust security measures.",
      extended: "Our security measures include: AES-256 encryption for all data, regular security audits, two-factor authentication for account access, and strict access controls. We are GDPR compliant and never share your data with third parties without explicit consent."
    },
    {
      question: "Where can I find detailed coverage information?",
      answer: "Detailed coverage information is available on each policy's 'Details' page.",
      extended: "For complex queries, our customer support team is available via live chat (8AM-10PM daily), email (response within 24 hours), or scheduled video consultation with our insurance advisors."
    },
    {
      question: "What are the rules for policy cancellation?",
      answer: "Cancellation rules vary by policy type and terms.",
      extended: "Standard policies: Full refund if cancelled within 14 days (cooling-off period). After that, pro-rata refund based on unused coverage period minus administrative fees. Specialized policies may have different terms - always check your policy document or consult our team."
    }
  ];

  return (
    <section className="bg-gradient-to-b from-sky-50 to-white py-16 px-4 ">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center bg-sky-100 rounded-full p-5 mb-6">
            <FaQuestionCircle className="text-5xl text-sky-600 opacity-90" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
            Frequently Asked <span className="text-sky-600">Questions</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Everything you need to know about our services and policies. Can't find what you're looking for?
          </p>
        </div>

        <div className="space-y-6">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${activeIndex === index ? 'ring-2 ring-sky-300' : 'hover:shadow-lg'}`}
            >
              <button
                className="w-full text-left p-6 md:p-8 focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <FaInfoCircle className="text-sky-500 text-2xl mt-1 mr-4 flex-shrink-0" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.question}
                    </h3>
                  </div>
                  {activeIndex === index ? (
                    <FaChevronUp className="text-sky-500 ml-4 flex-shrink-0" />
                  ) : (
                    <FaChevronDown className="text-sky-500 ml-4 flex-shrink-0" />
                  )}
                </div>
              </button>
              
              <div className={`px-6 pb-6 md:px-8 md:pb-8 transition-all duration-300 ${activeIndex === index ? 'block' : 'hidden'}`}>
                <div className="pl-10 border-l-2 border-sky-200">
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                    {item.answer}
                  </p>
                  {item.extended && (
                    <div className="mt-4 p-4 bg-sky-50 rounded-lg">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {item.extended}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-sky-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Still have questions?</h2>
            <p className="text-xl mb-8 opacity-90">
              Our customer support team is available 24/7 to assist you with any queries or concerns you may have about our policies or services.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="tel:+8801234567890" className="inline-flex items-center justify-center px-6 py-3 bg-white text-sky-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
                <FaPhoneAlt className="mr-2" /> +880 1234 567890
              </a>
              <a href="mailto:support@example.com" className="inline-flex items-center justify-center px-6 py-3 bg-sky-700 text-white rounded-lg hover:bg-sky-800 transition-colors font-medium">
                <FaEnvelope className="mr-2" /> elyzian@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;