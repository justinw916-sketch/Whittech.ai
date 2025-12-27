// Simple in-memory mock database
const db = {
    // Initial state for Resource Planner
    resources: {
        cpu: 2,
        ram: 4,
        storage: 50,
        status: 'idle'
    },

    // Initial state for Kanban
    tasks: [
        { id: 1, title: 'Design System', status: 'done' },
        { id: 2, title: 'API Integration', status: 'in-progress' },
        { id: 3, title: 'User Testing', status: 'todo' }
    ]
};

export default db;
