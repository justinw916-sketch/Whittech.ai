import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Lock, FileText, CheckCircle, Clock, AlertCircle, Users, Plus, Trash2, LogOut, Shield, User,
    Edit, Eye, X, Calendar, DollarSign, Phone, Mail, Building, Download, MessageSquare, Save, Upload, Loader
} from 'lucide-react';

// File API helpers
const uploadFile = async (file, clientId) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    formData.append('filename', file.name);

    const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
    });
    return response.json();
};

const listFiles = async (clientId) => {
    const response = await fetch(`/api/files/list/${clientId}`);
    return response.json();
};

const deleteFile = async (key) => {
    const response = await fetch(`/api/files/${encodeURIComponent(key)}`, {
        method: 'DELETE',
    });
    return response.json();
};

// Format file size to human readable
const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// Default project template for new clients
const getDefaultProject = () => ({
    name: "New Project",
    status: "planning",
    progress: 0,
    startDate: new Date().toISOString().split('T')[0],
    estimatedCompletion: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    phases: [
        { name: "Planning", status: "active", date: "In Progress" },
        { name: "Design", status: "pending", date: "Pending" },
        { name: "Development", status: "pending", date: "Pending" },
        { name: "Testing", status: "pending", date: "Pending" },
        { name: "Launch", status: "pending", date: "Pending" }
    ],
    documents: [],
    updates: [],
    invoices: []
});

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

    const handleLogout = () => setCurrentUser(null);

    const updateUser = (updatedUser) => {
        setUsers(users.map(u => u.username === updatedUser.username ? updatedUser : u));
        if (currentUser?.username === updatedUser.username) {
            setCurrentUser(updatedUser);
        }
    };

    // LOGIN SCREEN
    if (!currentUser) {
        return (
            <div className="container" style={{ paddingTop: '150px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        background: 'linear-gradient(135deg, #0d1219 0%, #131a24 100%)',
                        padding: '40px', borderRadius: '20px', border: '1px solid rgba(0, 212, 255, 0.2)',
                        maxWidth: '400px', width: '100%', textAlign: 'center'
                    }}
                >
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
                        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '8px', color: '#fff', marginBottom: '16px' }} />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0, 212, 255, 0.2)', borderRadius: '8px', color: '#fff', marginBottom: '8px' }} />
                        {error && <p style={{ color: '#ef4444', fontSize: '12px', marginBottom: '16px', textAlign: 'left' }}>{error}</p>}
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}>Sign In</button>
                    </form>
                </motion.div>
            </div>
        );
    }

    if (currentUser.role === 'admin') {
        return <AdminPortal users={users} setUsers={setUsers} onLogout={handleLogout} />;
    }

    return <ClientPortal user={currentUser} onLogout={handleLogout} />;
}

// ==================== ADMIN PORTAL ====================
function AdminPortal({ users, setUsers, onLogout }) {
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [viewingUser, setViewingUser] = useState(null);
    const [emailStatus, setEmailStatus] = useState(null);
    const [newUser, setNewUser] = useState({
        username: '', password: '', clientName: '',
        project: getDefaultProject()
    });

    const clientUsers = users.filter(u => u.role === 'client');

    const addUser = async () => {
        if (!newUser.username || !newUser.password || !newUser.clientName) return;
        if (users.find(u => u.username === newUser.username)) {
            alert('Username already exists');
            return;
        }

        // Add user to local storage
        const createdUser = { ...newUser, role: 'client' };
        setUsers([...users, createdUser]);

        // Send welcome email if contact email is provided
        const contactEmail = newUser.project?.contactEmail;
        if (contactEmail) {
            setEmailStatus('sending');
            try {
                const response = await fetch('/api/email/welcome', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: newUser.username,
                        password: newUser.password,
                        clientName: newUser.clientName,
                        projectName: newUser.project?.name,
                        startDate: newUser.project?.startDate,
                        estimatedCompletion: newUser.project?.estimatedCompletion,
                        contactPerson: newUser.project?.contactPerson,
                        contactEmail: contactEmail,
                        contactPhone: newUser.project?.contactPhone,
                    }),
                });

                const result = await response.json();
                if (result.success) {
                    setEmailStatus('sent');
                    setTimeout(() => setEmailStatus(null), 5000);
                } else {
                    console.error('Email error:', result);
                    setEmailStatus('error');
                    setTimeout(() => setEmailStatus(null), 5000);
                }
            } catch (err) {
                console.error('Failed to send welcome email:', err);
                setEmailStatus('error');
                setTimeout(() => setEmailStatus(null), 5000);
            }
        }

        setNewUser({ username: '', password: '', clientName: '', project: getDefaultProject() });
        setShowAddForm(false);
    };

    const deleteUser = (username) => {
        if (confirm(`Delete client "${username}"? This cannot be undone.`)) {
            setUsers(users.filter(u => u.username !== username));
        }
    };

    const saveUserEdit = (updatedUser) => {
        setUsers(users.map(u => u.username === updatedUser.username ? updatedUser : u));
        setEditingUser(null);
    };

    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            {/* Email Status Toast */}
            <AnimatePresence>
                {emailStatus && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        style={{
                            position: 'fixed', top: '100px', right: '20px', zIndex: 1001,
                            padding: '16px 24px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px',
                            background: emailStatus === 'sent' ? 'rgba(16, 185, 129, 0.9)' :
                                emailStatus === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(0, 212, 255, 0.9)',
                            color: '#fff', fontWeight: '500', boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                        }}
                    >
                        {emailStatus === 'sending' && <><Loader size={18} className="spin" /> Sending welcome email...</>}
                        {emailStatus === 'sent' && <><CheckCircle size={18} /> Welcome email sent successfully!</>}
                        {emailStatus === 'error' && <><AlertCircle size={18} /> Failed to send email (user still created)</>}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Shield size={28} color="#a855f7" /> Admin <span style={{ color: '#a855f7' }}>Portal</span>
                    </h1>
                    <p style={{ color: '#94a3b8' }}>Manage client accounts and projects</p>
                </div>
                <button className="btn btn-secondary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LogOut size={16} /> Sign Out
                </button>
            </div>

            {/* User Management */}
            <div style={{ background: 'linear-gradient(135deg, #0d1219 0%, rgba(13, 18, 25, 0.7) 100%)', border: '1px solid rgba(168, 85, 247, 0.2)', borderRadius: '16px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={20} color="#a855f7" /> Client Accounts ({clientUsers.length})</h3>
                    <button onClick={() => setShowAddForm(!showAddForm)} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none', padding: '10px 20px', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>
                        <Plus size={16} /> Add Client
                    </button>
                </div>

                {/* Add User Form */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '12px', padding: '24px', marginBottom: '24px', overflow: 'hidden' }}>
                            <h4 style={{ marginBottom: '20px', color: '#a855f7' }}>New Client Account</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                                <InputField label="Username" value={newUser.username} onChange={v => setNewUser({ ...newUser, username: v })} />
                                <InputField label="Password" type="password" value={newUser.password} onChange={v => setNewUser({ ...newUser, password: v })} />
                                <InputField label="Client/Company Name" value={newUser.clientName} onChange={v => setNewUser({ ...newUser, clientName: v })} />
                                <InputField label="Project Name" value={newUser.project.name} onChange={v => setNewUser({ ...newUser, project: { ...newUser.project, name: v } })} />
                                <InputField label="Start Date" type="date" value={newUser.project.startDate} onChange={v => setNewUser({ ...newUser, project: { ...newUser.project, startDate: v } })} />
                                <InputField label="Est. Completion" type="date" value={newUser.project.estimatedCompletion} onChange={v => setNewUser({ ...newUser, project: { ...newUser.project, estimatedCompletion: v } })} />
                                <InputField label="Contact Person" value={newUser.project.contactPerson} onChange={v => setNewUser({ ...newUser, project: { ...newUser.project, contactPerson: v } })} />
                                <InputField label="Contact Email" value={newUser.project.contactEmail} onChange={v => setNewUser({ ...newUser, project: { ...newUser.project, contactEmail: v } })} />
                                <InputField label="Contact Phone" value={newUser.project.contactPhone} onChange={v => setNewUser({ ...newUser, project: { ...newUser.project, contactPhone: v } })} />
                            </div>
                            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                                <button onClick={addUser} style={{ padding: '10px 24px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: '600' }}>Create Account</button>
                                <button onClick={() => setShowAddForm(false)} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Users Table */}
                {clientUsers.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                        <Users size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                        <p>No client accounts yet. Click "Add Client" to create one.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {clientUsers.map(user => (
                            <div key={user.username} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '48px', height: '48px', background: 'rgba(0,212,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Building size={20} color="#00d4ff" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '600', fontSize: '16px' }}>{user.clientName}</div>
                                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>@{user.username} • {user.project?.name || 'No project'}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <StatusBadge status={user.project?.status || 'planning'} />
                                    <button onClick={() => setViewingUser(user)} style={{ background: 'rgba(0,212,255,0.1)', border: 'none', padding: '8px 12px', borderRadius: '6px', color: '#00d4ff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Eye size={14} /> View</button>
                                    <button onClick={() => setEditingUser(user)} style={{ background: 'rgba(168,85,247,0.1)', border: 'none', padding: '8px 12px', borderRadius: '6px', color: '#a855f7', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Edit size={14} /> Edit</button>
                                    <button onClick={() => deleteUser(user.username)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', padding: '8px 12px', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Trash2 size={14} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingUser && <EditClientModal user={editingUser} onSave={saveUserEdit} onClose={() => setEditingUser(null)} />}
                {viewingUser && <ViewClientModal user={viewingUser} onClose={() => setViewingUser(null)} />}
            </AnimatePresence>
        </div>
    );
}

// ==================== EDIT CLIENT MODAL ====================
function EditClientModal({ user, onSave, onClose }) {
    const [editedUser, setEditedUser] = useState(JSON.parse(JSON.stringify(user)));
    const [activeTab, setActiveTab] = useState('project');
    const [uploading, setUploading] = useState(false);
    const [r2Files, setR2Files] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const fileInputRef = useRef(null);

    // Load R2 files when documents tab is opened
    useEffect(() => {
        if (activeTab === 'documents') {
            loadR2Files();
        }
    }, [activeTab]);

    const loadR2Files = async () => {
        setLoadingFiles(true);
        try {
            const result = await listFiles(user.username);
            setR2Files(result.files || []);
        } catch (err) {
            console.error('Failed to load files:', err);
        }
        setLoadingFiles(false);
    };

    const updateProject = (key, value) => {
        setEditedUser({ ...editedUser, project: { ...editedUser.project, [key]: value } });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await uploadFile(file, user.username);
            if (result.success) {
                // Add to local project documents for display
                updateProject('documents', [
                    ...editedUser.project.documents,
                    { name: file.name, date: new Date().toLocaleDateString(), size: formatFileSize(file.size), key: result.key }
                ]);
                // Reload R2 files
                loadR2Files();
            }
        } catch (err) {
            alert('Upload failed: ' + err.message);
        }
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleDeleteFile = async (key, index) => {
        if (!confirm('Delete this file?')) return;
        try {
            await deleteFile(key);
            // Remove from local docs
            const docs = [...editedUser.project.documents];
            docs.splice(index, 1);
            updateProject('documents', docs);
            loadR2Files();
        } catch (err) {
            alert('Delete failed: ' + err.message);
        }
    };

    const addUpdate = () => {
        const message = prompt('Update message');
        if (message) {
            updateProject('updates', [{ date: new Date().toLocaleDateString(), message }, ...editedUser.project.updates]);
        }
    };

    const addInvoice = () => {
        const amount = prompt('Invoice amount ($)');
        if (amount) {
            const id = `INV-${String(editedUser.project.invoices.length + 1).padStart(3, '0')}`;
            updateProject('invoices', [...editedUser.project.invoices, { id, amount: parseFloat(amount), status: 'pending', date: new Date().toLocaleDateString() }]);
        }
    };

    const updatePhase = (index, status) => {
        const phases = [...editedUser.project.phases];
        phases[index] = { ...phases[index], status, date: status === 'completed' ? new Date().toLocaleDateString() : status === 'active' ? 'In Progress' : 'Pending' };
        updateProject('phases', phases);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                style={{ background: '#0d1219', borderRadius: '20px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'hidden', border: '1px solid rgba(168,85,247,0.3)' }}>
                {/* Header */}
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Edit size={20} color="#a855f7" /> Edit: {editedUser.clientName}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    {['project', 'phases', 'documents', 'updates', 'invoices'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            style={{ flex: 1, padding: '12px', background: activeTab === tab ? 'rgba(168,85,247,0.1)' : 'transparent', border: 'none', borderBottom: activeTab === tab ? '2px solid #a855f7' : '2px solid transparent', color: activeTab === tab ? '#a855f7' : '#64748b', cursor: 'pointer', textTransform: 'capitalize', fontWeight: '500' }}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div style={{ padding: '24px', overflow: 'auto', maxHeight: 'calc(90vh - 180px)' }}>
                    {activeTab === 'project' && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <InputField label="Project Name" value={editedUser.project.name} onChange={v => updateProject('name', v)} />
                            <div>
                                <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Status</label>
                                <select value={editedUser.project.status} onChange={e => updateProject('status', e.target.value)} style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}>
                                    <option value="planning">Planning</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="review">Under Review</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <InputField label="Progress %" type="number" value={editedUser.project.progress} onChange={v => updateProject('progress', Math.min(100, Math.max(0, parseInt(v) || 0)))} />
                            <InputField label="Start Date" type="date" value={editedUser.project.startDate} onChange={v => updateProject('startDate', v)} />
                            <InputField label="Est. Completion" type="date" value={editedUser.project.estimatedCompletion} onChange={v => updateProject('estimatedCompletion', v)} />
                            <InputField label="Contact Person" value={editedUser.project.contactPerson} onChange={v => updateProject('contactPerson', v)} />
                            <InputField label="Contact Email" value={editedUser.project.contactEmail} onChange={v => updateProject('contactEmail', v)} />
                            <InputField label="Contact Phone" value={editedUser.project.contactPhone} onChange={v => updateProject('contactPhone', v)} />
                        </div>
                    )}

                    {activeTab === 'phases' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {editedUser.project.phases.map((phase, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <span style={{ fontWeight: '500' }}>{phase.name}</span>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {['pending', 'active', 'completed'].map(s => (
                                            <button key={s} onClick={() => updatePhase(i, s)}
                                                style={{ padding: '6px 12px', background: phase.status === s ? (s === 'completed' ? '#10b981' : s === 'active' ? '#00d4ff' : '#64748b') : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px', textTransform: 'capitalize' }}>
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} style={{ display: 'none' }} />
                            <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
                                style={{ marginBottom: '16px', padding: '10px 20px', background: uploading ? '#4b5563' : '#10b981', border: 'none', borderRadius: '8px', color: '#fff', cursor: uploading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {uploading ? <><Loader size={16} className="spin" /> Uploading...</> : <><Upload size={16} /> Upload File</>}
                            </button>

                            {loadingFiles ? (
                                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}><Loader size={24} className="spin" /> Loading files...</div>
                            ) : r2Files.length === 0 && editedUser.project.documents.length === 0 ? (
                                <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No documents yet. Click "Upload File" to add one.</p>
                            ) : (
                                <>
                                    {/* R2 Cloud Files */}
                                    {r2Files.length > 0 && (
                                        <div style={{ marginBottom: '16px' }}>
                                            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <CheckCircle size={12} color="#10b981" /> Cloud Storage ({r2Files.length} files)
                                            </div>
                                            {r2Files.map((file, i) => (
                                                <div key={file.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(16,185,129,0.05)', borderRadius: '8px', marginBottom: '8px', border: '1px solid rgba(16,185,129,0.2)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <FileText size={16} color="#10b981" />
                                                        <div>
                                                            <span style={{ fontSize: '14px' }}>{file.filename}</span>
                                                            <div style={{ fontSize: '11px', color: '#64748b' }}>{formatFileSize(file.size)}</div>
                                                        </div>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '8px' }}>
                                                        <a href={`/api/files/download/${encodeURIComponent(file.key)}`} download
                                                            style={{ background: 'rgba(0,212,255,0.1)', border: 'none', padding: '6px 10px', borderRadius: '6px', color: '#00d4ff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                            <Download size={14} />
                                                        </a>
                                                        <button onClick={() => handleDeleteFile(file.key, i)}
                                                            style={{ background: 'rgba(239,68,68,0.1)', border: 'none', padding: '6px 10px', borderRadius: '6px', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {activeTab === 'updates' && (
                        <div>
                            <button onClick={addUpdate} style={{ marginBottom: '16px', padding: '10px 20px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16} /> Add Update</button>
                            {editedUser.project.updates.map((update, i) => (
                                <div key={i} style={{ padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '8px', borderLeft: '3px solid #00d4ff' }}>
                                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{update.date}</div>
                                    <div>{update.message}</div>
                                </div>
                            ))}
                            {editedUser.project.updates.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No updates yet</p>}
                        </div>
                    )}

                    {activeTab === 'invoices' && (
                        <div>
                            <button onClick={addInvoice} style={{ marginBottom: '16px', padding: '10px 20px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}><Plus size={16} /> Add Invoice</button>
                            {editedUser.project.invoices.map((inv, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <DollarSign size={16} color="#10b981" />
                                        <div>
                                            <div style={{ fontWeight: '500' }}>{inv.id}</div>
                                            <div style={{ fontSize: '12px', color: '#64748b' }}>{inv.date}</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontWeight: '600' }}>${inv.amount.toLocaleString()}</div>
                                        <button onClick={() => {
                                            const invoices = [...editedUser.project.invoices];
                                            invoices[i] = { ...invoices[i], status: invoices[i].status === 'paid' ? 'pending' : 'paid' };
                                            updateProject('invoices', invoices);
                                        }} style={{ fontSize: '11px', padding: '2px 8px', background: inv.status === 'paid' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: inv.status === 'paid' ? '#10b981' : '#f59e0b', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{inv.status}</button>
                                    </div>
                                </div>
                            ))}
                            {editedUser.project.invoices.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>No invoices yet</p>}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button onClick={onClose} style={{ padding: '10px 24px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={() => onSave(editedUser)} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Save size={16} /> Save Changes</button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==================== VIEW CLIENT MODAL ====================
function ViewClientModal({ user, onClose }) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                style={{ background: '#0d1219', borderRadius: '20px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflow: 'auto', border: '1px solid rgba(0,212,255,0.3)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Eye size={20} color="#00d4ff" /> Preview: {user.clientName}</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
                </div>
                <div style={{ padding: '24px' }}>
                    <ClientDashboardContent user={user} />
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==================== CLIENT PORTAL ====================
function ClientPortal({ user, onLogout }) {
    return (
        <div className="container" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Welcome, <span style={{ color: '#00d4ff' }}>{user.clientName}</span></h1>
                    <p style={{ color: '#94a3b8' }}>{user.project?.name || 'Your Project Dashboard'}</p>
                </div>
                <button className="btn btn-secondary" onClick={onLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><LogOut size={16} /> Sign Out</button>
            </div>
            <ClientDashboardContent user={user} />
        </div>
    );
}

// ==================== CLIENT DASHBOARD CONTENT ====================
function ClientDashboardContent({ user }) {
    const project = user.project || getDefaultProject();
    const totalInvoiced = project.invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalPaid = project.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);

    // Load R2 files for client view
    const [r2Files, setR2Files] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(true);

    useEffect(() => {
        const loadFiles = async () => {
            try {
                const result = await listFiles(user.username);
                setR2Files(result.files || []);
            } catch (err) {
                console.error('Failed to load files:', err);
            }
            setLoadingFiles(false);
        };
        loadFiles();
    }, [user.username]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Project Overview */}
            <div style={{ background: 'linear-gradient(135deg, #0d1219 0%, rgba(13, 18, 25, 0.7) 100%)', border: '1px solid rgba(0, 212, 255, 0.15)', borderRadius: '16px', padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Building size={20} color="#00d4ff" />{project.name}</h3>
                    <StatusBadge status={project.status} />
                </div>

                {/* Progress */}
                <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#94a3b8' }}>
                        <span>Overall Progress</span><span>{project.progress}%</span>
                    </div>
                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '5px', overflow: 'hidden' }}>
                        <motion.div animate={{ width: `${project.progress}%` }} style={{ height: '100%', background: 'linear-gradient(90deg, #00d4ff, #6366f1)', borderRadius: '5px' }} />
                    </div>
                </div>

                {/* Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
                    <InfoCard icon={<Calendar size={16} />} label="Start Date" value={project.startDate || 'TBD'} />
                    <InfoCard icon={<Calendar size={16} />} label="Est. Completion" value={project.estimatedCompletion || 'TBD'} />
                    <InfoCard icon={<DollarSign size={16} />} label="Total Invoiced" value={`$${totalInvoiced.toLocaleString()}`} />
                    <InfoCard icon={<CheckCircle size={16} />} label="Amount Paid" value={`$${totalPaid.toLocaleString()}`} color="#10b981" />
                </div>
            </div>

            {/* Phases Timeline */}
            <div style={{ background: 'rgba(10, 14, 20, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Clock size={20} color="#00d4ff" /> Project Phases</h3>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {project.phases.map((phase, i) => (
                        <div key={i} style={{ flex: '1', minWidth: '140px', padding: '16px', background: phase.status === 'active' ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', border: phase.status === 'active' ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent', textAlign: 'center' }}>
                            <div style={{ marginBottom: '8px' }}>
                                {phase.status === 'completed' ? <CheckCircle size={24} color="#10b981" /> : phase.status === 'active' ? <Clock size={24} color="#00d4ff" /> : <AlertCircle size={24} color="#64748b" />}
                            </div>
                            <div style={{ fontWeight: '600', fontSize: '14px', color: phase.status === 'pending' ? '#64748b' : '#fff' }}>{phase.name}</div>
                            <div style={{ fontSize: '12px', color: phase.status === 'active' ? '#00d4ff' : '#64748b', marginTop: '4px' }}>{phase.date}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Documents - now showing R2 files */}
                <div style={{ background: 'rgba(10, 14, 20, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><FileText size={20} color="#00d4ff" /> Documents ({r2Files.length})</h3>
                    {loadingFiles ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}><Loader size={20} /> Loading...</div>
                    ) : r2Files.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No documents uploaded yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {r2Files.map((file, i) => (
                                <div key={file.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <FileText size={16} color="#64748b" />
                                        <div>
                                            <p style={{ fontSize: '14px' }}>{file.filename}</p>
                                            <p style={{ fontSize: '12px', color: '#64748b' }}>{formatFileSize(file.size)}</p>
                                        </div>
                                    </div>
                                    <a href={`/api/files/download/${encodeURIComponent(file.key)}`} download
                                        style={{ background: 'rgba(0,212,255,0.1)', border: 'none', padding: '6px 10px', borderRadius: '6px', color: '#00d4ff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                        <Download size={14} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Updates */}
                <div style={{ background: 'rgba(10, 14, 20, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><MessageSquare size={20} color="#00d4ff" /> Recent Updates</h3>
                    {project.updates.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No updates yet</p>
                    ) : (
                        <div style={{ borderLeft: '2px solid rgba(0,212,255,0.2)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {project.updates.slice(0, 5).map((update, i) => (
                                <div key={i}><p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{update.date}</p><p style={{ fontSize: '14px' }}>{update.message}</p></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Invoices & Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {/* Invoices */}
                <div style={{ background: 'rgba(10, 14, 20, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><DollarSign size={20} color="#10b981" /> Invoices</h3>
                    {project.invoices.length === 0 ? (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No invoices yet</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {project.invoices.map((inv, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div><p style={{ fontWeight: '500' }}>{inv.id}</p><p style={{ fontSize: '12px', color: '#64748b' }}>{inv.date}</p></div>
                                    <div style={{ textAlign: 'right' }}><p style={{ fontWeight: '600' }}>${inv.amount.toLocaleString()}</p><span style={{ fontSize: '11px', padding: '2px 8px', background: inv.status === 'paid' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: inv.status === 'paid' ? '#10b981' : '#f59e0b', borderRadius: '4px' }}>{inv.status}</span></div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Contact */}
                <div style={{ background: 'rgba(10, 14, 20, 0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}><User size={20} color="#00d4ff" /> Your Project Manager</h3>
                    {project.contactPerson ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><User size={18} color="#64748b" /><span style={{ fontSize: '16px', fontWeight: '500' }}>{project.contactPerson}</span></div>
                            {project.contactEmail && <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Mail size={18} color="#64748b" /><a href={`mailto:${project.contactEmail}`} style={{ color: '#00d4ff' }}>{project.contactEmail}</a></div>}
                            {project.contactPhone && <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Phone size={18} color="#64748b" /><span>{project.contactPhone}</span></div>}
                        </div>
                    ) : (
                        <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Contact info coming soon</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// ==================== HELPER COMPONENTS ====================
function InputField({ label, value, onChange, type = 'text' }) {
    return (
        <div>
            <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)}
                style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
        </div>
    );
}

function StatusBadge({ status }) {
    const styles = {
        planning: { bg: 'rgba(100,116,139,0.2)', color: '#94a3b8', text: 'Planning' },
        in_progress: { bg: 'rgba(0,212,255,0.2)', color: '#00d4ff', text: 'In Progress' },
        review: { bg: 'rgba(245,158,11,0.2)', color: '#f59e0b', text: 'Under Review' },
        completed: { bg: 'rgba(16,185,129,0.2)', color: '#10b981', text: 'Completed' }
    };
    const s = styles[status] || styles.planning;
    return <span style={{ background: s.bg, color: s.color, padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>{s.text}</span>;
}

function InfoCard({ icon, label, value, color = '#00d4ff' }) {
    return (
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', marginBottom: '8px' }}>{icon}<span style={{ fontSize: '12px' }}>{label}</span></div>
            <div style={{ fontSize: '18px', fontWeight: '600', color }}>{value}</div>
        </div>
    );
}
