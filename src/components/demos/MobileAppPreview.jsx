import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardList, CheckSquare, Shield, Truck, Clock,
    ArrowLeft, Camera, Sun, Cloud, CloudRain, Snowflake,
    Plus, Trash2, Check, X, User, AlertTriangle, Package
} from 'lucide-react';

// Tool definitions
const TOOLS = [
    { id: 'field-report', name: 'Daily Field Report', icon: ClipboardList, color: '#10b981', desc: 'Log daily site activities' },
    { id: 'punch-list', name: 'Punch List', icon: CheckSquare, color: '#6366f1', desc: 'Track deficiencies' },
    { id: 'safety', name: 'Safety Inspection', icon: Shield, color: '#ef4444', desc: 'OSHA compliance checks' },
    { id: 'materials', name: 'Material Tracker', icon: Truck, color: '#f59e0b', desc: 'Delivery management' },
    { id: 'timecard', name: 'Time Card', icon: Clock, color: '#00d4ff', desc: 'Crew clock-in/out' },
];

// Phone Frame Component
function PhoneFrame({ children, onBack, title }) {
    return (
        <div style={{
            width: '100%', maxWidth: '380px', height: '700px', margin: '0 auto',
            background: '#0a0e14', borderRadius: '40px', padding: '12px',
            border: '3px solid #1e293b', boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden'
        }}>
            {/* Notch */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '8px' }}>
                <div style={{ width: '120px', height: '28px', background: '#000', borderRadius: '20px' }}></div>
            </div>
            {/* Header */}
            {title && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#00d4ff', cursor: 'pointer', display: 'flex' }}>
                        <ArrowLeft size={20} />
                    </button>
                    <span style={{ fontWeight: '600', fontSize: '16px' }}>{title}</span>
                </div>
            )}
            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: title ? '0' : '16px' }}>
                {children}
            </div>
            {/* Home Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                <div style={{ width: '100px', height: '4px', background: '#475569', borderRadius: '2px' }}></div>
            </div>
        </div>
    );
}

// ==================== DAILY FIELD REPORT ====================
function DailyFieldReport({ onBack }) {
    const [report, setReport] = useState({
        date: new Date().toISOString().split('T')[0],
        weather: 'sunny',
        temp: 72,
        crewCount: 8,
        workPerformed: '',
        notes: '',
        photos: []
    });
    const [submitted, setSubmitted] = useState(false);

    const weatherIcons = { sunny: Sun, cloudy: Cloud, rain: CloudRain, snow: Snowflake };
    const WeatherIcon = weatherIcons[report.weather];

    const addPhoto = () => {
        setReport(r => ({ ...r, photos: [...r.photos, { id: Date.now(), name: `photo_${r.photos.length + 1}.jpg` }] }));
    };

    const submit = () => {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 2000);
    };

    return (
        <PhoneFrame onBack={onBack} title="Daily Field Report">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Date */}
                <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Date</label>
                    <input type="date" value={report.date} onChange={e => setReport({ ...report, date: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>

                {/* Weather & Temp */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                        <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Weather</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {Object.entries(weatherIcons).map(([key, Icon]) => (
                                <button key={key} onClick={() => setReport({ ...report, weather: key })}
                                    style={{ flex: 1, padding: '8px', background: report.weather === key ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)', border: report.weather === key ? '1px solid #00d4ff' : '1px solid transparent', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                                    <Icon size={16} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Temp (°F)</label>
                        <input type="number" value={report.temp} onChange={e => setReport({ ...report, temp: e.target.value })}
                            style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                    </div>
                </div>

                {/* Crew Count */}
                <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Crew on Site</label>
                    <input type="number" value={report.crewCount} onChange={e => setReport({ ...report, crewCount: e.target.value })}
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>

                {/* Work Performed */}
                <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Work Performed</label>
                    <textarea rows={3} value={report.workPerformed} onChange={e => setReport({ ...report, workPerformed: e.target.value })} placeholder="Describe today's activities..."
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', resize: 'none' }} />
                </div>

                {/* Photos */}
                <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Photos</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {report.photos.map(p => (
                            <div key={p.id} style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Camera size={20} color="#64748b" />
                            </div>
                        ))}
                        <button onClick={addPhoto} style={{ width: '60px', height: '60px', background: 'rgba(0,212,255,0.1)', border: '1px dashed #00d4ff', borderRadius: '8px', color: '#00d4ff', cursor: 'pointer' }}>
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Notes */}
                <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Additional Notes</label>
                    <textarea rows={2} value={report.notes} onChange={e => setReport({ ...report, notes: e.target.value })} placeholder="Any issues or observations..."
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', resize: 'none' }} />
                </div>

                {/* Submit */}
                <motion.button onClick={submit} whileTap={{ scale: 0.95 }}
                    style={{ padding: '14px', background: submitted ? '#10b981' : 'linear-gradient(135deg, #00d4ff, #6366f1)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                    {submitted ? '✓ Report Submitted!' : 'Submit Report'}
                </motion.button>
            </div>
        </PhoneFrame>
    );
}

// ==================== PUNCH LIST MANAGER ====================
function PunchListManager({ onBack }) {
    const [items, setItems] = useState([
        { id: 1, desc: 'Touch up paint in hallway', location: 'Floor 2', trade: 'Painter', priority: 'Low', completed: false },
        { id: 2, desc: 'Fix loose outlet cover', location: 'Room 201', trade: 'Electrical', priority: 'Medium', completed: false },
        { id: 3, desc: 'Caulk gap at window frame', location: 'Lobby', trade: 'Finishing', priority: 'High', completed: true },
    ]);
    const [showAdd, setShowAdd] = useState(false);
    const [newItem, setNewItem] = useState({ desc: '', location: '', trade: 'General', priority: 'Medium' });
    const [filter, setFilter] = useState('all');

    const toggleComplete = (id) => setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
    const deleteItem = (id) => setItems(items.filter(i => i.id !== id));
    const addItem = () => {
        if (!newItem.desc) return;
        setItems([...items, { ...newItem, id: Date.now(), completed: false }]);
        setNewItem({ desc: '', location: '', trade: 'General', priority: 'Medium' });
        setShowAdd(false);
    };

    const filtered = items.filter(i => filter === 'all' || (filter === 'open' && !i.completed) || (filter === 'done' && i.completed));
    const progress = items.length > 0 ? Math.round((items.filter(i => i.completed).length / items.length) * 100) : 0;

    return (
        <PhoneFrame onBack={onBack} title="Punch List">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                {/* Progress */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
                        <span>Completion</span><span>{progress}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: '#10b981', borderRadius: '4px' }} />
                    </div>
                </div>

                {/* Filters */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {['all', 'open', 'done'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            style={{ flex: 1, padding: '8px', background: filter === f ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.05)', border: filter === f ? '1px solid #00d4ff' : '1px solid transparent', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontSize: '12px', textTransform: 'capitalize' }}>
                            {f}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {filtered.map(item => (
                        <motion.div key={item.id} layout style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '10px', border: `1px solid ${item.completed ? '#10b981' : 'rgba(255,255,255,0.1)'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '500', fontSize: '14px', textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.6 : 1 }}>{item.desc}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{item.location} • {item.trade}</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button onClick={() => toggleComplete(item.id)} style={{ background: item.completed ? '#10b981' : 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', width: '28px', height: '28px', color: '#fff', cursor: 'pointer' }}>
                                        <Check size={14} />
                                    </button>
                                    <button onClick={() => deleteItem(item.id)} style={{ background: 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '6px', width: '28px', height: '28px', color: '#ef4444', cursor: 'pointer' }}>
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Add Button */}
                {!showAdd ? (
                    <button onClick={() => setShowAdd(true)} style={{ padding: '14px', background: 'linear-gradient(135deg, #6366f1, #00d4ff)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Plus size={18} /> Add Item
                    </button>
                ) : (
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input placeholder="Description" value={newItem.desc} onChange={e => setNewItem({ ...newItem, desc: e.target.value })} style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                        <input placeholder="Location" value={newItem.location} onChange={e => setNewItem({ ...newItem, location: e.target.value })} style={{ padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={addItem} style={{ flex: 1, padding: '10px', background: '#10b981', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Add</button>
                            <button onClick={() => setShowAdd(false)} style={{ flex: 1, padding: '10px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </PhoneFrame>
    );
}

// ==================== SAFETY INSPECTION ====================
function SafetyInspection({ onBack }) {
    const categories = [
        { name: 'PPE Compliance', items: ['Hard hats worn', 'Safety vests visible', 'Eye protection used', 'Gloves when required'] },
        { name: 'Scaffolding', items: ['Guardrails in place', 'Planks secured', 'Base on solid ground', 'Access ladder available'] },
        { name: 'Electrical', items: ['GFCIs in use', 'Cords undamaged', 'Panels accessible', 'Lockout/tagout followed'] },
        { name: 'Housekeeping', items: ['Walkways clear', 'Materials stacked safely', 'Waste disposed properly', 'Fire extinguishers accessible'] },
    ];

    const [checks, setChecks] = useState(() => {
        const init = {};
        categories.forEach(cat => cat.items.forEach(item => { init[item] = null; }));
        return init;
    });
    const [inspector, setInspector] = useState('');
    const [generated, setGenerated] = useState(false);

    const setCheck = (item, val) => setChecks({ ...checks, [item]: val });
    const total = Object.keys(checks).length;
    const passed = Object.values(checks).filter(v => v === 'pass').length;
    const failed = Object.values(checks).filter(v => v === 'fail').length;
    const score = total > 0 ? Math.round((passed / total) * 100) : 0;

    return (
        <PhoneFrame onBack={onBack} title="Safety Inspection">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Inspector */}
                <div>
                    <label style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px', display: 'block' }}>Inspector Name</label>
                    <input value={inspector} onChange={e => setInspector(e.target.value)} placeholder="Enter your name"
                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }} />
                </div>

                {/* Score */}
                <div style={{ background: score >= 80 ? 'rgba(16,185,129,0.1)' : score >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', fontWeight: 'bold', color: score >= 80 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444' }}>{score}%</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>Safety Score • {passed} Pass / {failed} Fail</div>
                </div>

                {/* Categories */}
                {categories.map(cat => (
                    <div key={cat.name}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '8px' }}>{cat.name}</div>
                        {cat.items.map(item => (
                            <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <span style={{ fontSize: '13px', color: checks[item] === 'fail' ? '#ef4444' : checks[item] === 'pass' ? '#10b981' : '#94a3b8' }}>{item}</span>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    {['pass', 'fail', 'na'].map(val => (
                                        <button key={val} onClick={() => setCheck(item, val)}
                                            style={{ padding: '4px 10px', fontSize: '10px', background: checks[item] === val ? (val === 'pass' ? '#10b981' : val === 'fail' ? '#ef4444' : '#64748b') : 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', textTransform: 'uppercase' }}>
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}

                {/* Generate */}
                <motion.button onClick={() => setGenerated(true)} whileTap={{ scale: 0.95 }}
                    style={{ padding: '14px', background: generated ? '#10b981' : 'linear-gradient(135deg, #ef4444, #f59e0b)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                    {generated ? '✓ Report Generated' : 'Generate Summary'}
                </motion.button>
            </div>
        </PhoneFrame>
    );
}

// ==================== MATERIAL DELIVERY TRACKER ====================
function MaterialTracker({ onBack }) {
    const [deliveries, setDeliveries] = useState([
        { id: 1, material: 'Concrete Mix', supplier: 'BuildCo Supply', qty: 50, unit: 'bags', status: 'delivered', eta: null, damaged: false },
        { id: 2, material: 'Steel Rebar #4', supplier: 'Metro Steel', qty: 200, unit: 'pcs', status: 'in-transit', eta: '2:30 PM', damaged: false },
        { id: 3, material: 'Lumber 2x4x8', supplier: 'Forest Products', qty: 100, unit: 'pcs', status: 'pending', eta: 'Tomorrow', damaged: false },
        { id: 4, material: 'Electrical Wire 12/2', supplier: 'ElectroPro', qty: 500, unit: 'ft', status: 'delayed', eta: 'TBD', damaged: false },
    ]);

    const statusColors = { pending: '#64748b', 'in-transit': '#f59e0b', delivered: '#10b981', delayed: '#ef4444' };

    const checkIn = (id) => setDeliveries(deliveries.map(d => d.id === id ? { ...d, status: 'delivered', eta: null } : d));
    const markDamaged = (id) => setDeliveries(deliveries.map(d => d.id === id ? { ...d, damaged: !d.damaged } : d));

    return (
        <PhoneFrame onBack={onBack} title="Material Tracker">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {['pending', 'in-transit', 'delivered', 'delayed'].map(s => (
                        <div key={s} style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: statusColors[s] }}>{deliveries.filter(d => d.status === s).length}</div>
                            <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'capitalize' }}>{s.replace('-', ' ')}</div>
                        </div>
                    ))}
                </div>

                {/* Deliveries */}
                {deliveries.map(d => (
                    <div key={d.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', borderLeft: `3px solid ${statusColors[d.status]}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <div style={{ fontWeight: '600', fontSize: '14px' }}>{d.material}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{d.supplier}</div>
                                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{d.qty} {d.unit}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '10px', padding: '2px 8px', background: `${statusColors[d.status]}22`, color: statusColors[d.status], borderRadius: '4px', textTransform: 'capitalize' }}>{d.status.replace('-', ' ')}</div>
                                {d.eta && <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>ETA: {d.eta}</div>}
                            </div>
                        </div>
                        {d.status !== 'delivered' && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button onClick={() => checkIn(d.id)} style={{ flex: 1, padding: '8px', background: '#10b981', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Check In</button>
                                <button onClick={() => markDamaged(d.id)} style={{ padding: '8px 12px', background: d.damaged ? '#ef4444' : 'rgba(239,68,68,0.2)', border: 'none', borderRadius: '6px', color: d.damaged ? '#fff' : '#ef4444', cursor: 'pointer', fontSize: '12px' }}>
                                    <AlertTriangle size={14} />
                                </button>
                            </div>
                        )}
                        {d.damaged && <div style={{ fontSize: '11px', color: '#ef4444', marginTop: '8px' }}>⚠️ Damage reported</div>}
                    </div>
                ))}
            </div>
        </PhoneFrame>
    );
}

// ==================== TIME CARD APP ====================
function TimeCardApp({ onBack }) {
    const [workers, setWorkers] = useState([
        { id: 1, name: 'John Martinez', role: 'Foreman', clockedIn: true, clockInTime: '07:00', breaks: 30, totalHours: 0 },
        { id: 2, name: 'Sarah Johnson', role: 'Electrician', clockedIn: true, clockInTime: '07:15', breaks: 0, totalHours: 0 },
        { id: 3, name: 'Mike Chen', role: 'Plumber', clockedIn: false, clockInTime: null, breaks: 0, totalHours: 6.5 },
        { id: 4, name: 'Lisa Williams', role: 'Carpenter', clockedIn: true, clockInTime: '06:45', breaks: 45, totalHours: 0 },
    ]);

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const calculateHours = (clockIn, breaks) => {
        if (!clockIn) return 0;
        const [h, m] = clockIn.split(':').map(Number);
        const start = h * 60 + m;
        const current = now.getHours() * 60 + now.getMinutes();
        return Math.max(0, ((current - start) - breaks) / 60);
    };

    const toggleClock = (id) => {
        setWorkers(workers.map(w => {
            if (w.id === id) {
                if (w.clockedIn) {
                    return { ...w, clockedIn: false, totalHours: calculateHours(w.clockInTime, w.breaks), clockInTime: null };
                } else {
                    return { ...w, clockedIn: true, clockInTime: currentTime, breaks: 0 };
                }
            }
            return w;
        }));
    };

    const addBreak = (id) => {
        setWorkers(workers.map(w => w.id === id ? { ...w, breaks: w.breaks + 15 } : w));
    };

    return (
        <PhoneFrame onBack={onBack} title="Time Card">
            <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ background: 'rgba(16,185,129,0.1)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>{workers.filter(w => w.clockedIn).length}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>On Site</div>
                    </div>
                    <div style={{ background: 'rgba(99,102,241,0.1)', padding: '14px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6366f1' }}>
                            {workers.reduce((sum, w) => sum + (w.clockedIn ? calculateHours(w.clockInTime, w.breaks) : w.totalHours), 0).toFixed(1)}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Total Hours</div>
                    </div>
                </div>

                {/* Workers */}
                {workers.map(w => {
                    const hours = w.clockedIn ? calculateHours(w.clockInTime, w.breaks) : w.totalHours;
                    const isOvertime = hours > 8;

                    return (
                        <div key={w.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '12px', borderLeft: `3px solid ${w.clockedIn ? '#10b981' : '#64748b'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <User size={14} color="#64748b" /> {w.name}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{w.role}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: isOvertime ? '#f59e0b' : '#fff' }}>
                                        {hours.toFixed(1)}h {isOvertime && <span style={{ fontSize: '10px' }}>OT</span>}
                                    </div>
                                    {w.clockedIn && <div style={{ fontSize: '10px', color: '#64748b' }}>In: {w.clockInTime}</div>}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                                <button onClick={() => toggleClock(w.id)}
                                    style={{ flex: 1, padding: '8px', background: w.clockedIn ? '#ef4444' : '#10b981', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>
                                    {w.clockedIn ? 'Clock Out' : 'Clock In'}
                                </button>
                                {w.clockedIn && (
                                    <button onClick={() => addBreak(w.id)}
                                        style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontSize: '11px' }}>
                                        +15m Break ({w.breaks}m)
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Export */}
                <button style={{ padding: '14px', background: 'linear-gradient(135deg, #00d4ff, #6366f1)', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>
                    Export Timesheet
                </button>
            </div>
        </PhoneFrame>
    );
}

// ==================== MAIN COMPONENT ====================
export default function MobileAppPreview({ onStatusChange }) {
    const [activeTool, setActiveTool] = useState(null);

    const renderTool = () => {
        switch (activeTool) {
            case 'field-report': return <DailyFieldReport onBack={() => setActiveTool(null)} />;
            case 'punch-list': return <PunchListManager onBack={() => setActiveTool(null)} />;
            case 'safety': return <SafetyInspection onBack={() => setActiveTool(null)} />;
            case 'materials': return <MaterialTracker onBack={() => setActiveTool(null)} />;
            case 'timecard': return <TimeCardApp onBack={() => setActiveTool(null)} />;
            default: return null;
        }
    };

    if (activeTool) {
        return (
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={activeTool} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                        {renderTool()}
                    </motion.div>
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div style={{ padding: '30px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '20px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Package size={22} color="#00d4ff" />
                    Construction Field Tools
                </h2>
                <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>Select a tool to launch the mobile preview</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {TOOLS.map(tool => (
                    <motion.button
                        key={tool.id}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveTool(tool.id)}
                        style={{
                            background: `linear-gradient(135deg, ${tool.color}11, ${tool.color}05)`,
                            border: `1px solid ${tool.color}33`,
                            padding: '20px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            color: '#fff',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ width: '48px', height: '48px', background: `${tool.color}22`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                            <tool.icon size={24} color={tool.color} />
                        </div>
                        <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '4px' }}>{tool.name}</div>
                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>{tool.desc}</div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
