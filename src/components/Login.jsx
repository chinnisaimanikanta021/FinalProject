import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, ArrowRight, UserPlus, Phone, BookOpen, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputStyle = {
    background: 'transparent', border: 'none', outline: 'none',
    width: '100%', fontSize: '0.95rem', color: 'var(--text-color)',
};

const InputRow = ({ icon, children }) => (
    <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(0,0,0,0.2)',
        padding: '13px 15px', borderRadius: '12px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
        gap: '10px',
        transition: 'all 0.3s'
    }}>
        <span style={{ color: 'var(--accent-blue)', flexShrink: 0 }}>{icon}</span>
        {children}
    </div>
);

const Login = ({ onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setTimeout(() => {
            const result = login(email, password);
            setLoading(false);
            if (!result.success) setError(result.message);
        }, 600);
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', perspective: '1000px' }}>
            <motion.div
                initial={{ rotateX: 10, y: 30, opacity: 0 }}
                animate={{ rotateX: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                className="glass-panel"
                style={{
                    padding: '40px',
                    width: '100%', maxWidth: '420px',
                    boxShadow: 'var(--shadow-3d-hover)'
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
                            marginBottom: '16px',
                            boxShadow: 'var(--glow-blue), inset 0 2px 5px rgba(255,255,255,0.4)',
                        }}
                    >
                        <Lock size={28} color="white" />
                    </motion.div>
                    <h1 style={{ margin: '0 0 8px', fontSize: '1.8rem', color: 'var(--text-color)' }}>Welcome Back</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Sign in to continue your journey</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                padding: '12px', borderRadius: '10px', marginBottom: '20px',
                                fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)',
                                boxShadow: 'inset 0 0 10px rgba(239,68,68,0.1)'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <InputRow icon={<Mail size={18} />}>
                        <input type="email" placeholder="Email Address" value={email}
                            onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                    </InputRow>

                    <InputRow icon={<Lock size={18} />}>
                        <input type="password" placeholder="Password" value={password}
                            onChange={e => setPassword(e.target.value)} required style={inputStyle} />
                    </InputRow>

                    <button type="submit" disabled={loading} className="btn-3d" style={{
                        marginTop: '12px',
                        padding: '16px',
                        fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}>
                        {loading ? 'Authenticating...' : <>Sign In <ArrowRight size={18} /></>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '28px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    Don't have an account?{' '}
                    <span onClick={onSwitchToSignup}
                        style={{ color: 'var(--accent-teal)', fontWeight: '600', cursor: 'pointer', textShadow: '0 0 10px rgba(20,184,166,0.3)' }}>
                        Create Profile
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
