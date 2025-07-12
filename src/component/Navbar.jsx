import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { CgLogOut } from 'react-icons/cg';

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);

  const handleLogout = () => {
    logOut()
      .then(() => toast.success('Logged out successfully'))
      .catch((err) => console.log(err));
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/policies', label: 'All Policies' },
    { to: '/agents', label: 'Agents' },
    { to: '/faqs', label: 'FAQs' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          <Link to="/" className="flex-shrink-0">
            <img src={logo} alt="Logo" className="h-8 sm:h-10" />
          </Link>

          <ul className="menu menu-horizontal hidden md:flex space-x-8 font-semibold">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive
                      ? 'text-sky-700'
                      : 'text-gray-600 hover:text-sky-700 transition-colors duration-200'
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center space-x-4">

            <div className="hidden md:flex items-center space-x-4">
              {!user && (
                <Link
                  to="/login"
                  className="btn btn-outline btn-sm border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition"
                >
                  Login
                </Link>
              )}

              {user && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-circle avatar border-2 border-sky-500 p-0 cursor-pointer"
                    title={user.displayName || 'User'}
                  >
                    <div className="w-10 rounded-full overflow-hidden">
                      <img
                        src={user.photoURL || '/default-avatar.png'}
                        alt="User avatar"
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white rounded-box w-56 font-semibold"
                  >
                    <li>
                      <Link to="/dashboard" className="hover:text-sky-700">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 hover:bg-red-100 w-full text-left py-2"
                      >
                        <CgLogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex md:hidden items-center space-x-3">

              {user && (
                <div className="dropdown dropdown-end">
                  <label
                    tabIndex={0}
                    className="btn btn-circle avatar border-2 border-sky-500 p-0 cursor-pointer"
                    title={user.displayName || 'User'}
                  >
                    <div className="w-10 rounded-full overflow-hidden">
                      <img
                        src={user.photoURL || '/default-avatar.png'}
                        alt="User avatar"
                      />
                    </div>
                  </label>
                  <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-white rounded-box w-56 font-semibold"
                  >
                    <li>
                      <Link to="/dashboard" className="hover:text-sky-700">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="text-red-600 hover:bg-red-100 w-full text-left py-2"
                      >
                        <CgLogOut size={16} />
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <svg
                    className="w-6 h-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </label>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-white rounded-box w-52"
                >
                  {navLinks.map(({ to, label }) => (
                    <li key={to}>
                      <NavLink
                        to={to}
                        className={({ isActive }) =>
                          isActive
                            ? 'text-sky-700'
                            : 'hover:text-sky-700'
                        }
                      >
                        {label}
                      </NavLink>
                    </li>
                  ))}
                  {!user && (
                    <li>
                      <Link
                        to="/login"
                        className="btn btn-outline btn-sm border-sky-700 text-sky-700 hover:bg-sky-700 hover:text-white transition"
                      >
                        Login
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}
