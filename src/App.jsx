import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { careerData } from './data/careerData';
import CardGrid from './components/CardGrid';
import JobDetails from './components/JobDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import CareerBot from './components/CareerBot';
import Dashboard from './components/Dashboard';
import UserProfile from './components/UserProfile';
import ResumeGenerator from './components/ResumeGenerator';
import { ChevronRight, Home, Bot, LayoutDashboard, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Separate MainContent from AuthProvider to use the hook
const MainContent = () => {
    const { user } = useAuth();
    const [path, setPath] = useState([]);
    const [authPage, setAuthPage] = useState('login');
    const [searchQuery, setSearchQuery] = useState('');
    const [isBotOpen, setIsBotOpen] = useState(false);
    const [isDashboardOpen, setIsDashboardOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    if (!user) {
        return (
            <AnimatePresence mode="wait">
                <motion.div
                    key={authPage}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.4, type: 'spring' }}
                >
                    {authPage === 'login' ? (
                        <Login onSwitchToSignup={() => setAuthPage('signup')} />
                    ) : (
                        <Signup onSwitchToLogin={() => setAuthPage('login')} />
                    )}
                </motion.div>
            </AnimatePresence>
        );
    }

    // Helper to get current items to display
    const getCurrentView = () => {
        if (isDashboardOpen) return { type: 'dashboard' };
        if (isResumeOpen) return { type: 'resume' };

        if (searchQuery.trim()) {
            // Global Search Logic
            const results = [];
            careerData.forEach(edu => {
                (edu.branches || []).forEach(branch => {
                    if (branch.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                        results.push({ ...branch, type: 'branch', eduTitle: edu.title, parentEdu: edu });
                    }
                    (branch.jobs || []).forEach(job => {
                        if (job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            job.description.toLowerCase().includes(searchQuery.toLowerCase())) {
                            results.push({ ...job, type: 'job', branchTitle: branch.title, eduTitle: edu.title, parentEdu: edu, parentBranch: branch });
                        }
                    });
                });
            });

            return {
                type: 'search',
                title: `Search Results for "${searchQuery}"`,
                items: results
            };
        }

        if (path.length === 0) {
            return {
                type: 'list',
                title: 'Select Your Education Level',
                items: careerData
            };
        }

        const eduLevel = path[0];
        if (path.length === 1) {
            return {
                type: 'list',
                title: `Streams & Branches in ${eduLevel.title}`,
                items: eduLevel.branches || []
            };
        }

        const branch = path[1];
        if (path.length === 2) {
            return {
                type: 'list',
                title: `Career Opportunities for ${branch.title}`,
                items: branch.jobs || []
            };
        }

        const job = path[2];
        return {
            type: 'details',
            item: job
        };
    };

    const handleSelect = (item) => {
        setIsDashboardOpen(false);
        setIsResumeOpen(false);
        if (item.type === 'job') {
            setSearchQuery('');
            setPath([item.parentEdu, item.parentBranch, item]);
        } else if (item.type === 'branch') {
            setSearchQuery('');
            setPath([item.parentEdu, item]);
        } else {
            setPath([...path, item]);
        }
    };

    const handleBack = () => {
        setPath(path.slice(0, -1));
    };

    const navigateTo = (index) => {
        setSearchQuery('');
        setIsDashboardOpen(false);
        setIsResumeOpen(false);
        if (index === -1) {
            setPath([]);
        } else {
            setPath(path.slice(0, index + 1));
        }
    };

    const currentView = getCurrentView();

    return (
        <div className="app-container">
            {/* Floating 3D Navigation Bar */}
            <div style={{ padding: '20px', position: 'sticky', top: 0, zIndex: 100 }}>
                <nav className="glass-panel" style={{
                    padding: '12px 24px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                    maxWidth: '1280px',
                    margin: '0 auto',
                    borderRadius: '20px'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', flex: '1 1 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div
                                onClick={() => navigateTo(-1)}
                                style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: (path.length === 0 && !searchQuery && !isDashboardOpen) ? 'var(--accent-blue)' : 'var(--text-muted)', transition: 'color 0.3s' }}
                            >
                                <Home size={18} />
                                <span>Home</span>
                            </div>

                            {!isDashboardOpen && path.map((item, index) => (
                                <React.Fragment key={item.id}>
                                    <ChevronRight size={16} color="var(--text-muted)" />
                                    <span
                                        onClick={() => navigateTo(index)}
                                        style={{
                                            cursor: index === path.length - 1 ? 'default' : 'pointer',
                                            color: index === path.length - 1 ? 'var(--accent-blue)' : 'var(--text-muted)',
                                            fontWeight: index === path.length - 1 ? '600' : 'normal',
                                            whiteSpace: 'nowrap',
                                            transition: 'color 0.3s'
                                        }}
                                    >
                                        {item.title}
                                    </span>
                                </React.Fragment>
                            ))}

                            {isDashboardOpen && (
                                <React.Fragment>
                                    <ChevronRight size={16} color="var(--text-muted)" />
                                    <span style={{ color: 'var(--accent-blue)', fontWeight: '600' }}>Dashboard</span>
                                </React.Fragment>
                            )}
                        </div>

                        {/* Search Bar - 3D Inset */}
                        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '400px', minWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="text"
                                    placeholder="Search roles, skills, branches..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (e.target.value) setIsDashboardOpen(false);
                                    }}
                                    style={{ width: '100%', borderRadius: '20px' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', width: '100%', justifyContent: 'flex-end', flex: '1 1 auto' }}>
                        <div
                            onClick={() => {
                                setIsDashboardOpen(!isDashboardOpen);
                                setIsResumeOpen(false);
                                setSearchQuery('');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                color: isDashboardOpen ? 'var(--accent-blue)' : 'var(--text-muted)',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                transition: 'color 0.3s'
                            }}
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </div>

                        {/* Resume Builder shortcut */}
                        <div
                            onClick={() => {
                                setIsResumeOpen(!isResumeOpen);
                                setIsDashboardOpen(false);
                                setSearchQuery('');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                color: isResumeOpen ? 'var(--accent-teal)' : 'var(--text-muted)',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                transition: 'color 0.3s'
                            }}
                        >
                            <FileText size={18} />
                            <span>Resume</span>
                        </div>

                        {/* Bot Toggle with Neon Glow when active */}
                        <div
                            onClick={() => setIsBotOpen(!isBotOpen)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                padding: '8px 16px',
                                background: isBotOpen ? 'var(--accent-blue)' : 'rgba(255, 255, 255, 0.05)',
                                color: isBotOpen ? 'white' : 'var(--accent-blue)',
                                borderRadius: '20px',
                                border: '1px solid',
                                borderColor: isBotOpen ? 'var(--accent-blue)' : 'rgba(59, 130, 246, 0.3)',
                                boxShadow: isBotOpen ? 'var(--glow-blue)' : 'none',
                                transition: 'all 0.3s ease',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}
                        >
                            <Bot size={18} />
                            <span>Ask AI</span>
                        </div>

                        {/* Avatar button */}
                        <button
                            onClick={() => setIsProfileOpen(true)}
                            title="View Profile"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '50px', padding: '6px 16px 6px 6px',
                                boxShadow: 'var(--shadow-3d-base)'
                            }}
                        >
                            <div style={{
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: user.avatarColor || 'var(--accent-purple)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: '800', fontSize: '0.8rem', color: 'white',
                                flexShrink: 0,
                                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4)'
                            }}>
                                {user.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                            </div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)' }}>
                                {user.name?.split(' ')[0]}
                            </span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Main Content with 3D Page Transitions */}
            <main style={{ paddingBottom: '80px' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentView.type + (currentView.item?.id || currentView.title || '')}
                        initial={{ opacity: 0, y: 40, rotateX: -10 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: -40, rotateX: 10 }}
                        transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
                        style={{ perspective: '1000px' }}
                    >
                        {currentView.type === 'dashboard' ? (
                            <Dashboard
                                onBack={() => setIsDashboardOpen(false)}
                                onSelectJob={handleSelect}
                            />
                        ) : currentView.type === 'resume' ? (
                            <div className="container" style={{ maxWidth: '1000px', paddingTop: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                                    <button onClick={() => setIsResumeOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        ← Back
                                    </button>
                                    <span style={{ color: 'var(--text-color)', fontWeight: '600' }}>Resume Builder</span>
                                </div>
                                <ResumeGenerator job={null} />
                            </div>
                        ) : currentView.type === 'list' || currentView.type === 'search' ? (
                            <CardGrid
                                title={currentView.title}
                                items={currentView.items}
                                onSelect={handleSelect}
                            />
                        ) : (
                            <JobDetails
                                job={currentView.item}
                                onBack={handleBack}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </main>

            <CareerBot
                isOpen={isBotOpen}
                setIsOpen={setIsBotOpen}
                currentContext={currentView.type === 'details' ? currentView.item : null}
            />

            <AnimatePresence>
                {isProfileOpen && <UserProfile onClose={() => setIsProfileOpen(false)} />}
            </AnimatePresence>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <MainContent />
        </AuthProvider>
    );
}

export default App;
