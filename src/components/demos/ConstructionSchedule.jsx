import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Clock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight,
    Hammer, HardHat, Truck, Paintbrush, Zap, Plus, X, AlignLeft
} from 'lucide-react';

// Mock Data
const TRADES = [
    { id: 'concrete', name: 'Concrete', color: '#71717a' },
    { id: 'framing', name: 'Framing', color: '#f59e0b' },
    { id: 'plumbing', name: 'Plumbing', color: '#3b82f6' },
    { id: 'electrical', name: 'Electrical', color: '#eab308' },
    { id: 'hvac', name: 'HVAC', color: '#ef4444' },
    { id: 'drywall', name: 'Drywall', color: '#ec4899' },
    { id: 'paint', name: 'Painting', color: '#10b981' },
    { id: 'finish', name: 'Finishing', color: '#8b5cf6' },
];

const INITIAL_TASKS = [
    { id: 1, name: 'Site Preparation', trade: 'concrete', startDay: 1, duration: 3, progress: 100 },
    { id: 2, name: 'Foundation Pour', trade: 'concrete', startDay: 4, duration: 4, progress: 100 },
    { id: 3, name: 'Structural Framing', trade: 'framing', startDay: 9, duration: 7, progress: 65 },
    { id: 4, name: 'Rough Plumbing', trade: 'plumbing', startDay: 13, duration: 4, progress: 0 },
    { id: 5, name: 'Rough Electrical', trade: 'electrical', startDay: 15, duration: 5, progress: 0 },
    { id: 6, name: 'HVAC Ducting', trade: 'hvac', startDay: 16, duration: 4, progress: 0 },
    { id: 7, name: 'Insulation & Drywall', trade: 'drywall', startDay: 22, duration: 6, progress: 0 },
];

const DAYS_TO_SHOW = 30;

export default function ConstructionSchedule({ onStatusChange }) {
    const [tasks, setTasks] = useState(INITIAL_TASKS);
    const [viewOffset, setViewOffset] = useState(0);
    const [selectedTask, setSelectedTask] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());

    // Auto-scroll simulation (optional, maybe just user scroll)

    // Day generation
    const days = Array.from({ length: DAYS_TO_SHOW }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + viewOffset);
        return {
            date: d.getDate(),
            day: d.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDate: d,
            isWeekend: d.getDay() === 0 || d.getDay() === 6
        };
    });

    // Handle horizontal scroll
    const handleScroll = (direction) => {
        setViewOffset(prev => Math.max(0, prev + (direction === 'left' ? -7 : 7)));
    };

    // Calculate Grid Positions
    const getGridPos = (start, duration) => {
        // Simple mapping: startDay relative to viewOffset
        // This is a simplified logic where day 1 is the first day of the project (relative to "today" for demo purposes)
        // Ideally we map task dates to the `days` array.
        // For the demo, let's assume task.startDay maps to index (task.startDay - 1).

        const startIndex = start - 1 - viewOffset;
        const width = duration;

        return {
            left: `${startIndex * 40}px`,
            width: `${width * 40}px`,
            visible: startIndex + width > 0 && startIndex < DAYS_TO_SHOW
        };
    };

    const getTradeColor = (tradeId) => {
        return TRADES.find(t => t.id === tradeId)?.color || '#94a3b8';
    };

    return (
        <div style={{ padding: '0px', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header / Toolbar */}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <div>
                    <h2 style={{ fontSize: '18px', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={20} color="#00d4ff" />
                        Project Schedule <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '12px', color: '#94a3b8' }}>Phase 1</span>
                    </h2>
                    <p style={{ margin: '4px 0 0 30px', fontSize: '13px', color: '#94a3b8' }}>Site Alpha • 85% On Schedule</p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => handleScroll('left')} className="icon-btn"><ChevronLeft size={18} /></button>
                    <button onClick={() => setViewOffset(0)} className="text-btn">Today</button>
                    <button onClick={() => handleScroll('right')} className="icon-btn"><ChevronRight size={18} /></button>
                </div>
            </div>

            {/* Gantt Area */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Task List (Left sidebar) */}
                <div style={{ width: '250px', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                    <div style={{ padding: '12px', fontSize: '11px', fontWeight: '600', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>TASK NAME</div>
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            style={{
                                padding: '12px',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '13px',
                                height: '48px', // Fixed height to align with chart rows
                                display: 'flex', alignItems: 'center', gap: '8px',
                                background: selectedTask === task.id ? 'rgba(255,255,255,0.05)' : 'transparent',
                                cursor: 'pointer'
                            }}
                            onClick={() => setSelectedTask(task.id === selectedTask ? null : task.id)}
                        >
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: getTradeColor(task.trade) }}></div>
                            {task.name}
                        </div>
                    ))}
                    <div style={{ padding: '12px', color: '#94a3b8', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Plus size={14} /> Add Task
                    </div>
                </div>

                {/* Timeline Chart */}
                <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden', position: 'relative' }}>

                    {/* Header Row (Days) */}
                    <div style={{ display: 'flex', height: '40px', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, background: '#030508', zIndex: 10 }}>
                        {days.map((day, i) => (
                            <div key={i} style={{
                                minWidth: '40px', width: '40px',
                                borderRight: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                fontSize: '11px',
                                background: day.isWeekend ? 'rgba(255,255,255,0.02)' : 'transparent',
                                color: day.isWeekend ? '#64748b' : '#94a3b8'
                            }}>
                                <span style={{ fontWeight: '600' }}>{day.date}</span>
                                <span style={{ fontSize: '9px' }}>{day.day}</span>
                            </div>
                        ))}
                    </div>

                    {/* Task Rows (Grid) */}
                    <div style={{ position: 'relative' }}>
                        {/* Background Grid Lines */}
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', pointerEvents: 'none' }}>
                            {days.map((day, i) => (
                                <div key={i} style={{
                                    minWidth: '40px', width: '40px',
                                    borderRight: '1px solid rgba(255,255,255,0.03)',
                                    background: day.isWeekend ? 'rgba(255,255,255,0.01)' : 'transparent'
                                }}></div>
                            ))}
                        </div>

                        {/* Task Bars */}
                        {tasks.map(task => {
                            const { left, width, visible } = getGridPos(task.startDay, task.duration);
                            const trade = TRADES.find(t => t.id === task.trade);

                            // Don't render if completely out of view (left) or too far right
                            // For simplicity in this demo, we just hide by overflow, but precise rendering helps performance

                            return (
                                <div
                                    key={task.id}
                                    style={{
                                        height: '48px',
                                        borderBottom: '1px solid rgba(255,255,255,0.03)',
                                        position: 'relative',
                                        width: `${days.length * 40}px` // Ensure row full width
                                    }}
                                >
                                    <motion.div
                                        layoutId={`task-${task.id}`}
                                        style={{
                                            position: 'absolute',
                                            left,
                                            width,
                                            top: '10px',
                                            height: '28px',
                                            background: trade ? `${trade.color}33` : '#475569',
                                            border: `1px solid ${trade ? trade.color : '#94a3b8'}`,
                                            borderRadius: '6px',
                                            cursor: 'grab',
                                            display: 'flex', alignItems: 'center', paddingLeft: '8px',
                                            fontSize: '11px', fontWeight: '500', color: '#fff',
                                            overflow: 'hidden', whiteSpace: 'nowrap'
                                        }}
                                        whileHover={{ scale: 1.02, zIndex: 10 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {/* Progress Bar Inside */}
                                        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${task.progress}%`, background: trade.color, opacity: 0.3 }}></div>

                                        <span style={{ zIndex: 1, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
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

            {/* Legend / Resources */}
            <div style={{
                padding: '12px 20px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                background: '#030508',
                display: 'flex', gap: '16px', alignItems: 'center', overflowX: 'auto'
            }}>
                <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TRADES:</span>
                {TRADES.map(trade => (
                    <div key={trade.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#94a3b8' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: trade.color }}></div>
                        {trade.name}
                    </div>
                ))}
            </div>

            <style>{`
                .icon-btn {
                    width: 32px; height: 32px;
                    display: flex; alignItems: center; justifyContent: center;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 6px;
                    color: #fff; cursor: pointer;
                    transition: all 0.2s;
                }
                .icon-btn:hover { background: rgba(255,255,255,0.1); }
                
                .text-btn {
                    padding: 0 12px; height: 32px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 6px;
                    color: #fff; cursor: pointer;
                    font-size: 13px;
                }
                .text-btn:hover { background: rgba(255,255,255,0.1); }
            `}</style>
        </div>
    );
}
