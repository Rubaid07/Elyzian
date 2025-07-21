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
                currentUser.getIdToken()
                    .then(idToken => {
                        console.log("Firebase ID Token available:", idToken ? "Yes" : "No");
                        localStorage.setItem('access-token', idToken);
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