import { useState, useEffect } from 'react';
import { Cpu, HardDrive, Database, Globe, Zap } from 'lucide-react';

export default function ResourceConfigurator({ onLog }) {
    const [config, setConfig] = useState({
        cpu: 2,
        ram: 4,
        storage: 50,
        status: 'idle'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/resources')
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleUpdate = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    const handleDeploy = () => {
        setConfig(prev => ({ ...prev, status: 'deploying' }));
        if (onLog) onLog(`Initiating deployment: ${config.cpu} vCPUs, ${config.ram}GB RAM...`);

        fetch('/api/resources/deploy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(config)
        })
            .then(res => res.json())
            .then(data => {
                if (onLog) onLog(data.message);
                setTimeout(() => {
                    setConfig(prev => ({ ...prev, status: 'active' }));
                    if (onLog) onLog('System active and running.');
                }, 2000);
            });
    };

    if (loading) return <div style={{ padding: '20px', color: '#94a3b8' }}>Loading system config...</div>;

    return (
        <div style={{ padding: '30px', color: '#fff' }}>
            <div style={{ marginBottom: '30px' }}>
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px' }}>
                    <Zap size={24} color="#00d4ff" /> System Resource Planner
                </h2>
                <p style={{ color: '#94a3b8', marginTop: '8px' }}>Configure your virtual environment specs.</p>
            </div>

            <div style={{ display: 'grid', gap: '24px', maxWidth: '600px' }}>
                {/* CPU Config */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Cpu size={18} color="#6366f1" /> Processor (vCPU)
                        </label>
                        <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{config.cpu} Cores</span>
                    </div>
                    <input
                        type="range" min="1" max="16" step="1"
                        value={config.cpu}
                        onChange={(e) => handleUpdate('cpu', parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#00d4ff' }}
                    />
                </div>

                {/* RAM Config */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Database size={18} color="#10b981" /> Memory (RAM)
                        </label>
                        <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{config.ram} GB</span>
                    </div>
                    <input
                        type="range" min="2" max="64" step="2"
                        value={config.ram}
                        onChange={(e) => handleUpdate('ram', parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#10b981' }}
                    />
                </div>

                {/* Storage Config */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <HardDrive size={18} color="#f59e0b" /> SSD Storage
                        </label>
                        <span style={{ color: '#00d4ff', fontWeight: 'bold' }}>{config.storage} GB</span>
                    </div>
                    <input
                        type="range" min="10" max="1000" step="10"
                        value={config.storage}
                        onChange={(e) => handleUpdate('storage', parseInt(e.target.value))}
                        style={{ width: '100%', accentColor: '#f59e0b' }}
                    />
                </div>

                {/* Status Actions */}
                <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: config.status === 'active' ? '#10b981' : (config.status === 'deploying' ? '#f59e0b' : '#64748b'),
                            boxShadow: config.status === 'active' ? '0 0 10px #10b981' : 'none'
                        }}></div>
                        <span style={{ textTransform: 'uppercase', fontSize: '14px', letterSpacing: '1px', color: '#94a3b8' }}>
                            {config.status}
                        </span>
                    </div>

                    <button
                        onClick={handleDeploy}
                        disabled={config.status === 'deploying'}
                        className="btn btn-primary"
                        style={{ padding: '12px 32px', minWidth: '160px' }}
                    >
                        {config.status === 'deploying' ? 'Deploying...' : 'Provision System'}
                    </button>
                </div>
            </div>
        </div>
    );
}
