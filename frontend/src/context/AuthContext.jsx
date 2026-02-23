import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Start backend if not running or ensure api.js base URL is correct
                    // Assuming api.js is imported from '../lib/api' which I will add to imports
                    const response = await api.get('/users/me');
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to restore session:", error);
                    localStorage.removeItem('token');
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (username, password) => {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await api.post('/token', formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        const { access_token } = response.data;

        localStorage.setItem('token', access_token);

        // Fetch user details
        const userResponse = await api.get('/users/me');
        setUser(userResponse.data);
        return userResponse.data;
    };

    const register = async (userData) => {
        console.log("Register payload:", userData); 
        const response = await api.post('/register', userData);
        return response.data;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
