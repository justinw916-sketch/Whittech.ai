import { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Clock, List } from 'lucide-react';

export default function KanbanBoard({ onLog }) {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = () => {
        fetch('/api/kanban/tasks')
            .then(res => res.json())
            .then(data => setTasks(data));
    };

    const statusColors = {
        'todo': { bg: 'rgba(99, 102, 241, 0.1)', border: '#6366f1', icon: <List size={16} /> },
        'in-progress': { bg: 'rgba(245, 158, 11, 0.1)', border: '#f59e0b', icon: <Clock size={16} /> },
        'done': { bg: 'rgba(16, 185, 129, 0.1)', border: '#10b981', icon: <CheckCircle size={16} /> }
    };

    const addTask = (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        if (onLog) onLog(`Creating task: "${newTask}"`);
        fetch('/api/kanban/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTask })
        })
            .then(res => res.json())
            .then(task => {
                setTasks(prev => [...prev, task]);
                setNewTask('');
                if (onLog) onLog(`Task ID ${task.id} created.`);
            });
    };

    const updateStatus = (id, newStatus) => {
        if (onLog) onLog(`Updating task ${id} to ${newStatus}`);
        fetch(`/api/kanban/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        })
            .then(res => res.json())
            .then(updated => {
                setTasks(prev => prev.map(t => t.id === id ? updated : t));
            });
    };

    const deleteTask = (id) => {
        if (onLog) onLog(`Deleting task ${id}...`);
        fetch(`/api/kanban/tasks/${id}`, { method: 'DELETE' })
            .then(() => {
                setTasks(prev => prev.filter(t => t.id !== id));
                if (onLog) onLog('Task deleted.');
            });
    };

    const renderColumn = (status, title) => (
        <div style={{ flex: 1, minWidth: '250px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
            <h3 style={{
                fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px',
                marginBottom: '16px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
                {statusColors[status].icon}
                {title} <span style={{ opacity: 0.5 }}>({tasks.filter(t => t.status === status).length})</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tasks.filter(t => t.status === status).map(task => (
                    <div key={task.id} style={{
                        background: '#131b26', padding: '16px', borderRadius: '8px',
                        borderLeft: `3px solid ${statusColors[status].border}`,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <p style={{ marginBottom: '12px', fontSize: '15px' }}>{task.title}</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                {status !== 'todo' && (
                                    <button onClick={() => updateStatus(task.id, 'todo')} style={actionBtnStyle}>To Do</button>
                                )}
                                {status !== 'in-progress' && (
                                    <button onClick={() => updateStatus(task.id, 'in-progress')} style={actionBtnStyle}>Progress</button>
                                )}
                                {status !== 'done' && (
                                    <button onClick={() => updateStatus(task.id, 'done')} style={actionBtnStyle}>Done</button>
                                )}
                            </div>
                            <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.6 }}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div style={{ padding: '30px', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Project Board</h2>
                    <p style={{ color: '#94a3b8' }}>Real-time task management with persistent state.</p>
                </div>

                <form onSubmit={addTask} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="New task..."
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        style={{
                            padding: '10px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(0,0,0,0.3)', color: '#fff', outline: 'none', width: '250px'
                        }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
                        <Plus size={18} /> Add
                    </button>
                </form>
            </div>

            <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '20px', flex: 1 }}>
                {renderColumn('todo', 'To Do')}
                {renderColumn('in-progress', 'In Progress')}
                {renderColumn('done', 'Completed')}
            </div>
        </div>
    );
}

const actionBtnStyle = {
    background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '4px',
    color: '#94a3b8', fontSize: '11px', padding: '4px 8px', cursor: 'pointer', marginRight: '4px',
    transition: 'all 0.2s'
};
