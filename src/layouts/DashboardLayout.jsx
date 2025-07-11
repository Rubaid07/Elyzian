import { Outlet, NavLink } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import { FaUserShield, FaWallet, FaList, FaUser, FaSignOutAlt, FaBars } from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAxiosSecure from '../hooks/useAxiosSecure';

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  const handleLogout = () => {
    logOut()
      .then(() => toast.success('Logged out successfully'))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/users/${user.email}`)
        .then(res => {
          setRole(res.data?.role || 'customer');
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, axiosSecure]);

  const navLinks = [
    { label: 'Profile', to: '/dashboard/profile', icon: <FaUser className="text-lg" /> },
    ...(role === 'admin'
      ? [
        { label: 'Manage Users', to: '/dashboard/manage-users', icon: <FaUserShield className="text-lg" /> },
        { label: 'Manage Policies', to: '/dashboard/manage-policies', icon: <FaList className="text-lg" /> },
        { label: 'Transactions', to: '/dashboard/transactions', icon: <FaWallet className="text-lg" /> },
        { label: 'Manage Agents', to: '/dashboard/manage-agents', icon: <FaUser className="text-lg" /> },
      ]
      : role === 'agent'
        ? [
          { label: 'Assigned Customers', to: '/dashboard/assigned-customers', icon: <FaUser className="text-lg" /> },
          { label: 'Manage Blogs', to: '/dashboard/manage-blogs', icon: <FaList className="text-lg" /> },
          { label: 'Post Blog', to: '/dashboard/add-blog', icon: <FaList className="text-lg" /> },
        ]
        : [
          { label: 'My Policies', to: '/dashboard/my-policies', icon: <FaList className="text-lg" /> },
          { label: 'Payment', to: '/dashboard/payment', icon: <FaWallet className="text-lg" /> },
          { label: 'Claim Request', to: '/dashboard/claim', icon: <FaUserShield className="text-lg" /> },
        ]),
  ];
  if (loading) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col bg-gray-50 min-h-screen">
        <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle">
            <FaBars className="text-sky-700 text-xl" />
          </label>
          <img src={logo} alt="Logo" className="h-8" />
          <div className="w-8"></div>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

      <div className="drawer-side z-20">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="menu p-4 w-72 min-h-full bg-white text-base-content flex flex-col border-r border-gray-200">
          <div className="flex items-center gap-3 mb-6 p-2">
            <img src={logo} alt="Logo" className="h-8" />
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={user?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'} alt="User" />
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user?.displayName || "Guest User"}</p>
              <p className="text-sm text-gray-500 truncate">{user?.email || "No email"}</p>
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              {navLinks.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                        ? 'bg-sky-50 text-sky-700 font-medium border-l-4 border-sky-700'
                        : 'hover:bg-gray-100 text-gray-700'
                      }`
                    }
                  >
                    <span className="text-sky-600">{icon}</span>
                    <span>{label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto pt-4 border-t border-gray-200">
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200">
              <FaSignOutAlt className="text-lg" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;