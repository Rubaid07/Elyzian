import { Outlet, NavLink } from 'react-router';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);

  const role = 'customer';

  const navItems = [
    { label: 'Profile', to: '/dashboard/profile' },
    ...(role === 'admin'
      ? [
          { label: 'Manage Users', to: '/dashboard/manage-users' },
          { label: 'Manage Policies', to: '/dashboard/manage-policies' },
          { label: 'Transactions', to: '/dashboard/transactions' },
          { label: 'Manage Agents', to: '/dashboard/manage-agents' },
        ]
      : role === 'agent'
      ? [
          { label: 'Assigned Customers', to: '/dashboard/assigned-customers' },
          { label: 'Manage Blogs', to: '/dashboard/manage-blogs' },
          { label: 'Post Blog', to: '/dashboard/add-blog' },
        ]
      : [
          { label: 'My Policies', to: '/dashboard/my-policies' },
          { label: 'Payment', to: '/dashboard/payment' },
          { label: 'Claim Request', to: '/dashboard/claim' },
        ]),
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col bg-gray-50 p-4">
        <Outlet />
      </div>
      <div className="drawer-side bg-base-200">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="menu p-4 w-72 min-h-full text-base-content space-y-2">
          <h2 className="text-xl font-bold text-sky-700 mb-4">Dashboard</h2>
          {navItems.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  isActive ? 'text-sky-600 font-semibold' : 'text-gray-700'
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
