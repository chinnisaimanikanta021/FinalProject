import React from 'react';
import { useAuth } from '../context/AuthContext';
import { careerData } from '../data/careerData';
import { ArrowLeft, BookOpen, Trash2, ChevronRight, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = ({ onBack, onSelectJob }) => {
    const { savedPaths, toggleSavePath, userProgress, user } = useAuth();

    // Flatten careerData to easily find jobs by ID
    const allJobs = careerData.flatMap(cat =>
        cat.branches.flatMap(branch => branch.jobs)
    );

    const savedJobs = allJobs.filter(job => savedPaths.includes(job.id));

    return (
        <div className="container" style={{ maxWidth: '1000px', perspective: '1200px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}
            >
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-blue)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    <ArrowLeft size={20} /> Back to Careers
                </button>
                <div style={{ textAlign: 'right' }}>
                    <h1 style={{ margin: 0, fontSize: '1.8rem' }}>Welcome, <span style={{ color: 'var(--accent-blue)' }}>{user?.name?.split(' ')[0]}</span>!</h1>
                    <p style={{ color: 'var(--text-muted)', margin: '5px 0 0 0' }}>Track your career progress here.</p>
                </div>
            </motion.div>

            <motion.div
                className="glass-panel"
                initial={{ rotateX: 10, y: 30, opacity: 0 }}
                animate={{ rotateX: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.6, type: 'spring' }}
                style={{ padding: '36px', marginBottom: '30px' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                    <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)' }}>
                        <BookOpen size={24} color="var(--accent-blue)" />
                    </div>
                    <h2 style={{ margin: 0 }}>My Saved Career Paths</h2>
                </div>

                {savedJobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '60px 40px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px dashed var(--glass-border)' }}
                    >
                        <BookOpen size={48} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '16px' }} />
                        <h3 style={{ color: 'var(--text-color)' }}>No saved paths yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px', maxWidth: '400px', margin: '8px auto 0' }}>Browse the career list and click the bookmark icon on any job to save it here for quick access.</p>
                    </motion.div>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {savedJobs.map((job, index) => {
                            const completedSteps = userProgress[job.id] || [];
                            const progress = job.roadmap ? Math.round((completedSteps.length / job.roadmap.length) * 100) : 0;

                            return (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    style={{
                                        padding: '24px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        background: 'rgba(255,255,255,0.03)',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '20px',
                                        boxShadow: 'var(--shadow-inner)',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.transform = 'translateY(-4px)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-3d-hover)';
                                        e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-inner)';
                                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    }}
                                >
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ margin: '0 0 12px 0', color: 'white', fontSize: '1.4rem' }}>{job.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                            <div style={{ flex: 1, maxWidth: '400px', height: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '5px', overflow: 'hidden', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                                                <motion.div
                                                    initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1, ease: 'easeOut' }}
                                                    style={{ height: '100%', background: 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))', boxShadow: 'var(--glow-blue)' }}
                                                />
                                            </div>
                                            <span style={{ fontWeight: '800', color: 'white', minWidth: '45px' }}>{progress}%</span>
                                        </div>
                                        <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                            {completedSteps.length} of {job.roadmap?.length || 0} steps completed
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                        <button
                                            onClick={() => toggleSavePath(job.id)}
                                            style={{
                                                padding: '12px',
                                                borderRadius: '12px',
                                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                color: '#ef4444',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s',
                                                boxShadow: 'inset 0 2px 4px rgba(239,68,68,0.1)'
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                            title="Remove from bookmarks"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                        <button
                                            className="btn-3d"
                                            onClick={() => onSelectJob(job)}
                                            style={{
                                                padding: '12px 24px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            Resume <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            <motion.div
                className="glass-panel"
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                style={{
                    padding: '30px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
                    color: 'white',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: 'var(--glow-purple)',
                    display: 'flex', gap: '20px', alignItems: 'center'
                }}
            >
                <div style={{ padding: '16px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
                    <Zap size={32} color="#fcd34d" />
                </div>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.3rem', color: 'white' }}>Career Tip</h3>
                    <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '1.05rem', lineHeight: '1.5' }}>
                        Consistent learning is key to career success. Try to complete at least one step in your roadmap every week!
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Dashboard;
