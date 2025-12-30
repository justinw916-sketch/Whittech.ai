import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, CheckCircle2, ChevronLeft, ChevronRight,
    Plus, X, Edit3, Phone, Mail, Building2, User
} from 'lucide-react';

// Mock Data
const TRADES = [
    { id: 'concrete', name: 'Concrete', color: '#71717a' },
    { id: 'framing', name: 'Framing', color: '#f59e0b' },
    { id: 'plumbing', name: 'Plumbing', color: '#3b82f6' },
    { id: 'electrical', name: 'Electrical', color: '#eab308' },
    { id: 'hvac', name: 'HVAC', color: '#ef4444' },
    { id: 'low_voltage', name: 'Low Voltage', color: '#8b5cf6' },
    { id: 'fire_alarm', name: 'Fire Alarm', color: '#ea580c' },
    { id: 'drywall', name: 'Drywall', color: '#ec4899' },
    { id: 'paint', name: 'Painting', color: '#10b981' },
    { id: 'finish', name: 'Finishing', color: '#14b8a6' },
];

const INITIAL_TASKS = [
    { id: 1, name: 'Site Preparation', trade: 'concrete', startDay: 1, duration: 5, progress: 100, isCritical: true, company: 'ABC Concrete LLC', contact: { name: 'Mike Johnson', email: 'mike@abcconcrete.com', phone: '555-123-4567' } },
    { id: 2, name: 'Foundation Pour', trade: 'concrete', startDay: 4, duration: 6, progress: 100, isCritical: true, company: 'ABC Concrete LLC', contact: { name: 'Mike Johnson', email: 'mike@abcconcrete.com', phone: '555-123-4567' } },
    { id: 3, name: 'Structural Framing', trade: 'framing', startDay: 8, duration: 10, progress: 45, isCritical: true, company: 'Premium Framing Co.', contact: { name: 'Sarah Davis', email: 'sarah@premiumframing.com', phone: '555-234-5678' } },
    { id: 4, name: 'Rough Plumbing', trade: 'plumbing', startDay: 13, duration: 5, progress: 15, isCritical: false, company: 'City Plumbing', contact: { name: 'Tom Wilson', email: 'tom@cityplumbing.com', phone: '555-345-6789' } },
    { id: 6, name: 'HVAC Ducting', trade: 'hvac', startDay: 14, duration: 6, progress: 10, isCritical: false, company: 'CoolAir HVAC', contact: { name: 'James Lee', email: 'james@coolairhvac.com', phone: '555-456-7890' } },
    { id: 5, name: 'Rough Electrical', trade: 'electrical', startDay: 16, duration: 5, progress: 0, isCritical: false, company: 'Spark Electric', contact: { name: 'Lisa Chen', email: 'lisa@sparkelectric.com', phone: '555-567-8901' } },
    { id: 101, name: 'LV Cabling Rough', trade: 'low_voltage', startDay: 19, duration: 3, progress: 0, isCritical: false, company: 'TechWire Solutions', contact: { name: 'David Kim', email: 'david@techwire.com', phone: '555-678-9012' } },
    { id: 102, name: 'Fire Alarm Rough', trade: 'fire_alarm', startDay: 20, duration: 3, progress: 0, isCritical: false, company: 'SafeGuard Alarms', contact: { name: 'Amy Brown', email: 'amy@safeguard.com', phone: '555-789-0123' } },
    { id: 7, name: 'Insulation & Drywall', trade: 'drywall', startDay: 24, duration: 8, progress: 0, isCritical: true, company: 'WallPro Inc.', contact: { name: 'Chris Martinez', email: 'chris@wallpro.com', phone: '555-890-1234' } },
    { id: 110, name: 'Painting', trade: 'paint', startDay: 31, duration: 5, progress: 0, isCritical: true, company: 'ColorMaster Painting', contact: { name: 'Emma White', email: 'emma@colormaster.com', phone: '555-901-2345' } },
    { id: 201, name: 'LV Trim (Cameras)', trade: 'low_voltage', startDay: 35, duration: 2, progress: 0, isCritical: false, company: 'TechWire Solutions', contact: { name: 'David Kim', email: 'david@techwire.com', phone: '555-678-9012' } },
    { id: 202, name: 'Fire Alarm Trim', trade: 'fire_alarm', startDay: 36, duration: 2, progress: 0, isCritical: true, company: 'SafeGuard Alarms', contact: { name: 'Amy Brown', email: 'amy@safeguard.com', phone: '555-789-0123' } },
    { id: 203, name: 'Fire Alarm Test', trade: 'fire_alarm', startDay: 38, duration: 1, progress: 0, isCritical: true, company: 'SafeGuard Alarms', contact: { name: 'Amy Brown', email: 'amy@safeguard.com', phone: '555-789-0123' } },
];

const DAYS_TO_SHOW = 45;
const DAY_WIDTH = 40;

export default function ConstructionSchedule({ onStatusChange }) {
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [viewOffset, setViewOffset] = useState(0);
    const [showAddModal, setShowAddModal] = useState(false);
    const [detailTask, setDetailTask] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});

    // New task form state
    const [newTask, setNewTask] = useState({ name: '', trade: 'concrete', startDay: 1, duration: 3 });

    const days = Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + viewOffset);
        return {
            date: d.getDate(),
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            isWeekend: d.getDay() === 0 || d.getDay() === 6
        };
    });

    const handleScroll = (direction) => {
        setViewOffset(prev => Math.max(0, prev + (direction === 'left' ? -7 : 7)));
    };

    const handleDragEnd = (taskId, info) => {
        const deltaDays = Math.round(info.offset.x / DAY_WIDTH);
        if (deltaDays === 0) return;
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, startDay: t.startDay + deltaDays } : t));
    };

    const getGridPos = (start, duration) => ({
        left: (start - 1 - viewOffset) * DAY_WIDTH,
        width: duration * DAY_WIDTH
    });

    const getTradeColor = (tradeId) => TRADES.find(t => t.id === tradeId)?.color || '#94a3b8';

    const handleAddTask = () => {
        const id = Date.now();
        setTasks(prev => [...prev, {
            ...newTask,
            id,
            progress: 0,
            isCritical: false,
            company: 'Unassigned',
            contact: { name: '', email: '', phone: '' }
        }]);
        setNewTask({ name: '', trade: 'concrete', startDay: 1, duration: 3 });
        setShowAddModal(false);
    };

    const handleOpenDetail = (task) => {
        setDetailTask(task);
        setEditData({ ...task, contact: { ...task.contact } });
        setEditMode(false);
    };

    const handleSaveEdit = () => {
        setTasks(prev => prev.map(t => t.id === editData.id ? editData : t));
        setDetailTask(editData);
        setEditMode(false);
    };

    return (
        <div style={{ padding: '0px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={20} color="#00d4ff" />
                        Project Schedule <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', color: '#94a3b8' }}>Phase 1</span>
                    </h2>
                    <p style={{ margin: '4px 0 0 30px', fontSize: '13px', color: '#94a3b8' }}>Site Alpha • Click task for details</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleScroll('left')} className="icon-btn"><ChevronLeft size={18} /></button>
                    <button onClick={() => setViewOffset(0)} className="text-btn">Today</button>
                    <button onClick={() => handleScroll('right')} className="icon-btn"><ChevronRight size={18} /></button>
                </div>
            </div>

            {/* Gantt Area */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                {/* Task List */}
                <div style={{ width: '250px', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ padding: '12px', fontSize: '11px', fontWeight: '600', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>TASK NAME</div>
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => handleOpenDetail(task)}
                            style={{
                                padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px',
                                height: '48px', display: 'flex', alignItems: 'center', gap: '8px',
                                background: detailTask?.id === task.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                cursor: 'pointer', borderLeft: task.isCritical ? '3px solid #ef4444' : '3px solid transparent'
                            }}
                        >
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getTradeColor(task.trade) }}></div>
                            {task.name}
                        </div>
                    ))}
                    <div onClick={() => setShowAddModal(true)} style={{ padding: '12px', color: '#00d4ff', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={14} /> Add Task
                    </div>
                </div>

                {/* Timeline */}
                <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', position: 'relative' }}>
                    <div style={{ display: 'flex', height: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, background: '#030508', zIndex: 10 }}>
                        {days.map((day, i) => (
                            <div key={i} style={{ minWidth: '40px', width: '40px', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontSize: '11px', background: day.isWeekend ? 'rgba(255,255,255,0.02)' : 'transparent', color: day.isWeekend ? '#64748b' : '#94a3b8' }}>
                                <span style={{ fontWeight: '600' }}>{day.date}</span>
                                <span style={{ fontSize: '9px' }}>{day.day}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', pointerEvents: 'none' }}>
                            {days.map((day, i) => (<div key={i} style={{ minWidth: '40px', width: '40px', borderRight: '1px solid rgba(255,255,255,0.03)', background: day.isWeekend ? 'rgba(255,255,255,0.01)' : 'transparent' }}></div>))}
                        </div>

                        {tasks.map(task => {
                            const { left, width } = getGridPos(task.startDay, task.duration);
                            const trade = TRADES.find(t => t.id === task.trade);
                            return (
                                <div key={task.id} style={{ height: '48px', borderBottom: '1px solid rgba(255,255,255,0.03)', position: 'relative', width: `${days.length * 40}px` }}>
                                    <motion.div
                                        key={`${task.id}-${task.startDay}`}
                                        drag="x" dragMomentum={false} dragElastic={0.1}
                                        onDragEnd={(e, info) => handleDragEnd(task.id, info)}
                                        onClick={() => handleOpenDetail(task)}
                                        whileDrag={{ scale: 1.05, cursor: 'grabbing', zIndex: 50, boxShadow: '0 5px 15px rgba(0,0,0,0.5)' }}
                                        style={{
                                            position: 'absolute', left: `${left}px`, width: `${width}px`, top: '10px', height: '28px',
                                            background: trade ? `${trade.color}33` : '#475569',
                                            border: task.isCritical ? '2px solid #ef4444' : `1px solid ${trade?.color || '#94a3b8'}`,
                                            borderRadius: '6px', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', paddingLeft: '8px',
                                            fontSize: '11px', fontWeight: '500', color: '#fff', overflow: 'hidden', whiteSpace: 'nowrap'
                                        }}
                                        whileHover={{ scale: 1.02, zIndex: 10 }}
                                    >
                                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${task.progress}%`, background: trade?.color, opacity: 0.3 }}></div>
                                        <span style={{ zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.5)', pointerEvents: 'none' }}>
                                            {task.progress === 100 && <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />}
                                            {task.name}
                                        </span>
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.1)', background: '#030508', display: 'flex', gap: '16px', alignItems: 'center', overflowX: 'auto' }}>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TRADES:</span>
                {TRADES.map(trade => (
                    <div key={trade.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: trade.color }}></div>
                        {trade.name}
                    </div>
                ))}
                <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ef4444' }}>
                    <div style={{ width: '12px', height: '3px', background: '#ef4444', borderRadius: '2px' }}></div>
                    Critical Path
                </div>
            </div>

            {/* Add Task Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', width: '400px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>Add New Task</h3>
                                <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <input placeholder="Task Name" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                <select value={newTask.trade} onChange={e => setNewTask({ ...newTask, trade: e.target.value })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }}>
                                    {TRADES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <input type="number" placeholder="Start Day" value={newTask.startDay} onChange={e => setNewTask({ ...newTask, startDay: parseInt(e.target.value) || 1 })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                    <input type="number" placeholder="Duration" value={newTask.duration} onChange={e => setNewTask({ ...newTask, duration: parseInt(e.target.value) || 1 })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                </div>
                                <button onClick={handleAddTask} style={{ padding: '12px', background: 'linear-gradient(135deg, #00d4ff, #6366f1)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Add Task</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Task Detail Modal */}
            <AnimatePresence>
                {detailTask && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetailTask(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', width: '450px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: getTradeColor(editMode ? editData.trade : detailTask.trade) }}></div>
                                    {editMode ? 'Edit Task' : 'Task Details'}
                                </h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {!editMode && <button onClick={() => setEditMode(true)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}><Edit3 size={14} /> Edit</button>}
                                    <button onClick={() => { setDetailTask(null); setEditMode(false); }} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={18} /></button>
                                </div>
                            </div>

                            {editMode ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <input value={editData.name} onChange={e => setEditData({ ...editData, name: e.target.value })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                    <select value={editData.trade} onChange={e => setEditData({ ...editData, trade: e.target.value })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }}>
                                        {TRADES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                        <input type="number" value={editData.startDay} onChange={e => setEditData({ ...editData, startDay: parseInt(e.target.value) || 1 })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                        <input type="number" value={editData.duration} onChange={e => setEditData({ ...editData, duration: parseInt(e.target.value) || 1 })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                    </div>
                                    <input placeholder="Company" value={editData.company} onChange={e => setEditData({ ...editData, company: e.target.value })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                    <input placeholder="Contact Name" value={editData.contact.name} onChange={e => setEditData({ ...editData, contact: { ...editData.contact, name: e.target.value } })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                    <input placeholder="Email" value={editData.contact.email} onChange={e => setEditData({ ...editData, contact: { ...editData.contact, email: e.target.value } })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                    <input placeholder="Phone" value={editData.contact.phone} onChange={e => setEditData({ ...editData, contact: { ...editData.contact, phone: e.target.value } })} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#fff', fontSize: '14px' }} />
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <button onClick={() => setEditMode(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>Cancel</button>
                                        <button onClick={handleSaveEdit} style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg, #00d4ff, #6366f1)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: '600', cursor: 'pointer' }}>Save Changes</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div>
                                        <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px' }}>{detailTask.name}</div>
                                        <div style={{ fontSize: '13px', color: '#94a3b8' }}>{TRADES.find(t => t.id === detailTask.trade)?.name} • Day {detailTask.startDay} - {detailTask.startDay + detailTask.duration - 1} ({detailTask.duration} days)</div>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '8px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px' }}><Building2 size={16} color="#00d4ff" /> {detailTask.company}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#94a3b8' }}><User size={14} /> {detailTask.contact.name || 'No contact assigned'}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '13px', color: '#94a3b8' }}><Mail size={14} /> {detailTask.contact.email || '-'}</div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8' }}><Phone size={14} /> {detailTask.contact.phone || '-'}</div>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '13px', color: '#94a3b8' }}>Progress</span>
                                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{detailTask.progress}%</span>
                                    </div>
                                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${detailTask.progress}%`, background: getTradeColor(detailTask.trade), borderRadius: '3px' }}></div>
                                    </div>
                                    {detailTask.isCritical && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '8px 12px', borderRadius: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }}></div> Critical Path Task</div>}
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .icon-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; cursor: pointer; transition: all 0.2s; }
                .icon-btn:hover { background: rgba(255,255,255,0.1); }
                .text-btn { padding: 0 12px; height: 32px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; cursor: pointer; font-size: 13px; }
                .text-btn:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
}
