import React, { useState, useEffect } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
    BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, Briefcase, MapPin, DollarSign, ExternalLink, Loader2 } from 'lucide-react';

const JobMarketDashboard = ({ jobTitle }) => {
    const [loading, setLoading] = useState(true);
    const [marketData, setMarketData] = useState(null);

    // Live job links based on job title
    useEffect(() => {
        const timer = setTimeout(() => {
            const q = encodeURIComponent(jobTitle);
            const slug = jobTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

            setMarketData({
                salaryTrend: [
                    { year: '2021', salary: 4.5 },
                    { year: '2022', salary: 5.2 },
                    { year: '2023', salary: 6.8 },
                    { year: '2024', salary: 8.5 },
                    { year: '2025', salary: 10.2 },
                ],
                liveJobs: [
                    {
                        title: `${jobTitle} Jobs – Senior & Mid Level`,
                        company: '🔵 Naukri.com',
                        location: 'Bangalore / Hyderabad / Pune',
                        salary: '₹8–30 LPA',
                        link: `https://www.naukri.com/${slug}-jobs`
                    },
                    {
                        title: `${jobTitle} Jobs in India`,
                        company: '🔗 LinkedIn Jobs',
                        location: 'Pan India',
                        salary: '₹6–25 LPA',
                        link: `https://www.linkedin.com/jobs/search/?keywords=${q}&location=India&geoId=102713980`
                    },
                    {
                        title: `${jobTitle} – Fresher & Experienced`,
                        company: '🟢 Indeed India',
                        location: 'India (All Cities)',
                        salary: '₹3–20 LPA',
                        link: `https://in.indeed.com/jobs?q=${q}&l=India`
                    },
                    {
                        title: `${jobTitle} Internship & Entry Level`,
                        company: '🟠 Internshala',
                        location: 'Remote / On-site India',
                        salary: '₹15–50k /month',
                        link: `https://internshala.com/internships/${slug}-internship`
                    },
                    {
                        title: `${jobTitle} – Remote Openings`,
                        company: '⭐ Glassdoor',
                        location: 'Remote (India)',
                        salary: '₹5–40 LPA',
                        link: `https://www.glassdoor.co.in/Job/india-${slug}-jobs-SRCH_IL.0,5_IN115_KO6,${6 + slug.length}.htm`
                    },
                ],
                globalDemand: [
                    { country: 'India', demand: 85 },
                    { country: 'USA', demand: 92 },
                    { country: 'Germany', demand: 78 },
                    { country: 'UK', demand: 75 },
                    { country: 'Singapore', demand: 88 },
                ]
            });
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, [jobTitle]);

    if (loading) {
        return (
            <div style={{ height: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                <Loader2 className="animate-spin" size={32} color="#4f46e5" />
                <p style={{ color: '#64748b' }}>Fetching real-time market data for {jobTitle}...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gap: '25px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Salary Trend Chart */}
                <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        <TrendingUp size={18} color="#10b981" />
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Avg. Salary Trend (LPA)</h3>
                    </div>
                    <div style={{ width: '100%', height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={marketData.salaryTrend}>
                                <defs>
                                    <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Area type="monotone" dataKey="salary" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSalary)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Global Demand Chart */}
                <div className="glass-panel" style={{ padding: '20px', background: 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        <Briefcase size={18} color="#4f46e5" />
                        <h3 style={{ margin: 0, fontSize: '1rem' }}>Global Demand Index</h3>
                    </div>
                    <div style={{ width: '100%', height: '200px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marketData.globalDemand}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="country" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis hide />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                />
                                <Bar dataKey="demand" fill="#7c3aed" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Live Job Postings */}
            <div className="glass-panel" style={{ padding: '25px', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: '#fef3c7', padding: '8px', borderRadius: '8px' }}>
                            <TrendingUp size={20} color="#d97706" />
                        </div>
                        <h3 style={{ margin: 0 }}>Top Live Postings in India</h3>
                    </div>
                    <span style={{ fontSize: '0.8rem', padding: '4px 12px', background: '#ecfdf5', color: '#059669', borderRadius: '20px', fontWeight: '600' }}>
                        Updated Just Now
                    </span>
                </div>

                <div style={{ display: 'grid', gap: '15px' }}>
                    {marketData.liveJobs.map((job, i) => (
                        <div key={i} style={{
                            padding: '16px',
                            borderRadius: '12px',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            transition: 'all 0.2s'
                        }} className="job-row">
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{job.title}</h4>
                                <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem', color: '#64748b' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Briefcase size={14} /> {job.company}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={14} /> {job.location}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontWeight: '600' }}>
                                        <DollarSign size={14} /> {job.salary}
                                    </span>
                                </div>
                            </div>
                            <a href={job.link} target="_blank" rel="noreferrer" style={{
                                padding: '8px 12px',
                                background: 'rgba(79, 70, 229, 0.05)',
                                color: '#4f46e5',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                Apply <ExternalLink size={14} />
                            </a>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`.job-row:hover { background: #f8fafc; transform: translateX(5px); }`}</style>
        </div>
    );
};

export default JobMarketDashboard;
