import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Phone, BookOpen, Edit3, Save, X,
    MapPin, Calendar, Bookmark, TrendingUp, Award, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ icon, label, value, color, delay }) => (
    <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay, duration: 0.5, type: 'spring' }}
        style={{
            background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            boxShadow: 'var(--shadow-inner)', textAlign: 'center',
            border: `1px solid ${color}44`,
            position: 'relative', overflow: 'hidden'
        }}
    >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color, boxShadow: `0 0 10px ${color}` }}></div>
        <div style={{
            background: `${color}15`, padding: '12px', borderRadius: '14px', color,
            boxShadow: `inset 0 2px 5px rgba(0,0,0,0.5), 0 0 15px ${color}44`
        }}>{icon}</div>
        <span style={{ fontSize: '1.6rem', fontWeight: '800', color: 'white', fontFamily: 'var(--font-display)' }}>{value}</span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    </motion.div>
);

const UserProfile = ({ onClose }) => {
    const { user, updateProfile, savedPaths, userProgress, logout } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        name: user.name || '',
        phone: user.phone || '',
        education: user.education || '',
        bio: user.bio || '',
    });
    const [saved, setSaved] = useState(false);

    if (!user) return null;

    const initials = user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
    const avatarColor = user.avatarColor || 'var(--accent-purple)';
    const joinedDate = user.joinedDate
        ? new Date(user.joinedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
        : 'N/A';

    const totalStepsCompleted = Object.values(userProgress).reduce((acc, steps) => acc + steps.length, 0);
    const pathsInProgress = Object.keys(userProgress).filter(k => userProgress[k]?.length > 0).length;

    const handleSave = () => {
        updateProfile(form);
        setEditing(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const inputClasses = {
        width: '100%', padding: '12px 16px', borderRadius: '12px',
        border: '1px solid var(--glass-border)', outline: 'none', fontSize: '0.95rem',
        boxSizing: 'border-box', background: 'rgba(0,0,0,0.3)', color: 'white',
        boxShadow: 'var(--shadow-inner)', transition: 'all 0.3s'
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(5, 7, 15, 0.7)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px', backdropFilter: 'blur(8px)',
            perspective: '1200px'
        }} onClick={onClose}>
            <motion.div
                initial={{ rotateX: 10, y: 40, opacity: 0, scale: 0.95 }}
                animate={{ rotateX: 0, y: 0, opacity: 1, scale: 1 }}
                exit={{ rotateX: -10, y: 40, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="glass-panel"
                style={{
                    borderRadius: '24px', width: '100%', maxWidth: '560px',
                    maxHeight: '90vh', overflowY: 'auto',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.6), inset 0 1px 1px rgba(255,255,255,0.1)',
                    background: 'rgba(15, 23, 42, 0.8)'
                }}
                onClick={e => e.stopPropagation()}
            >

                {/* ── Banner + Avatar ── */}
                <div style={{
                    background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}77, transparent)`,
                    borderRadius: '24px 24px 0 0', padding: '32px 28px 60px',
                    position: 'relative', borderBottom: '1px solid var(--glass-border)',
                    boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.1)'
                }}>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px', padding: '8px', cursor: 'pointer', color: 'white',
                        transition: 'all 0.2s', boxShadow: 'var(--shadow-inner)'
                    }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.4)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(0,0,0,0.3)'}
                    ><X size={18} /></button>
                    <h2 style={{ color: 'white', margin: 0, fontWeight: '700', fontSize: '1.2rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>My Profile</h2>
                </div>

                <div style={{ padding: '0 28px 28px', marginTop: '-45px' }}>
                    {/* Avatar */}
                    <div style={{
                        width: '90px', height: '90px', borderRadius: '50%',
                        background: `linear-gradient(135deg, ${avatarColor}, #0d0f1a)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: '800', fontSize: '2rem', color: 'white',
                        border: '4px solid #0f172a',
                        boxShadow: `0 10px 30px rgba(0,0,0,0.5), inset 0 2px 5px rgba(255,255,255,0.3), 0 0 20px ${avatarColor}66`,
                        marginBottom: '16px', fontFamily: 'var(--font-display)'
                    }}>{initials}</div>

                    {/* Name + Email */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h2 style={{ margin: '0 0 6px', color: 'white', fontSize: '1.6rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{user.name}</h2>
                            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.95rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                                <Mail size={15} color="var(--text-muted)" /> {user.email}
                            </p>
                        </div>
                        <button onClick={() => setEditing(!editing)} style={{
                            background: editing ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                            color: editing ? '#fca5a5' : '#93c5fd',
                            border: `1px solid ${editing ? 'rgba(239, 68, 68, 0.3)' : 'rgba(59, 130, 246, 0.3)'}`,
                            borderRadius: '12px', padding: '8px 16px',
                            fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '6px',
                            boxShadow: editing ? 'var(--glow-red)' : 'var(--glow-blue)',
                            transition: 'all 0.3s'
                        }}>
                            {editing ? <><X size={15} /> Cancel</> : <><Edit3 size={15} /> Edit</>}
                        </button>
                    </div>

                    {/* Join date */}
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <Calendar size={14} /> Joined {joinedDate}
                    </p>

                    <AnimatePresence>
                        {saved && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                style={{
                                    background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.3)',
                                    padding: '12px 16px', fontSize: '0.9rem', marginTop: '16px',
                                    display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)'
                                }}>
                                <CheckCircle size={18} /> Profile saved successfully!
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ── Stats ── */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', margin: '28px 0' }}>
                        <StatCard icon={<Bookmark size={22} />} label="Saved" value={savedPaths.length} color="#6366f1" delay={0.1} />
                        <StatCard icon={<TrendingUp size={22} />} label="Progress" value={pathsInProgress} color="#0ea5e9" delay={0.2} />
                        <StatCard icon={<Award size={22} />} label="Steps" value={totalStepsCompleted} color="#10b981" delay={0.3} />
                    </div>

                    {/* ── Editable Fields ── */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Full Name', icon: <User size={16} />, key: 'name', type: 'text' },
                            { label: 'Phone', icon: <Phone size={16} />, key: 'phone', type: 'tel' },
                        ].map(({ label, icon, key, type }) => (
                            <div key={key}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                                    {icon} {label}
                                </label>
                                {editing ? (
                                    <input type={type} value={form[key]}
                                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                                        style={inputClasses}
                                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.boxShadow = 'var(--shadow-inner), var(--glow-blue)'; }}
                                        onBlur={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-inner)'; }}
                                    />
                                ) : (
                                    <p style={{ margin: 0, padding: '14px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', color: 'white', fontSize: '0.95rem', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}>
                                        {user[key] || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not provided</span>}
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* Education dropdown */}
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                                <BookOpen size={16} /> Education Level
                            </label>
                            {editing ? (
                                <select value={form.education} onChange={e => setForm({ ...form, education: e.target.value })}
                                    style={{ ...inputClasses, cursor: 'pointer', WebkitAppearance: 'none' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.boxShadow = 'var(--shadow-inner), var(--glow-blue)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-inner)'; }}
                                >
                                    <option value="" style={{ color: 'black' }}>Not specified</option>
                                    <option style={{ color: 'black' }}>10th Class</option>
                                    <option style={{ color: 'black' }}>Intermediate (12th)</option>
                                    <option style={{ color: 'black' }}>Diploma</option>
                                    <option style={{ color: 'black' }}>B.Tech / B.E</option>
                                    <option style={{ color: 'black' }}>Degree (General)</option>
                                    <option style={{ color: 'black' }}>ITI</option>
                                    <option style={{ color: 'black' }}>Postgraduate</option>
                                </select>
                            ) : (
                                <p style={{ margin: 0, padding: '14px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', color: 'white', fontSize: '0.95rem', border: '1px solid var(--glass-border)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}>
                                    {user.education || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Not specified</span>}
                                </p>
                            )}
                        </div>

                        {/* Bio */}
                        <div>
                            <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600', display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '8px' }}>
                                <MapPin size={16} /> Bio
                            </label>
                            {editing ? (
                                <textarea rows={3} value={form.bio}
                                    onChange={e => setForm({ ...form, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                    style={{ ...inputClasses, resize: 'vertical', fontFamily: 'inherit' }}
                                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.boxShadow = 'var(--shadow-inner), var(--glow-blue)'; }}
                                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--glass-border)'; e.currentTarget.style.boxShadow = 'var(--shadow-inner)'; }}
                                />
                            ) : (
                                <p style={{ margin: 0, padding: '14px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', color: user.bio ? 'white' : 'var(--text-muted)', fontSize: '0.95rem', border: '1px solid var(--glass-border)', minHeight: '80px', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.3)' }}>
                                    {user.bio || <span style={{ fontStyle: 'italic' }}>No bio added yet.</span>}
                                </p>
                            )}
                        </div>

                        {editing && (
                            <button className="btn-3d" onClick={handleSave} style={{
                                background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%), var(--accent-purple)',
                                color: 'white', padding: '14px', borderRadius: '12px',
                                border: 'none', fontWeight: '700', fontSize: '1rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '8px', cursor: 'pointer', marginTop: '12px',
                                boxShadow: '0 4px 0 #6d28d9, 0 5px 15px rgba(139,92,246,0.4), inset 0 1px 1px rgba(255,255,255,0.4)'
                            }}>
                                <Save size={18} /> Save Changes
                            </button>
                        )}
                    </div>

                    {/* Logout */}
                    <button onClick={() => { onClose(); logout(); }} style={{
                        width: '100%', marginTop: '28px', padding: '14px',
                        background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '12px', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer',
                        transition: 'all 0.3s', boxShadow: 'inset 0 2px 4px rgba(239,68,68,0.1)'
                    }}
                        onMouseOver={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.boxShadow = 'var(--glow-red)'; }}
                        onMouseOut={e => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(239,68,68,0.1)'; }}
                    >
                        Sign Out
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UserProfile;
