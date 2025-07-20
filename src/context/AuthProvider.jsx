import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../firebase/firebase.config';

const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true)

    const createUser = (email, password) => {
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password);
    }
    
    const updateUser = (data) => {
        return updateProfile(auth.currentUser, data);
    };

    const signIn = (email, password) => {
        setLoading(true)
        return signInWithEmailAndPassword(auth, email, password);
    }

    const logOut = () => {
        setLoading(true)
        return signOut(auth).then(() => setUser(null));
    }

    const signInWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

     useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser);
            if (currentUser) {
                // JWT ইস্যু করার জন্য সার্ভারে রিকোয়েস্ট করুন
                currentUser.getIdToken()
                    .then(idToken => {
                        console.log("Firebase ID Token available:", idToken ? "Yes" : "No");
                        // এই টোকেনটি localStorage-এ সেভ করুন
                        localStorage.setItem('access-token', idToken);
                        // সার্ভারে JWT পেতে রিকোয়েস্ট করার দরকার নেই, যেহেতু Firebase টোকেনই যথেষ্ট
                        // যদি আপনার সার্ভার কাস্টম JWT ব্যবহার করে, তবে এখানে তা করুন
                    })
                    .catch(error => {
                        console.error("Error getting Firebase ID token:", error);
                    });
            } else {
                localStorage.removeItem('access-token');
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    const authInfo = {
        user,
        createUser,
        updateUser,
        signIn,
        loading,
        logOut,
        setUser,
        signInWithGoogle
    }
    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;