import express from 'express';
import cors from 'cors';
import db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// formatted delay to simulate real network latency
const simulateDelay = (res, data) => {
    setTimeout(() => {
        res.json(data);
    }, 600);
};

// --- Health Check ---
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', uptime: process.uptime() });
});

// --- Resource Planner Endpoints ---
app.get('/api/resources', (req, res) => {
    simulateDelay(res, db.resources);
});

app.post('/api/resources/deploy', (req, res) => {
    const config = req.body;
    // db.resources is a reference, but we can assign properties
    Object.assign(db.resources, config, { status: 'deploying' });

    // Simulate deployment process
    setTimeout(() => {
        db.resources.status = 'active';
    }, 2000);

    simulateDelay(res, { success: true, message: 'Deployment started' });
});

// --- Kanban Endpoints ---
app.get('/api/kanban/tasks', (req, res) => {
    simulateDelay(res, db.tasks);
});

app.post('/api/kanban/tasks', (req, res) => {
    const newTask = {
        id: Date.now(),
        title: req.body.title,
        status: 'todo'
    };
    db.tasks.push(newTask);
    simulateDelay(res, newTask);
});

app.put('/api/kanban/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const task = db.tasks.find(t => t.id == id);
    if (task) {
        task.status = status;
        simulateDelay(res, task);
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.delete('/api/kanban/tasks/:id', (req, res) => {
    const { id } = req.params;
    const index = db.tasks.findIndex(t => t.id == id);
    if (index !== -1) {
        db.tasks.splice(index, 1);
        simulateDelay(res, { success: true });
    } else {
        res.status(404).json({ error: 'Task not found' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend API running on http://localhost:${PORT}`);
});
