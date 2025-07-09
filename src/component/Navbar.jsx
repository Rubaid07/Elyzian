import React from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../assets/logo.png';

export default function Navbar() {
  const handleToggle = () => {
    const menu = document.getElementById('navbar-menu');
    if (menu) {
      menu.classList.toggle('hidden');
    }
  };

  const handleCloseMenu = () => {
    if (window.innerWidth < 768) {
      const menu = document.getElementById('navbar-menu');
      if (menu && !menu.classList.contains('hidden')) {
        menu.classList.add('hidden');
      }
    }
  };

  const handleLinkClick = () => {
    handleCloseMenu();
  };

  return (
    <nav className="border-b border-gray-200 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center" onClick={handleLinkClick}>
          <img src={logo} className="h-10 sm:h-12" alt="Elyzian Logo" />
        </Link>

        <button
          onClick={handleToggle}
          className="md:hidden inline-flex items-center p-2 text-gray-600 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
          aria-controls="navbar-menu"
          aria-expanded="false"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M3 5h14M3 10h14M3 15h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="hidden w-full md:block md:w-auto" id="navbar-menu">
          <ul className="font-medium flex flex-col md:flex-row md:space-x-6 md:items-center mt-4 md:mt-0">
            {[
              { to: '/', label: 'Home' },
              { to: '/policies', label: 'All Policies' },
              { to: '/agents', label: 'Agents' },
              { to: '/faqs', label: 'FAQs' },
            ].map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={handleLinkClick}
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 transition-colors duration-200 ${
                      isActive ? 'text-[#0199cc]' : 'hover:text-[#0199cc]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
            <li>
              <Link
                to="/login"
                onClick={handleLinkClick}
                className="block py-2 px-4 mt-2 md:mt-0 border border-[#0199cc] text-[#0199cc] rounded hover:bg-[#0199cc] hover:text-white transition-colors duration-200 text-center"
              >
                Login
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
