import React, { useState } from 'react';
import { usePDF } from 'react-to-pdf';
import {
    Download, FileText, CheckCircle, User, Mail, Phone,
    GraduationCap, Briefcase, FolderOpen, Edit3, Eye,
    Plus, Trash2, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// ── Tiny helpers ──────────────────────────────────────
const field = (label, el) => (
    <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontWeight: '600', fontSize: '0.8rem', color: '#475569', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
        {el}
    </div>
);

const inp = (value, onChange, placeholder, type = 'text') => (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', color: '#1e293b', background: 'white' }} />
);

const tex = (value, onChange, placeholder, rows = 3) => (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        style={{ width: '100%', padding: '10px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', color: '#1e293b', background: 'white', lineHeight: '1.5' }} />
);

// ── Collapsible Section Card ──────────────────────────
const Section = ({ icon, title, color, bg, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div style={{ border: `2px solid ${color}30`, borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
            <button onClick={() => setOpen(o => !o)} style={{
                width: '100%', background: bg, border: 'none', padding: '14px 18px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: color, padding: '6px', borderRadius: '8px', display: 'flex', color: 'white' }}>{icon}</span>
                    <span style={{ fontWeight: '700', fontSize: '0.95rem', color: '#1e293b' }}>{title}</span>
                </div>
                <span style={{ color: color }}>{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</span>
            </button>
            {open && <div style={{ padding: '18px', background: 'white', borderTop: `1px solid ${color}20` }}>{children}</div>}
        </div>
    );
};

// ── Divider for resume preview ──────────────────────
const ResDivider = ({ label, icon }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '18px 0 10px', borderBottom: '2px solid #2563eb', paddingBottom: '4px' }}>
        <span style={{ color: '#2563eb' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '0.78rem', fontWeight: '800', color: '#2563eb', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</h3>
    </div>
);

// ════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════
const ResumeGenerator = ({ job }) => {
    const { user } = useAuth();
    const { toPDF, targetRef } = usePDF({ filename: `${job?.title?.replace(/\s+/g, '_') || 'Resume'}.pdf` });
    const [tab, setTab] = useState('edit'); // 'edit' | 'preview'

    // ── State ──
    const [info, setInfo] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: '',
        linkedin: '',
        portfolio: '',
        summary: `Aspiring ${job?.title || 'Professional'} with a strong foundation and a dedicated learning path. Eager to apply skills in a professional environment and contribute to innovative projects.`,
    });
    const set = (key) => (e) => setInfo(p => ({ ...p, [key]: e.target.value }));

    const [skills, setSkills] = useState(job?.roadmap?.slice() || ['Communication', 'Problem Solving', 'Teamwork']);
    const [newSkill, setNewSkill] = useState('');

    const [education, setEducation] = useState([{ degree: user?.education || '', school: '', year: '', grade: '' }]);
    const [experience, setExperience] = useState([{ title: '', company: '', duration: '', description: '' }]);
    const [projects, setProjects] = useState([{ name: '', desc: job?.roadmap?.[0] ? `Worked on projects covering ${job.roadmap[0]} and ${job.roadmap[1] || 'related topics'}.` : '', link: '' }]);

    const updArr = (setter, arr, i, key, val) => { const c = [...arr]; c[i] = { ...c[i], [key]: val }; setter(c); };
    const addRow = (setter, tmpl) => setter(p => [...p, { ...tmpl }]);
    const delRow = (setter, arr, i) => setter(arr.filter((_, idx) => idx !== i));

    const today = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

    // ── Tab button ──
    const TabBtn = ({ id, icon, label }) => (
        <button onClick={() => setTab(id)} style={{
            flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontWeight: '700',
            fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
            background: tab === id ? 'white' : 'transparent',
            color: tab === id ? '#4f46e5' : 'rgba(255,255,255,0.75)',
            borderRadius: tab === id ? '10px' : '0',
            boxShadow: tab === id ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
            transition: 'all 0.2s',
        }}>
            {icon} {label}
        </button>
    );

    // ════════════════════════════════════════════════════
    // EDIT PANEL
    // ════════════════════════════════════════════════════
    const EditPanel = () => (
        <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '75vh' }}>

            {/* ── 1. Personal Info ── */}
            <Section icon={<User size={16} />} title="1 · Personal Information" color="#6366f1" bg="#f5f3ff" defaultOpen>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                    {field('Full Name *', inp(info.name, set('name'), 'e.g. Sai Manikanta'))}
                    {field('Email *', inp(info.email, set('email'), 'you@example.com', 'email'))}
                    {field('Phone', inp(info.phone, set('phone'), '+91 98765 43210', 'tel'))}
                    {field('City / Location', inp(info.location, set('location'), 'Hyderabad, India'))}
                    {field('LinkedIn URL', inp(info.linkedin, set('linkedin'), 'linkedin.com/in/yourname'))}
                    {field('Portfolio / GitHub', inp(info.portfolio, set('portfolio'), 'github.com/yourname'))}
                </div>
                {field('Professional Summary', tex(info.summary, set('summary'), 'Write 2–3 sentences about yourself and your career goal…', 4))}
            </Section>

            {/* ── 2. Skills ── */}
            <Section icon={<CheckCircle size={16} />} title="2 · Skills" color="#0ea5e9" bg="#f0f9ff" defaultOpen>
                <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: '#64748b' }}>These skills are auto-filled from the career roadmap. Add or remove as needed.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
                    {skills.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#e0f2fe', color: '#0369a1', padding: '5px 12px', borderRadius: '20px', fontSize: '0.83rem', fontWeight: '600' }}>
                            {s}
                            <button onClick={() => setSkills(skills.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7dd3fc', fontSize: '1rem', padding: '0', lineHeight: 1, fontWeight: '700' }}>×</button>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { setSkills(p => [...p, newSkill.trim()]); setNewSkill(''); } }}
                        placeholder="Type a skill and press Enter…"
                        style={{ flex: 1, padding: '9px 12px', border: '1.5px solid #e2e8f0', borderRadius: '8px', fontSize: '0.9rem', outline: 'none' }} />
                    <button onClick={() => { if (newSkill.trim()) { setSkills(p => [...p, newSkill.trim()]); setNewSkill(''); } }}
                        style={{ background: '#0ea5e9', color: 'white', border: 'none', borderRadius: '8px', padding: '0 16px', cursor: 'pointer', fontWeight: '700', fontSize: '1.1rem' }}>+</button>
                </div>
            </Section>

            {/* ── 3. Education ── */}
            <Section icon={<GraduationCap size={16} />} title="3 · Education" color="#10b981" bg="#f0fdf4" defaultOpen>
                <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#64748b' }}>Fill in your degree, college/school name, passing year, and grade/percentage.</p>
                {education.map((edu, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                            {field('Degree / Course *', inp(edu.degree, e => updArr(setEducation, education, i, 'degree', e.target.value), 'e.g. B.Tech CSE / 10th / Diploma…'))}
                            {field('College / School / University *', inp(edu.school, e => updArr(setEducation, education, i, 'school', e.target.value), 'e.g. JNTUH, Hyderabad'))}
                            {field('Year of Passing', inp(edu.year, e => updArr(setEducation, education, i, 'year', e.target.value), 'e.g. 2025 or 2022 – 2025'))}
                            {field('Grade / % / CGPA', inp(edu.grade, e => updArr(setEducation, education, i, 'grade', e.target.value), 'e.g. 8.5 CGPA or 78%'))}
                        </div>
                        {education.length > 1 && (
                            <button onClick={() => delRow(setEducation, education, i)}
                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                                <Trash2 size={13} /> Remove this entry
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => addRow(setEducation, { degree: '', school: '', year: '', grade: '' })}
                    style={{ background: 'none', border: '1.5px dashed #6ee7b7', color: '#10b981', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Plus size={14} /> Add Another Education Entry
                </button>
            </Section>

            {/* ── 4. Experience ── */}
            <Section icon={<Briefcase size={16} />} title="4 · Work Experience / Internship" color="#f59e0b" bg="#fffbeb">
                <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#64748b' }}>Add internships, part-time or full-time jobs. Leave blank if fresher.</p>
                {experience.map((exp, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
                            {field('Job Title / Role', inp(exp.title, e => updArr(setExperience, experience, i, 'title', e.target.value), 'e.g. Frontend Developer Intern'))}
                            {field('Company Name', inp(exp.company, e => updArr(setExperience, experience, i, 'company', e.target.value), 'e.g. TechNova Solutions'))}
                            {field('Duration', inp(exp.duration, e => updArr(setExperience, experience, i, 'duration', e.target.value), 'e.g. June 2024 – Aug 2024'))}
                        </div>
                        {field('What did you do? (describe your work)',
                            tex(exp.description, e => updArr(setExperience, experience, i, 'description', e.target.value),
                                'e.g. • Built REST APIs\n• Developed React dashboard components\n• Reduced page load by 30%'))}
                        {experience.length > 1 && (
                            <button onClick={() => delRow(setExperience, experience, i)}
                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Trash2 size={13} /> Remove this entry
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => addRow(setExperience, { title: '', company: '', duration: '', description: '' })}
                    style={{ background: 'none', border: '1.5px dashed #fcd34d', color: '#d97706', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Plus size={14} /> Add Another Experience
                </button>
            </Section>

            {/* ── 5. Projects ── */}
            <Section icon={<FolderOpen size={16} />} title="5 · Projects" color="#8b5cf6" bg="#faf5ff">
                <p style={{ margin: '0 0 12px', fontSize: '0.85rem', color: '#64748b' }}>Add personal, college, or freelance projects you've built.</p>
                {projects.map((proj, i) => (
                    <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', marginBottom: '12px' }}>
                        {field('Project Name', inp(proj.name, e => updArr(setProjects, projects, i, 'name', e.target.value), 'e.g. E-Commerce Website'))}
                        {field('Description (what you built and tech used)',
                            tex(proj.desc, e => updArr(setProjects, projects, i, 'desc', e.target.value), 'e.g. Built a full-stack e-commerce site using React and Node.js with payment integration.'))}
                        {field('GitHub / Live Link (optional)', inp(proj.link, e => updArr(setProjects, projects, i, 'link', e.target.value), 'github.com/yourname/project'))}
                        {projects.length > 1 && (
                            <button onClick={() => delRow(setProjects, projects, i)}
                                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Trash2 size={13} /> Remove this project
                            </button>
                        )}
                    </div>
                ))}
                <button onClick={() => addRow(setProjects, { name: '', desc: '', link: '' })}
                    style={{ background: 'none', border: '1.5px dashed #c4b5fd', color: '#7c3aed', padding: '9px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem', display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <Plus size={14} /> Add Another Project
                </button>
            </Section>

            {/* Preview CTA */}
            <button onClick={() => setTab('preview')} style={{
                width: '100%', padding: '14px', marginTop: '6px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer',
                fontWeight: '700', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
                <Eye size={18} /> See My Resume Preview →
            </button>
        </div>
    );

    // ════════════════════════════════════════════════════
    // PREVIEW PANEL
    // ════════════════════════════════════════════════════
    const PreviewPanel = () => (
        <div style={{ overflowY: 'auto', maxHeight: '75vh', padding: '20px', background: '#f1f5f9' }}>
            <div ref={targetRef} style={{
                background: 'white', padding: '44px 48px', fontFamily: '"Inter", "Segoe UI", sans-serif',
                color: '#1e293b', lineHeight: '1.6', fontSize: '0.88rem',
                maxWidth: '760px', margin: '0 auto',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)', borderRadius: '4px'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', borderBottom: '2.5px solid #2563eb', paddingBottom: '16px', marginBottom: '20px' }}>
                    <h1 style={{ margin: '0 0 6px', fontSize: '1.9rem', fontWeight: '800', color: '#0f172a' }}>
                        {info.name || 'Your Name'}
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px', color: '#475569', fontSize: '0.8rem' }}>
                        {info.email && <span>✉ {info.email}</span>}
                        {info.phone && <span>📞 {info.phone}</span>}
                        {info.location && <span>📍 {info.location}</span>}
                        {info.linkedin && <span>🔗 {info.linkedin}</span>}
                        {info.portfolio && <span>🌐 {info.portfolio}</span>}
                    </div>
                </div>

                {/* Summary */}
                {info.summary && (<section style={{ marginBottom: '18px' }}>
                    <ResDivider label="Professional Summary" icon={<User size={13} />} />
                    <p style={{ margin: 0, color: '#334155' }}>{info.summary}</p>
                </section>)}

                {/* Skills */}
                {skills.length > 0 && (<section style={{ marginBottom: '18px' }}>
                    <ResDivider label="Core Skills" icon={<CheckCircle size={13} />} />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {skills.map((s, i) => (
                            <span key={i} style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 11px', borderRadius: '10px', fontSize: '0.8rem', fontWeight: '600', border: '1px solid #bfdbfe' }}>{s}</span>
                        ))}
                    </div>
                </section>)}

                {/* Education */}
                {education.some(e => e.degree || e.school) && (
                    <section style={{ marginBottom: '18px' }}>
                        <ResDivider label="Education" icon={<GraduationCap size={13} />} />
                        {education.map((edu, i) => (edu.degree || edu.school) && (
                            <div key={i} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{edu.degree || '—'}</strong>
                                    <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{edu.year}</span>
                                </div>
                                <div style={{ color: '#475569' }}>{edu.school}{edu.grade ? ` · ${edu.grade}` : ''}</div>
                            </div>
                        ))}
                    </section>
                )}

                {/* Experience */}
                {experience.some(e => e.title || e.company) && (
                    <section style={{ marginBottom: '18px' }}>
                        <ResDivider label="Work Experience" icon={<Briefcase size={13} />} />
                        {experience.map((exp, i) => (exp.title || exp.company) && (
                            <div key={i} style={{ marginBottom: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <strong>{exp.title}</strong>
                                    <span style={{ color: '#64748b', fontSize: '0.82rem' }}>{exp.duration}</span>
                                </div>
                                <div style={{ color: '#475569', marginBottom: '3px' }}>{exp.company}</div>
                                {exp.description && <div style={{ color: '#334155', whiteSpace: 'pre-line' }}>{exp.description}</div>}
                            </div>
                        ))}
                    </section>
                )}

                {/* Projects */}
                {projects.some(p => p.name || p.desc) && (
                    <section style={{ marginBottom: '18px' }}>
                        <ResDivider label="Projects" icon={<FolderOpen size={13} />} />
                        {projects.map((proj, i) => (proj.name || proj.desc) && (
                            <div key={i} style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                    <strong>{proj.name}</strong>
                                    {proj.link && <span style={{ fontSize: '0.78rem', color: '#2563eb' }}>{proj.link}</span>}
                                </div>
                                <p style={{ margin: '3px 0 0', color: '#334155' }}>{proj.desc}</p>
                            </div>
                        ))}
                    </section>
                )}

                <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#cbd5e1', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                    Generated by CareerPath · {today}
                </div>
            </div>
        </div>
    );

    // ════════════════════════════════════════════════════
    return (
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
            {/* ── Top Bar ── */}
            <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileText size={20} color="white" />
                    <div>
                        <div style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>Resume Builder</div>
                        <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.78rem' }}>For: {job?.title || 'General'}</div>
                    </div>
                </div>
                {tab === 'preview' && (
                    <button onClick={() => toPDF()} style={{
                        background: 'white', color: '#4f46e5', border: 'none', borderRadius: '8px',
                        padding: '9px 18px', fontWeight: '700', fontSize: '0.88rem',
                        display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                        <Download size={15} /> Download PDF
                    </button>
                )}
            </div>

            {/* ── Tab switcher ── */}
            <div style={{ display: 'flex', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', padding: '0 20px 14px', gap: '8px' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.15)', borderRadius: '12px', padding: '4px', flex: 1, maxWidth: '400px' }}>
                    <TabBtn id="edit" icon={<Edit3 size={15} />} label="✏️ Edit My Details" />
                    <TabBtn id="preview" icon={<Eye size={15} />} label="👁️ Preview Resume" />
                </div>
            </div>

            {/* ── Content ── */}
            {tab === 'edit' ? <EditPanel /> : <PreviewPanel />}
        </div>
    );
};

export default ResumeGenerator;
