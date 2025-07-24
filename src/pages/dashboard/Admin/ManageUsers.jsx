import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../../hooks/useAxiosSecure';
import { FaUserShield, FaUser, FaUserTie, FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';
import { MdEmail } from "react-icons/md";
import Spinner from '../../../component/Loader/Spinner';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async ({ email, role }) => {
            const res = await axiosSecure.patch(`/users/${email}/role`, { role });
            return res.data;
        },
        onSuccess: (_, { role }) => {
            queryClient.invalidateQueries(['users']);
            Swal.fire(
                'Success!',
                `User role updated to ${role}`,
                'success'
            );
        },
        onError: () => {
            Swal.fire(
                'Error!',
                'Failed to update user role',
                'error'
            );
        }
    });

    const handleRoleChange = (email, currentRole) => {
        const newRole = currentRole === 'agent' ? 'customer' : 'agent';
        const action = newRole === 'agent' ? 'promote' : 'demote';
        
        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to ${action} this user to ${newRole}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `Yes, ${action}!`
        }).then((result) => {
            if (result.isConfirmed) {
                mutation.mutate({ email, role: newRole });
            }
        });
    };

    const roleIcon = (role) => {
        switch (role) {
            case 'admin': return <FaUserShield className="text-purple-500" />;
            case 'agent': return <FaUserTie className="text-blue-500" />;
            default: return <FaUser className="text-gray-500" />;
        }
    };

    if (isLoading) return <Spinner />;

    return (
        <div className="md:p-6 bg-gray-50">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                        <p className="text-gray-600">Manage all user accounts and roles</p>
                    </div>
                    <div className="text-sm text-gray-500">
                        Total Users: <span className="font-semibold">{users.length}</span>
                    </div>
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FaUser className="text-3xl text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
                        <p className="text-gray-500">When users register, they will appear here</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Role
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Registered
                                    </th>
                                    <th scope="col" className="py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className=" py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 flex items-center">
                                                <MdEmail className="mr-1 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                {roleIcon(user.role)}
                                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <FaCalendarAlt className="inline mr-1 text-gray-400" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 flex justify-center whitespace-nowrap text-sm font-medium">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleRoleChange(user.email, user.role)}
                                                    className={`flex items-center gap-2 btn px-3 ${
                                                        user.role === 'agent' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-500 hover:bg-blue-600'
                                                    } text-white`}
                                                >
                                                    <FaExchangeAlt />
                                                    <span>{user.role === 'agent' ? 'Demote' : 'Promote'}</span>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;