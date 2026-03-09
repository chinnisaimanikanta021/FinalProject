import React, { useState } from 'react';
import { ExternalLink, PlayCircle, Map, List, Bookmark, CheckCircle2, Circle, TrendingUp, FileText } from 'lucide-react';
import Roadmap from './Roadmap';
import JobMarketDashboard from './JobMarketDashboard';
import ResumeGenerator from './ResumeGenerator';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const JobDetails = ({ job, onBack }) => {
    const { user, savedPaths, toggleSavePath, userProgress, updateProgress } = useAuth();
    const [viewMode, setViewMode] = useState('roadmap'); // 'list' or 'roadmap'
    const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap', 'market', or 'resume'

    const saved = savedPaths.includes(job.id);
    const completedSteps = userProgress[job.id] || [];

    const toggleStep = (index) => {
        updateProgress(job.id, index);
    };

    const progress = job.roadmap ? Math.round((completedSteps.length / job.roadmap.length) * 100) : 0;

    return (
        <div className="container" style={{ maxWidth: '1000px', perspective: '1200px' }}>
            <motion.div
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}
            >
                <button
                    onClick={onBack}
                    style={{
                        background: 'transparent', border: 'none', color: 'var(--text-muted)',
                        fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                        transition: 'color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.color = 'var(--accent-blue)'}
                    onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                    &larr; Back to Jobs
                </button>

                <button
                    onClick={() => toggleSavePath(job.id)}
                    className="btn-3d"
                    style={{
                        background: saved
                            ? 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), var(--accent-pink)'
                            : 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%), var(--accent-blue)',
                        boxShadow: saved
                            ? '0 4px 0 #be185d, 0 5px 15px rgba(236,72,153,0.4), inset 0 1px 1px rgba(255,255,255,0.4)'
                            : '0 4px 0 #1d4ed8, 0 5px 15px rgba(37,99,235,0.4), inset 0 1px 1px rgba(255,255,255,0.4)'
                    }}
                >
                    <Bookmark size={18} fill={saved ? 'white' : 'none'} style={{ marginRight: '8px', display: 'inline-block', verticalAlign: 'middle' }} />
                    <span style={{ verticalAlign: 'middle' }}>{saved ? 'Saved to Path' : 'Bookmark Path'}</span>
                </button>
            </motion.div>

            {/* Header Core Component */}
            <motion.div
                className="glass-panel"
                initial={{ rotateX: 10, y: 30, opacity: 0 }} animate={{ rotateX: 0, y: 0, opacity: 1 }} transition={{ duration: 0.6, type: 'spring' }}
                style={{ padding: '40px', marginBottom: '30px', position: 'relative' }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, width: `${progress}%`, height: '6px', background: 'var(--accent-teal)', transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', boxShadow: 'var(--glow-teal)' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ textAlign: 'left', maxWidth: '75%' }}>
                        <h1 style={{ marginBottom: '12px', textAlign: 'left' }}>{job.title}</h1>
                        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>{job.description}</p>
                    </div>
                    {progress > 0 && (
                        <div style={{ textAlign: 'right', background: 'rgba(20, 184, 166, 0.1)', padding: '16px 24px', borderRadius: '20px', border: '1px solid rgba(20,184,166,0.3)', boxShadow: 'var(--glow-teal)' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent-teal)', fontFamily: 'var(--font-display)', lineHeight: '1' }}>{progress}%</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: '600', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Progress</div>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* 3D Tab Navigation */}
            <motion.div
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
                style={{ display: 'flex', gap: '16px', marginBottom: '30px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '20px', border: '1px solid var(--glass-border)' }}
            >
                {[
                    { id: 'roadmap', label: 'Career Journey', icon: <Map size={18} /> },
                    { id: 'market', label: 'Job Market', icon: <TrendingUp size={18} /> },
                    { id: 'resume', label: 'Resume Gen', icon: <FileText size={18} /> }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: '14px 20px',
                            borderRadius: '14px',
                            border: '1px solid',
                            borderColor: activeTab === tab.id ? 'var(--accent-blue)' : 'transparent',
                            background: activeTab === tab.id ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                            color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: activeTab === tab.id ? 'var(--glow-blue), inset 0 2px 4px rgba(255,255,255,0.1)' : 'none',
                            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 30, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    style={{ display: 'grid', gap: '30px' }}
                >
                    {activeTab === 'roadmap' && (
                        <>
                            {/* Roadmap Section */}
                            <div className="glass-panel" style={{ padding: '36px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '10px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)' }}>
                                            <Map size={24} color="var(--accent-blue)" />
                                        </div>
                                        <h2 style={{ margin: 0, color: 'white' }}>Career Roadmap</h2>
                                    </div>
                                    <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '10px', padding: '6px', border: '1px solid var(--glass-border)' }}>
                                        {['roadmap', 'list'].map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setViewMode(mode)}
                                                style={{
                                                    padding: '8px 16px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: viewMode === mode ? 'rgba(255,255,255,0.1)' : 'transparent',
                                                    boxShadow: viewMode === mode ? 'inset 0 2px 4px rgba(0,0,0,0.3), 0 0 10px rgba(255,255,255,0.05)' : 'none',
                                                    cursor: 'pointer',
                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                    color: viewMode === mode ? 'white' : 'var(--text-muted)',
                                                    fontWeight: viewMode === mode ? '600' : '500',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                {mode === 'roadmap' ? <Map size={16} /> : <List size={16} />}
                                                <span style={{ textTransform: 'capitalize' }}>{mode}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {viewMode === 'roadmap' ? (
                                    <div style={{ height: '500px', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.5)' }}>
                                        <Roadmap job={job} />
                                    </div>
                                ) : (
                                    <div style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid rgba(59, 130, 246, 0.2)' }}>
                                        {job.roadmap && job.roadmap.map((step, index) => {
                                            const isDone = completedSteps.includes(index);
                                            return (
                                                <motion.div
                                                    key={index}
                                                    whileHover={{ x: 5 }}
                                                    style={{
                                                        marginBottom: '28px',
                                                        position: 'relative',
                                                        cursor: 'pointer',
                                                        opacity: isDone ? 0.6 : 1,
                                                        background: 'rgba(0,0,0,0.2)',
                                                        padding: '20px',
                                                        borderRadius: '16px',
                                                        border: '1px solid',
                                                        borderColor: isDone ? 'rgba(20,184,166,0.3)' : 'rgba(255,255,255,0.05)',
                                                        boxShadow: isDone ? 'var(--glow-teal)' : 'var(--shadow-inner)'
                                                    }}
                                                    onClick={() => toggleStep(index)}
                                                >
                                                    <div style={{
                                                        position: 'absolute',
                                                        left: '-36px',
                                                        top: '24px',
                                                        zIndex: 1,
                                                        background: 'var(--bg-color)',
                                                        borderRadius: '50%',
                                                        padding: '4px'
                                                    }}>
                                                        {isDone ? (
                                                            <CheckCircle2 size={24} color="var(--accent-teal)" />
                                                        ) : (
                                                            <Circle size={24} color="var(--text-muted)" />
                                                        )}
                                                    </div>
                                                    <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        Step {index + 1}
                                                        {isDone && <span style={{ fontSize: '0.75rem', background: 'rgba(20,184,166,0.2)', color: '#5eead4', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(20,184,166,0.3)' }}>Completed</span>}
                                                    </h3>
                                                    <p style={{ color: 'var(--text-muted)' }}>{step}</p>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Resources Section */}
                            {job.resources && job.resources.length > 0 && (
                                <div className="glass-panel" style={{ padding: '36px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                                        <div style={{ padding: '10px', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', border: '1px solid rgba(236,72,153,0.2)' }}>
                                            <PlayCircle size={24} color="var(--accent-pink)" />
                                        </div>
                                        <h2 style={{ margin: 0, color: 'white' }}>Best Resources</h2>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                                        {job.resources.map((res, index) => (
                                            <a
                                                key={index}
                                                href={res.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '16px',
                                                    padding: '20px',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    borderRadius: '16px',
                                                    border: '1px solid rgba(255,255,255,0.08)',
                                                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                                    textDecoration: 'none',
                                                    color: 'var(--text-color)',
                                                    boxShadow: 'var(--shadow-inner)'
                                                }}
                                                onMouseOver={e => {
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = 'var(--shadow-3d-hover)';
                                                    e.currentTarget.style.borderColor = 'rgba(236,72,153,0.3)';
                                                    e.currentTarget.style.background = 'rgba(236,72,153,0.05)';
                                                }}
                                                onMouseOut={e => {
                                                    e.currentTarget.style.transform = 'translateY(0)';
                                                    e.currentTarget.style.boxShadow = 'var(--shadow-inner)';
                                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                                }}
                                            >
                                                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '10px' }}>
                                                    <ExternalLink size={20} color="var(--accent-pink)" />
                                                </div>
                                                <span style={{ fontWeight: '600', fontSize: '1.05rem' }}>{res.name}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'market' && (
                        <JobMarketDashboard jobTitle={job.title} />
                    )}

                    {activeTab === 'resume' && (
                        <ResumeGenerator job={job} userName={user.name} />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default JobDetails;
