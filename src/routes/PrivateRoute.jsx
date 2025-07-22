import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import Spinner from '../component/Loader/Spinner';
import Forbidden from '../component/Forbidden';
import useAxiosSecure from '../hooks/useAxiosSecure';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
    const [userRole, setUserRole] = useState(null); 
    const [isRoleLoading, setIsRoleLoading] = useState(true);
    const axiosSecure = useAxiosSecure();
    const location = useLocation();

     useEffect(() => {
        const fetchUserRole = async () => {
            if (user && user.email) {
                try {
                    const res = await axiosSecure.get(`/users/role/${user.email}`);
                    if (res.data && res.data.role) {
                        setUserRole(res.data.role); 
                    } else {
                        setUserRole('user');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole('user');
                } finally {
                    setIsRoleLoading(false); 
                }
            } else {
                setIsRoleLoading(false);
            }
        };
        if (!loading) {
            fetchUserRole();
        }
    }, [user, loading, axiosSecure]);

    if (loading || isRoleLoading) {
        return <Spinner />; 
    }
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return <Forbidden />; 
    }
    return children;
};

export default PrivateRoute;