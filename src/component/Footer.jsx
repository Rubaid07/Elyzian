import React from 'react';
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import logo from '../assets/logo.png';
import { Link } from 'react-router';

const Footer = () => {
    return (
        <footer className="bg-sky-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    
                    <div>
                        <img src={logo} alt="Logo" className="h-8 sm:h-10" />
                        <p className="text-gray-500 text-sm mt-4">
                            We are committed to securing your valuable life and future. Our diverse insurance plans are designed to meet your every need.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-sky-700">Quick Links</h3>
                        <ul>
                            <li className="mb-2">
                                <Link to="/" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">Home</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/policies" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">All Policies</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/blogs" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">Blogs</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/faqs" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">FAQs</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-sky-700">Legal & Support</h3>
                        <ul>
                            <li className="mb-2">
                                <Link to="/privacy-policy" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">Privacy Policy</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/terms-of-service" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">Terms of Service</Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/faqs" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">FAQ</Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-sky-700">Contact Us</h3>
                        <p className="text-gray-500 text-sm mb-2">
                            Address: Zakir Hossain Road, Chattogram, Bangladesh
                        </p>
                        <p className="text-gray-500 text-sm mb-2">
                            Phone: +880 1234 567890
                        </p>
                        <p className="text-gray-500 text-sm mb-4">
                            Email: mohammadrubaid07@gmail.com
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/rubaid.rahman.589" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">
                                <FaFacebookF className="h-6 w-6" />
                            </a>
                            <a href="https://x.com/Rubaid077" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">
                                <FaXTwitter className="h-6 w-6" />
                            </a>
                            <a href="https://github.com/Rubaid07" target="_blank" rel="noopener noreferrer" aria-label="Github" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">
                                <FaGithub className="h-6 w-6" />
                            </a>
                            <a href="https://www.linkedin.com/in/rubaid07" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-500 hover:text-sky-700 transition-colors duration-300">
                                <FaLinkedinIn className="h-6 w-6" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-300 mt-8 pt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Elyzian. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;