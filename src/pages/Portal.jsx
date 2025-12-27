import { useState } from 'react';
import { Lock, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Portal() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'demo') {
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid access code');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="container" style={{ paddingTop: '150px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #0d1219 0%, #131a24 100%)',
                    padding: '40px',
                    borderRadius: '20px',
                    border: '1px solid rgba(0, 212, 255, 0.2)',
                    maxWidth: '400px',
                    width: '100%',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '60px', height: '60px', background: 'rgba(0, 212, 255, 0.1)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px', color: '#00d4ff'
                    }}>
                        <Lock size={24} />
                    </div>
                    <h2 style={{ marginBottom: '10px' }}>Client Portal</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>Enter your access code to view project status.</p>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="password"
                                placeholder="Access Code (Try 'demo')"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '8px', color: '#fff',
                                    outline: 'none'
                                }}
                            />
                            {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '8px', textAlign: 'left' }}>{error}</p>}
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                            Access Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Project <span className="accent" style={{ color: '#00d4ff' }}>Dashboard</span></h1>
                    <p style={{ color: '#94a3b8' }}>Welcome back, Reference Client</p>
                </div>
                <button className="btn btn-secondary" onClick={() => setIsAuthenticated(false)}>Sign Out</button>
            </div>

            {/* Project Status */}
            <div style={{
                background: 'linear-gradient(135deg, #0d1219 0%, rgba(13, 18, 25, 0.7) 100%)',
                border: '1px solid rgba(0, 212, 255, 0.15)', borderRadius: '16px', padding: '32px', marginBottom: '40px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <h3>Current Project: Custom CRM V1</h3>
                    <span style={{
                        background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff', padding: '4px 12px',
                        borderRadius: '20px', fontSize: '13px', fontWeight: '600'
                    }}>IN PROGRESS</span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>
                        <span>Progress</span>
                        <span>75%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #00d4ff, #6366f1)' }}></div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                    <StatusItem icon={<CheckCircle size={20} color="#10b981" />} title="Planning" date="Completed Dec 10" done />
                    <StatusItem icon={<CheckCircle size={20} color="#10b981" />} title="Design" date="Completed Dec 15" done />
                    <StatusItem icon={<Clock size={20} color="#00d4ff" />} title="Development" date="In Progress" active />
                    <StatusItem icon={<AlertCircle size={20} color="#64748b" />} title="Testing" date="Pending" />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                {/* Documents */}
                <div style={{
                    background: 'rgba(10, 14, 20, 0.6)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px', padding: '24px'
                }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={20} color="#00d4ff" /> Documents
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <DocItem name="Project_Scope_v2.pdf" date="Dec 05, 2024" size="2.4 MB" />
                        <DocItem name="Design_Mockups_Final.fig" date="Dec 14, 2024" size="15 MB" />
                        <DocItem name="Contract_Signed.pdf" date="Dec 01, 2024" size="1.1 MB" />
                    </div>
                </div>

                {/* Notes */}
                <div style={{
                    background: 'rgba(10, 14, 20, 0.6)', border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: '16px', padding: '24px'
                }}>
                    <h3 style={{ marginBottom: '20px' }}>Recent Updates</h3>
                    <div style={{ borderLeft: '2px solid rgba(0, 212, 255, 0.2)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div>
                            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>Today, 9:41 AM</p>
                            <p>Backend API integration completed. Starting frontend wiring for the user dashboard.</p>
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>Dec 24, 2:00 PM</p>
                            <p>Weekly sprint review. Demo scheduled for next Tuesday.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusItem({ icon, title, date, done, active }) {
    return (
        <div style={{
            background: active ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255,255,255,0.03)',
            border: active ? '1px solid rgba(0, 212, 255, 0.3)' : '1px solid transparent',
            borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {icon}
                <span style={{ fontWeight: '600', color: active ? '#fff' : (done ? '#fff' : '#64748b') }}>{title}</span>
            </div>
            <span style={{ fontSize: '13px', color: active ? '#00d4ff' : '#64748b' }}>{date}</span>
        </div>
    );
}

function DocItem({ name, date, size }) {
    return (
        <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
            cursor: 'pointer', transition: 'background 0.2s'
        }} className="doc-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={16} color="#64748b" />
                <div>
                    <p style={{ fontSize: '14px', marginBottom: '2px' }}>{name}</p>
                    <p style={{ fontSize: '12px', color: '#64748b' }}>{date}</p>
                </div>
            </div>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{size}</span>
        </div>
    );
}
