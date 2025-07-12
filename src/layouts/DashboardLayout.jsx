import { Outlet, NavLink, Link, useLocation } from 'react-router';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import logo from '../assets/logo.png';
import {
  FaUser, FaUserShield, FaList, FaWallet, FaUsersCog,
  FaUserFriends, FaBlogger, FaPenFancy, FaFileInvoiceDollar,
  FaSignOutAlt, FaBars, FaHandsHelping, FaMoneyBillWave,
  FaTachometerAlt, FaHome,
  FaUserTie
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import useAxiosSecure from '../hooks/useAxiosSecure';
import Spinner from '../component/Loader/Spinner';

const DashboardLayout = () => {
  const { user, logOut } = useContext(AuthContext);
  const location = useLocation();
  const axiosSecure = useAxiosSecure();

  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;

    axiosSecure.get(`/users/${user.email}`)
      .then(res => setRole(res.data?.role || 'customer'))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.email, axiosSecure]);

  const handleLogout = () => {
    logOut()
      .then(() => toast.success('Logged out successfully'))
      .catch(err => console.error(err));
  };

  const getPageTitle = () => {
    const match = navLinks.find(link => location.pathname.startsWith(link.to));
    return match?.label || 'Dashboard';
  };

  const breadcrumbs = location.pathname
    .split('/')
    .filter(Boolean)
    .map((segment, index, arr) => ({
      name: segment.replace(/-/g, ' '),
      path: `/${arr.slice(0, index + 1).join('/')}`
    }));

  const navLinks = [
    { label: 'Dashboard', to: '/dashboard', icon: <FaTachometerAlt className="text-lg" /> },
    { label: 'Profile', to: '/dashboard/profile', icon: <FaUser className="text-lg" /> },
    ...(role === 'admin' ? [
      { label: 'Manage Users', to: '/dashboard/manage-users', icon: <FaUsersCog className="text-lg" /> },
      { label: 'Manage Policies', to: '/dashboard/manage-policies', icon: <FaFileInvoiceDollar className="text-lg" /> },
      { label: 'Manage Applications', to: '/dashboard/manage-applications', icon: <FaList className="text-lg" /> },
      { label: 'Transactions', to: '/dashboard/transactions', icon: <FaWallet className="text-lg" /> },
      { label: 'Manage Agents', to: '/dashboard/manage-agents', icon: <FaUserShield className="text-lg" /> },
    ] : role === 'agent' ? [
      { label: 'Assigned Customers', to: '/dashboard/assigned-customers', icon: <FaUserFriends className="text-lg" /> },
      { label: 'Manage Blogs', to: '/dashboard/manage-blogs', icon: <FaBlogger className="text-lg" /> },
      { label: 'Post Blog', to: '/dashboard/add-blog', icon: <FaPenFancy className="text-lg" /> },
    ] : [
      { label: 'My Policies', to: '/dashboard/my-policies', icon: <FaList className="text-lg" /> },
      { label: 'Payment Status', to: '/dashboard/payment-status', icon: <FaMoneyBillWave className="text-lg" /> },
      { label: 'Claim Request', to: '/dashboard/claim-request', icon: <FaHandsHelping className="text-lg" /> },
      { label: 'Apply as Agent', to: '/dashboard/apply-agent', icon: <FaUserTie className="text-lg" /> }
    ])
  ];
  const closeDrawer = () => {
  const drawerCheckbox = document.getElementById('dashboard-drawer');
  if (drawerCheckbox) drawerCheckbox.checked = false;
};


  if (loading) return <Spinner />;

  return (
    <div className="drawer lg:drawer-open">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-gray-50 min-h-screen">
        
        <header className="lg:hidden flex items-center justify-between p-4 bg-white shadow-sm">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle">
            <FaBars className="text-sky-700 text-xl" />
          </label>
          <Link to="/"><img src={logo} alt="Logo" className="h-8" /></Link>
          <div className="w-8" />
        </header>

        <header className="hidden lg:flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 capitalize">{getPageTitle()}</h1>
            <div className="flex items-center text-sm text-gray-500">
              {breadcrumbs.map((crumb, i) => (
                <div key={crumb.path} className="flex items-center">
                  {i > 0 && <span className="mx-2">/</span>}
                  <Link to={crumb.path} className="hover:text-sky-700 capitalize">
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </div>
          </div>
          <Link to="/" className="bg-sky-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-sky-800">
            <FaHome /> Home
          </Link>
        </header>

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>

       <div className="drawer-side z-20">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>

        <aside className="menu p-4 w-72 min-h-full bg-white text-base-content flex flex-col border-r border-gray-200">
          <div className="flex items-center gap-3 mb-6 p-2">
            <Link to="/">
              <img src={logo} alt="Logo" className="h-8" />
            </Link>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-6 w-full">
            <div className="avatar">
              <div className="w-12 rounded-full">
                <img src={user?.photoURL || 'https://i.ibb.co/5GzXkwq/user.png'} alt="User" />
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="font-medium truncate">{user?.displayName || "Guest User"}</p>
              <p className="text-sm text-gray-500 truncate" title={user?.email || "No email"}>{user?.email || "No email"}</p>
            </div>
          </div>

          <nav className="flex-1">
            <ul className="space-y-1">
              {navLinks.map(({ to, label, icon }) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end
                    onClick={closeDrawer}
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
            <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-lg hover:bg-red-50 text-red-600 transition-colors duration-200 cursor-pointer">
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
