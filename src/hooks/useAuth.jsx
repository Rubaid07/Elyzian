// hooks/useAuth.js

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
    const { user, loading } = useContext(AuthContext); 
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); 
    useEffect(() => {
        if (!user) {
            setToken(null);
            setAuthLoading(false);
            return;
        }

        const fetchToken = async () => {
            try {
                const idToken = await user.getIdToken();
                localStorage.setItem('access-token', idToken);
                setToken(idToken);
            } catch (error) {
                console.error("Error fetching ID token:", error);
            } finally {
                setAuthLoading(false);
            }
        };
        if (user && !loading) {
            fetchToken();
        }

    }, [user, loading]); 

    return { user, loading: loading || authLoading, token }
};

export default useAuth;