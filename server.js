import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// --- API ROUTES ---

const simulateDelay = (res, data) => {
    setTimeout(() => {
        res.json(data);
    }, 600);
};

app.get('/api/status', (req, res) => {
    res.json({ status: 'online', uptime: process.uptime() });
});

app.get('/api/resources', (req, res) => {
    simulateDelay(res, db.resources);
});

app.post('/api/resources/deploy', (req, res) => {
    const config = req.body;
    Object.assign(db.resources, config, { status: 'deploying' });
    setTimeout(() => {
        db.resources.status = 'active';
    }, 2000);
    simulateDelay(res, { success: true, message: 'Deployment started' });
});

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

// --- STATIC FILES (FRONTEND) ---
// Serve static files from the 'dist' directory (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Routing (SPA) - Send all other requests to index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
