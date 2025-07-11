import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

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
            toast.success(`User role updated to ${role}`);
        },
    });

    const handleRoleChange = (email, currentRole) => {
        const newRole = currentRole === 'agent' ? 'customer' : 'agent';
        mutation.mutate({ email, role: newRole });
    };

    if (isLoading) return <p className="text-center py-6">Loading users...</p>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="table w-full">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Registered</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, idx) => (
                            <tr key={user._id}>
                                <td>{idx + 1}</td>
                                <td>{user.name || 'N/A'}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className="capitalize font-medium">{user.role}</span>
                                </td>
                                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {user.role !== 'admin' && (
                                        <button
                                            onClick={() => handleRoleChange(user.email, user.role)}
                                            className="btn btn-xs btn-primary"
                                        >
                                            {user.role === 'agent' ? 'Demote' : 'Promote'}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
