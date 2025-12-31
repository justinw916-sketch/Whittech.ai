import { useState, useEffect } from 'react';
import { Lock, FileText, CheckCircle, Clock, AlertCircle, Users, Plus, Trash2, LogOut, Shield, User } from 'lucide-react';

// Initialize default users in localStorage if not present
const initializeUsers = () => {
    const stored = localStorage.getItem('portal_users');
    if (!stored) {
        const defaultUsers = [
            { username: 'admin', password: 'admin1', role: 'admin', clientName: 'Administrator' }
        ];
        localStorage.setItem('portal_users', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
    return JSON.parse(stored);
};

export default function Portal() {
    const [users, setUsers] = useState(() => initializeUsers());
    const [currentUser, setCurrentUser] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Sync users to localStorage
    useEffect(() => {
        localStorage.setItem('portal_users', JSON.stringify(users));
    }, [users]);

    const handleLogin = (e) => {
        e.preventDefault();
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setCurrentUser(user);
            setError('');
            setUsername('');
            setPassword('');
        } else {
            setError('Invalid username or password');
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
    };

    // LOGIN SCREEN
    if (!currentUser) {
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
                    <h2 style={{ marginBottom: '10px' }}>Portal Login</h2>
                    <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>Enter your credentials to access your dashboard.</p>

                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: '16px' }}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                style={{
                                    width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '8px', color: '#fff',
                                    outline: 'none', marginBottom: '0'
                                }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="password"
                                placeholder="Password"
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
                            Sign In
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // ADMIN PORTAL
    if (currentUser.role === 'admin') {
        return <AdminPortal users={users} setUsers={setUsers} onLogout={handleLogout} />;
    }

    // CLIENT PORTAL
    return <ClientPortal user={currentUser} onLogout={handleLogout} />;
}

// ==================== ADMIN PORTAL ====================
function AdminPortal({ users, setUsers, onLogout }) {
    const [newUser, setNewUser] = useState({ username: '', password: '', clientName: '' });
    const [showAddForm, setShowAddForm] = useState(false);

    const addUser = () => {
        if (!newUser.username || !newUser.password || !newUser.clientName) return;
        if (users.find(u => u.username === newUser.username)) {
            alert('Username already exists');
            return;
        }
        setUsers([...users, { ...newUser, role: 'client' }]);
        setNewUser({ username: '', password: '', clientName: '' });
        setShowAddForm(false);
    };

    const deleteUser = (username) => {
        if (username === 'admin') return;
        setUsers(users.filter(u => u.username !== username));
    };

    const clientUsers = users.filter(u => u.role === 'client');

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield size={28} color="#a855f7" />
                        Admin <span style={{ color: '#a855f7' }}>Portal</span>
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Manage client accounts and access</p>
                </div>
                <button className="btn btn-secondary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={16} /> Sign Out
                </button>
            </div>

            {/* User Management */}
            <div style={{
                background: 'linear-gradient(135deg, #0d1219 0%, rgba(13, 18, 25, 0.7) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '32px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Users size={20} color="#a855f7" /> Client Accounts
                    </h3>
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                            border: 'none', padding: '10px 20px', borderRadius: '8px',
                            color: '#fff', cursor: 'pointer', fontWeight: '600'
                        }}
                    >
                        <Plus size={16} /> Add Client
                    </button>
                </div>

                {/* Add User Form */}
                {showAddForm && (
                    <div style={{
                        background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '12px', padding: '20px', marginBottom: '24px'
                    }}>
                        <h4 style={{ marginBottom: '16px', color: '#a855f7' }}>New Client Account</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                            />
                            <input
                                type="text"
                                placeholder="Client/Company Name"
                                value={newUser.clientName}
                                onChange={(e) => setNewUser({ ...newUser, clientName: e.target.value })}
                                style={{ padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
                            />
                        </div>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={addUser} style={{ padding: '10px 24px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
                                Create Account
                            </button>
                            <button onClick={() => setShowAddForm(false)} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                {clientUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                        <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>No client accounts yet. Click "Add Client" to create one.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontWeight: '500' }}>Username</th>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontWeight: '500' }}>Client Name</th>
                                    <th style={{ textAlign: 'left', padding: '12px 16px', color: '#94a3b8', fontWeight: '500' }}>Password</th>
                                    <th style={{ textAlign: 'right', padding: '12px 16px', color: '#94a3b8', fontWeight: '500' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clientUsers.map(user => (
                                    <tr key={user.username} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <User size={16} color="#64748b" /> {user.username}
                                        </td>
                                        <td style={{ padding: '16px' }}>{user.clientName}</td>
                                        <td style={{ padding: '16px', color: '#64748b' }}>••••••••</td>
                                        <td style={{ padding: '16px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => deleteUser(user.username)}
                                                style={{ background: 'rgba(239, 68, 68, 0.2)', border: 'none', padding: '8px 12px', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

// ==================== CLIENT PORTAL ====================
function ClientPortal({ user, onLogout }) {
    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Project <span className="accent" style={{ color: '#00d4ff' }}>Dashboard</span></h1>
                    <p style={{ color: '#94a3b8' }}>Welcome back, {user.clientName}</p>
                </div>
                <button className="btn btn-secondary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={16} /> Sign Out
                </button>
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

// ==================== HELPER COMPONENTS ====================
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
