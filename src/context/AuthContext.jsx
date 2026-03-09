import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

// Generate a random avatar color on signup
const AVATAR_COLORS = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const randomColor = () => AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [savedPaths, setSavedPaths] = useState([]);
    const [userProgress, setUserProgress] = useState({});

    useEffect(() => {
        const storedUser = localStorage.getItem('career_app_user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const storedPaths = localStorage.getItem('career_saved_paths');
        if (storedPaths) setSavedPaths(JSON.parse(storedPaths));

        const storedProgress = localStorage.getItem('career_user_progress');
        if (storedProgress) setUserProgress(JSON.parse(storedProgress));

        setLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('career_saved_paths', JSON.stringify(savedPaths));
    }, [savedPaths]);

    useEffect(() => {
        localStorage.setItem('career_user_progress', JSON.stringify(userProgress));
    }, [userProgress]);

    const login = (email, password) => {
        const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const foundUser = storedUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('career_app_user', JSON.stringify(foundUser));
            // Restore this user's saved paths and progress
            const userKey = `career_saved_paths_${foundUser.id}`;
            const progressKey = `career_user_progress_${foundUser.id}`;
            const sp = localStorage.getItem(userKey);
            const up = localStorage.getItem(progressKey);
            if (sp) setSavedPaths(JSON.parse(sp));
            if (up) setUserProgress(JSON.parse(up));
            return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const signup = (name, email, password, phone = '', education = '') => {
        const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        if (storedUsers.some(u => u.email === email)) {
            return { success: false, message: 'An account with this email already exists.' };
        }

        const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            password,
            phone,
            education,
            bio: '',
            avatarColor: randomColor(),
            joinedDate: new Date().toISOString(),
        };

        storedUsers.push(newUser);
        localStorage.setItem('registered_users', JSON.stringify(storedUsers));
        setUser(newUser);
        localStorage.setItem('career_app_user', JSON.stringify(newUser));
        setSavedPaths([]);
        setUserProgress({});
        return { success: true };
    };

    const updateProfile = (updatedFields) => {
        const storedUsers = JSON.parse(localStorage.getItem('registered_users') || '[]');
        const updatedUser = { ...user, ...updatedFields };
        const idx = storedUsers.findIndex(u => u.id === user.id);
        if (idx !== -1) {
            storedUsers[idx] = updatedUser;
            localStorage.setItem('registered_users', JSON.stringify(storedUsers));
        }
        setUser(updatedUser);
        localStorage.setItem('career_app_user', JSON.stringify(updatedUser));
    };

    const logout = () => {
        // Save per-user data before logout
        if (user) {
            localStorage.setItem(`career_saved_paths_${user.id}`, JSON.stringify(savedPaths));
            localStorage.setItem(`career_user_progress_${user.id}`, JSON.stringify(userProgress));
        }
        setUser(null);
        localStorage.removeItem('career_app_user');
        setSavedPaths([]);
        setUserProgress({});
    };

    const toggleSavePath = (jobId) => {
        if (savedPaths.includes(jobId)) {
            setSavedPaths(savedPaths.filter(id => id !== jobId));
        } else {
            setSavedPaths([...savedPaths, jobId]);
        }
    };

    const updateProgress = (jobId, stepIndex) => {
        const currentProgress = userProgress[jobId] || [];
        let newProgress;
        if (currentProgress.includes(stepIndex)) {
            newProgress = currentProgress.filter(i => i !== stepIndex);
        } else {
            newProgress = [...currentProgress, stepIndex];
        }
        setUserProgress({ ...userProgress, [jobId]: newProgress });
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            signup,
            logout,
            loading,
            savedPaths,
            toggleSavePath,
            userProgress,
            updateProgress,
            updateProfile,
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
