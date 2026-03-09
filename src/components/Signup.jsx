import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Lock, Mail, Phone, BookOpen, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InputRow = ({ icon, children }) => (
    <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(0,0,0,0.2)',
        padding: '13px 15px', borderRadius: '12px',
        border: '1px solid var(--glass-border)',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
        gap: '10px', transition: 'border-color 0.2s',
    }}>
        <span style={{ color: 'var(--accent-teal)', flexShrink: 0 }}>{icon}</span>
        {children}
    </div>
);

const inputStyle = {
    background: 'transparent', border: 'none', outline: 'none',
    width: '100%', fontSize: '0.95rem', color: 'var(--text-color)',
};

const Signup = ({ onSwitchToLogin }) => {
    const [step, setStep] = useState(1); // 1 = form, 2 = success
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [education, setEducation] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (password !== confirm) { setError('Passwords do not match.'); return; }
        setLoading(true);
        setTimeout(() => {
            const result = signup(name, email, password, phone, education);
            setLoading(false);
            if (!result.success) {
                setError(result.message);
            } else {
                setStep(2);
            }
        }, 600);
    };

    // ── Success screen ──────────────
    if (step === 2) {
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        return (
            <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', perspective: '1000px' }}>
                <motion.div
                    initial={{ rotateX: 20, scale: 0.9, opacity: 0 }}
                    animate={{ rotateX: 0, scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, type: 'spring' }}
                    className="glass-panel"
                    style={{
                        padding: '48px 40px',
                        textAlign: 'center',
                        maxWidth: '420px', width: '100%',
                        boxShadow: 'var(--glow-teal)'
                    }}
                >
                    {/* Avatar */}
                    <motion.div
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                        style={{
                            width: '80px', height: '80px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '2rem', fontWeight: '800', color: 'white',
                            margin: '0 auto 20px', boxShadow: 'var(--shadow-3d-base)',
                        }}
                    >
                        {initials}
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                        style={{ color: 'var(--accent-teal)', marginBottom: '12px' }}
                    >
                        <CheckCircle size={36} style={{ marginBottom: '6px' }} />
                    </motion.div>

                    <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }}
                        style={{ margin: '0 0 8px', fontSize: '1.6rem', color: 'white' }}>
                        Profile Created! 🎉
                    </motion.h2>
                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
                        style={{ color: 'var(--text-muted)', margin: '0 0 28px' }}>
                        Welcome aboard, <strong style={{ color: 'white' }}>{name}</strong>!
                    </motion.p>

                    {/* Profile summary card */}
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                        style={{
                            background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px 20px',
                            textAlign: 'left', marginBottom: '28px', display: 'grid', gap: '8px',
                            border: '1px solid var(--glass-border)'
                        }}>
                        {[
                            ['Name', name],
                            ['Email', email],
                            phone && ['Phone', phone],
                            education && ['Education', education],
                        ].filter(Boolean).map(([label, val]) => (
                            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{label}</span>
                                <span style={{ color: 'white', fontWeight: '600' }}>{val}</span>
                            </div>
                        ))}
                    </motion.div>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                        style={{ color: 'var(--accent-blue)', fontSize: '0.85rem' }}>
                        You are automatically logged in. The app will load in a moment...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    // ── Sign-up form ──────────────
    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', perspective: '1000px' }}>
            <motion.div
                initial={{ rotateY: -10, x: -20, opacity: 0 }}
                animate={{ rotateY: 0, x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="glass-panel"
                style={{
                    padding: '40px',
                    width: '100%', maxWidth: '420px',
                    boxShadow: 'var(--shadow-3d-hover)'
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <motion.div
                        animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                            width: '60px', height: '60px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, var(--accent-teal), var(--accent-blue))',
                            marginBottom: '14px',
                            boxShadow: 'var(--glow-teal), inset 0 2px 5px rgba(255,255,255,0.4)',
                        }}
                    >
                        <Sparkles size={28} color="white" />
                    </motion.div>
                    <h1 style={{ margin: '0 0 6px', fontSize: '1.8rem', color: 'white' }}>Create Profile</h1>
                    <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem' }}>Join to get a personalised roadmap</p>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                                background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                padding: '12px', borderRadius: '10px', marginBottom: '18px',
                                fontSize: '0.9rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.3)',
                                boxShadow: 'inset 0 0 10px rgba(239,68,68,0.1)'
                            }}
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <InputRow icon={<User size={18} />}>
                        <input type="text" placeholder="Full Name *" value={name}
                            onChange={e => setName(e.target.value)} required style={inputStyle} />
                    </InputRow>

                    <InputRow icon={<Mail size={18} />}>
                        <input type="email" placeholder="Email Address *" value={email}
                            onChange={e => setEmail(e.target.value)} required style={inputStyle} />
                    </InputRow>

                    <InputRow icon={<Phone size={18} />}>
                        <input type="tel" placeholder="Phone Number" value={phone}
                            onChange={e => setPhone(e.target.value)} style={inputStyle} />
                    </InputRow>

                    <InputRow icon={<BookOpen size={18} />}>
                        <select value={education} onChange={e => setEducation(e.target.value)}
                            style={{ ...inputStyle, cursor: 'pointer', WebkitAppearance: 'none' }}>
                            <option value="" style={{ color: 'black' }}>Education Level (optional)</option>
                            <option style={{ color: 'black' }}>10th Class</option>
                            <option style={{ color: 'black' }}>Intermediate (12th)</option>
                            <option style={{ color: 'black' }}>Diploma</option>
                            <option style={{ color: 'black' }}>B.Tech / B.E</option>
                            <option style={{ color: 'black' }}>Degree (General)</option>
                            <option style={{ color: 'black' }}>ITI</option>
                            <option style={{ color: 'black' }}>Postgraduate</option>
                        </select>
                    </InputRow>

                    <InputRow icon={<Lock size={18} />}>
                        <input type="password" placeholder="Password * (min 6 chars)" value={password}
                            onChange={e => setPassword(e.target.value)} required style={inputStyle} />
                    </InputRow>

                    <InputRow icon={<Lock size={18} />}>
                        <input type="password" placeholder="Confirm Password *" value={confirm}
                            onChange={e => setConfirm(e.target.value)} required style={inputStyle} />
                    </InputRow>

                    <button type="submit" disabled={loading} className="btn-3d" style={{
                        marginTop: '10px',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.15), rgba(255,255,255,0)), var(--accent-teal)',
                        boxShadow: '0 4px 0 #0f766e, 0 5px 15px rgba(20, 184, 166, 0.4), inset 0 1px 1px rgba(255,255,255,0.4)',
                        padding: '16px',
                        fontSize: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}>
                        {loading ? 'Creating Profile...' : <><Sparkles size={18} /> Create My Profile</>}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                    Already have an account?{' '}
                    <span onClick={onSwitchToLogin}
                        style={{ color: 'var(--accent-blue)', fontWeight: '600', cursor: 'pointer', textShadow: '0 0 10px rgba(59,130,246,0.3)' }}>
                        Sign In
                    </span>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
