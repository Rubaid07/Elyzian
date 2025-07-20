// hooks/useAuth.js

import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
    const { user, loading } = useContext(AuthContext); // user এবং loading AuthContext থেকে আসছে
    const [token, setToken] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // useAuth এর নিজস্ব লোডিং স্টেট

    useEffect(() => {
        if (!user) {
            setToken(null);
            setAuthLoading(false);
            return;
        }

        const fetchToken = async () => {
            try {
                // Firebase থেকে নতুন ID টোকেন পান
                const idToken = await user.getIdToken();
                console.log("Fetched new Firebase ID Token:", idToken ? "Yes" : "No"); // Debug log
                localStorage.setItem('access-token', idToken);
                setToken(idToken);
            } catch (error) {
                console.error("Error fetching ID token:", error);
                // টোকেন ফেচ করতে ব্যর্থ হলে কি করবেন, তা এখানে হ্যান্ডেল করুন
            } finally {
                setAuthLoading(false);
            }
        };

        // user অবজেক্ট পরিবর্তন হলে বা লোডিং শেষ হলে টোকেন ফেচ করুন
        // এটি নিশ্চিত করবে যে যখনই user অবজেক্ট প্রস্তুত হবে, তখনই নতুন টোকেন নেওয়া হবে।
        if (user && !loading) {
            fetchToken();
        }

    }, [user, loading]); // user বা loading পরিবর্তন হলে useEffect আবার চলবে

    return { user, loading: loading || authLoading, token }; // আপনার কম্পোনেন্টে টোকেনটি পাস করুন
};

export default useAuth;