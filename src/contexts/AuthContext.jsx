import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';

// Create Auth Context
const AuthContext = createContext({});

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Sign in with Google — try popup first, fallback to redirect
    const login = async () => {
        try {
            setError(null);
            const result = await signInWithPopup(auth, googleProvider);
            return result.user;
        } catch (error) {
            console.error('Login error:', error);
            // If popup was blocked or closed, try redirect instead
            if (
                error.code === 'auth/popup-blocked' ||
                error.code === 'auth/popup-closed-by-user' ||
                error.code === 'auth/cancelled-popup-request'
            ) {
                try {
                    await signInWithRedirect(auth, googleProvider);
                    return; // Page will redirect, no user returned yet
                } catch (redirectError) {
                    console.error('Redirect login error:', redirectError);
                    setError(getReadableError(redirectError));
                    throw redirectError;
                }
            }
            setError(getReadableError(error));
            throw error;
        }
    };

    // Human-readable error messages
    const getReadableError = (error) => {
        switch (error.code) {
            case 'auth/popup-blocked':
                return 'Popup was blocked by your browser. Please allow popups for this site.';
            case 'auth/popup-closed-by-user':
                return 'Login popup was closed. Please try again.';
            case 'auth/cancelled-popup-request':
                return 'Login was cancelled. Please try again.';
            case 'auth/unauthorized-domain':
                return 'This domain is not authorized for login. Please contact the administrator.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.';
            case 'auth/internal-error':
                return 'An internal error occurred. Please try again later.';
            default:
                return error.message || 'An unexpected error occurred during sign-in.';
        }
    };

    // Sign out
    const logout = async () => {
        try {
            setError(null);
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
            setError(error.message);
            throw error;
        }
    };

    // Listen for auth state changes + handle redirect result
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        // Check if user is coming back from a redirect sign-in
        getRedirectResult(auth)
            .then((result) => {
                if (result?.user) {
                    setCurrentUser(result.user);
                }
            })
            .catch((error) => {
                console.error('Redirect result error:', error);
                if (error.code !== 'auth/popup-closed-by-user') {
                    setError(getReadableError(error));
                }
            });

        // Safety timeout — never stay loading for more than 5 seconds
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000);

        // Cleanup subscription on unmount
        return () => {
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const value = {
        currentUser,
        loading,
        error,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
