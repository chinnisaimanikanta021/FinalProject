import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Bot, User, ArrowRight, Sparkles, ClipboardCheck } from 'lucide-react';
import { careerData } from '../data/careerData';

const CareerBot = ({ isOpen, setIsOpen, currentContext }) => {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! I am your AI Career Assistant. How can I help you find your dream path today?' }
    ]);
    const [input, setInput] = useState('');
    const [isInterviewMode, setIsInterviewMode] = useState(false);
    const [interviewStep, setInterviewStep] = useState(0);
    const [interviewData, setInterviewData] = useState([]);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const startInterview = () => {
        if (!currentContext) return;

        setIsInterviewMode(true);
        setInterviewStep(0);

        const questions = [
            `What interests you most about a career as a ${currentContext.title}?`,
            `Are you familiar with skills like ${currentContext.roadmap?.[0] || 'the fundamentals'}? Can you explain what you know?`,
            `How do you plan to tackle learning ${currentContext.roadmap?.[1] || 'advanced topics'}?`,
        ];

        setInterviewData(questions);

        setMessages(prev => [...prev, {
            role: 'bot',
            text: `🚀 Success! Starting a Mock Interview for ${currentContext.title}. I will ask you 3 questions to test your readiness. First question: ${questions[0]}`
        }]);
    };

    const generateResponse = (query) => {
        if (isInterviewMode) {
            const nextStep = interviewStep + 1;
            if (nextStep < interviewData.length) {
                setInterviewStep(nextStep);
                return `Interesting! Next question: ${interviewData[nextStep]}`;
            } else {
                setIsInterviewMode(false);
                return `Great job! Interview complete for ${currentContext.title}. Based on your responses, you show great enthusiasm! I recommend focusing on the resources listed in the job details to strengthen your technical knowledge. You scored a 'Ready to Learn' grade! 🌟`;
            }
        }

        const q = query.toLowerCase();

        // Keyword based search in data
        let suggestions = [];
        careerData.forEach(edu => {
            edu.branches.forEach(branch => {
                if (q.includes(branch.title.toLowerCase())) {
                    suggestions.push({ type: 'branch', title: branch.title, edu: edu.title });
                }
                branch.jobs.forEach(job => {
                    if (q.includes(job.title.toLowerCase())) {
                        suggestions.push({ type: 'job', title: job.title, branch: branch.title });
                    }
                });
            });
        });

        if (suggestions.length > 0) {
            const top = suggestions[0];
            if (top.type === 'job') {
                return `I found a matching career: ${top.title} in the ${top.branch} field! Would you like to see the roadmap?`;
            }
            return `I see you are interested in ${top.title}. That is a great choice! You can find detailed jobs for this branch in the ${top.edu} category.`;
        }

        if (q.includes('hello') || q.includes('hi')) {
            return "Hello! I am your career guide. You can ask me things like 'What can I do after Mechanical?' or 'Jobs in CSE'. How can I help?";
        }

        return "I'm here to help with your career! You can explore the roadmap or ask me about specific roles. If you're viewing a specific job, I can even conduct a Mock Interview for you!";
    };

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);

        const currentInput = input;
        setInput('');

        // Simulate bot thinking
        setTimeout(() => {
            const botResponse = { role: 'bot', text: generateResponse(currentInput) };
            setMessages(prev => [...prev, botResponse]);
        }, 600);
    };

    if (!isOpen) return null;

    return (
        <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'inherit' }}>
            <div className="glass-panel" style={{
                width: '380px',
                height: '550px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'slideUp 0.3s ease-out',
                boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
            }}>
                <div style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ background: 'white', padding: '5px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bot size={22} color="#2563eb" />
                        </div>
                        <div>
                            <div style={{ fontWeight: '700', fontSize: '1rem' }}>AI Career Bot</div>
                            <div style={{ fontSize: '0.7rem', opacity: 0.9 }}>{isInterviewMode ? 'Interview Mode' : 'Always Active'}</div>
                        </div>
                    </div>
                    <X size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                </div>

                <div style={{
                    flex: 1,
                    padding: '20px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    background: 'rgba(255,255,255,0.5)'
                }}>
                    {messages.map((msg, i) => (
                        <div key={i} style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%',
                            display: 'flex',
                            gap: '12px',
                            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '10px',
                                background: msg.role === 'user' ? '#f1f5f9' : '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                {msg.role === 'user' ? <User size={18} color="#64748b" /> : <Bot size={18} color="white" />}
                            </div>
                            <div style={{
                                padding: '14px',
                                borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
                                fontSize: '0.95rem',
                                lineHeight: '1.5',
                                background: msg.role === 'user' ? '#2563eb' : 'white',
                                color: msg.role === 'user' ? 'white' : '#1e293b',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                border: msg.role === 'user' ? 'none' : '1px solid rgba(0,0,0,0.05)'
                            }}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={chatEndRef} />
                </div>

                {/* Interview Context Button */}
                {currentContext && !isInterviewMode && (
                    <div style={{ padding: '0 20px 10px 20px' }}>
                        <button
                            onClick={startInterview}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#f0f9ff',
                                color: '#0369a1',
                                border: '1px solid #bae6fd',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.85rem'
                            }}
                        >
                            <ClipboardCheck size={18} />
                            Mock Interview for {currentContext.title}
                        </button>
                    </div>
                )}

                <form onSubmit={handleSend} style={{ padding: '20px', background: 'white', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            type="text"
                            placeholder={isInterviewMode ? "Type your answer..." : "Type your question..."}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            style={{
                                width: '100%',
                                border: '1px solid #e2e8f0',
                                padding: '12px 15px',
                                borderRadius: '10px',
                                outline: 'none',
                                fontSize: '0.9rem'
                            }}
                        />
                    </div>
                    <button
                        type="submit"
                        style={{
                            background: '#2563eb',
                            color: 'white',
                            width: '45px',
                            height: '45px',
                            borderRadius: '10px',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                    >
                        <Send size={20} />
                    </button>
                </form>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default CareerBot;
