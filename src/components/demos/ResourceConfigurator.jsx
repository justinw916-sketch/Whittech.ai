import { useState, useEffect, useCallback } from 'react';
import { Cpu, HardDrive, Database, Zap, Rocket, Check, Copy, Download, Terminal, Activity, Wifi, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Pricing configuration
const PRICING = {
    cpu: 5,      // $5 per vCPU/month
    ram: 2,      // $2 per GB RAM/month
    storage: 0.1 // $0.10 per GB storage/month
};

const PRESETS = [
    { name: 'Starter', cpu: 2, ram: 4, storage: 50, color: '#10b981', icon: '🚀' },
    { name: 'Professional', cpu: 8, ram: 16, storage: 250, color: '#6366f1', icon: '⚡' },
    { name: 'Enterprise', cpu: 16, ram: 64, storage: 1000, color: '#f59e0b', icon: '🏢' },
];

const DEPLOY_STAGES = [
    { name: 'Initializing', duration: 800, message: 'Initializing virtual environment...' },
    { name: 'Provisioning', duration: 1200, message: 'Provisioning compute resources...' },
    { name: 'Configuring', duration: 1000, message: 'Configuring network and security...' },
    { name: 'Installing', duration: 1500, message: 'Installing system dependencies...' },
    { name: 'Optimizing', duration: 800, message: 'Optimizing performance settings...' },
    { name: 'Finalizing', duration: 600, message: 'Finalizing deployment...' },
];

export default function ResourceConfigurator({ onLog }) {
    const [config, setConfig] = useState({ cpu: 4, ram: 8, storage: 100 });
    const [status, setStatus] = useState('idle'); // idle, deploying, active
    const [deployStage, setDeployStage] = useState(0);
    const [deployProgress, setDeployProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [copied, setCopied] = useState(false);
    const [uptime, setUptime] = useState(0);
    const [metrics, setMetrics] = useState({ cpu: 0, ram: 0, network: 0 });

    // Calculate pricing
    const monthlyPrice = (config.cpu * PRICING.cpu) + (config.ram * PRICING.ram) + (config.storage * PRICING.storage);
    const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
    const displayPrice = billingCycle === 'monthly' ? monthlyPrice : yearlyPrice / 12;

    // Add log entry
    const addLog = useCallback((message, type = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-20), { timestamp, message, type }]);
        if (onLog) onLog(message);
    }, [onLog]);

    // Handle slider updates
    const handleUpdate = (key, value) => {
        setConfig(prev => ({ ...prev, [key]: value }));
    };

    // Apply preset
    const applyPreset = (preset) => {
        setConfig({ cpu: preset.cpu, ram: preset.ram, storage: preset.storage });
        addLog(`Applied ${preset.name} preset: ${preset.cpu} vCPU, ${preset.ram}GB RAM, ${preset.storage}GB Storage`);
    };

    // Deployment simulation
    const handleDeploy = async () => {
        if (status === 'deploying') return;

        setStatus('deploying');
        setDeployStage(0);
        setDeployProgress(0);
        setLogs([]);
        addLog('🚀 Starting deployment sequence...', 'system');

        for (let i = 0; i < DEPLOY_STAGES.length; i++) {
            const stage = DEPLOY_STAGES[i];
            setDeployStage(i);
            addLog(stage.message);

            // Animate progress within stage
            const startProgress = (i / DEPLOY_STAGES.length) * 100;
            const endProgress = ((i + 1) / DEPLOY_STAGES.length) * 100;
            const steps = 10;
            const stepDuration = stage.duration / steps;

            for (let j = 0; j <= steps; j++) {
                await new Promise(r => setTimeout(r, stepDuration));
                setDeployProgress(startProgress + (endProgress - startProgress) * (j / steps));
            }

            // Random technical logs
            if (i === 1) addLog(`Allocated ${config.cpu} vCPU cores @ 3.2GHz`);
            if (i === 2) addLog(`Mounted ${config.storage}GB NVMe SSD volume`);
            if (i === 3) addLog(`Configured ${config.ram}GB DDR5 memory`);
        }

        addLog('✅ Deployment complete! System is now active.', 'success');
        setStatus('active');
        setUptime(0);
    };

    // Uptime counter
    useEffect(() => {
        if (status !== 'active') return;
        const interval = setInterval(() => setUptime(u => u + 1), 1000);
        return () => clearInterval(interval);
    }, [status]);

    // Simulated live metrics
    useEffect(() => {
        if (status !== 'active') return;
        const interval = setInterval(() => {
            setMetrics({
                cpu: 15 + Math.random() * 25,
                ram: 30 + Math.random() * 20,
                network: Math.random() * 100
            });
        }, 2000);
        return () => clearInterval(interval);
    }, [status]);

    // Copy configuration
    const copyConfig = () => {
        const configStr = `WhitTech.AI Resource Configuration\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n• CPU: ${config.cpu} vCPU\n• RAM: ${config.ram} GB\n• Storage: ${config.storage} GB\n• Estimated Cost: $${displayPrice.toFixed(2)}/mo`;
        navigator.clipboard.writeText(configStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        addLog('Configuration copied to clipboard');
    };

    // Format uptime
    const formatUptime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Keyboard shortcuts
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === '1') applyPreset(PRESETS[0]);
            if (e.key === '2') applyPreset(PRESETS[1]);
            if (e.key === '3') applyPreset(PRESETS[2]);
            if (e.key === 'd' && status === 'idle') handleDeploy();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [status]);

    return (
        <div style={{ padding: '30px', color: '#fff', minHeight: '100%' }}>
            {/* Header */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '24px', margin: 0 }}>
                        <Zap size={24} color="#00d4ff" />
                        System Resource Planner
                    </h2>
                    <p style={{ color: '#94a3b8', marginTop: '8px', fontSize: '14px' }}>
                        Configure your virtual environment • Press 1/2/3 for presets
                    </p>
                </div>

                {/* Billing Toggle */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '50px' }}>
                    <button
                        onClick={() => setBillingCycle('monthly')}
                        style={{
                            background: billingCycle === 'monthly' ? '#00d4ff' : 'transparent',
                            color: billingCycle === 'monthly' ? '#000' : '#94a3b8',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px',
                            transition: 'all 0.2s'
                        }}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setBillingCycle('yearly')}
                        style={{
                            background: billingCycle === 'yearly' ? '#00d4ff' : 'transparent',
                            color: billingCycle === 'yearly' ? '#000' : '#94a3b8',
                            border: 'none',
                            padding: '6px 16px',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '13px',
                            transition: 'all 0.2s'
                        }}
                    >
                        Yearly <span style={{ fontSize: '11px', opacity: 0.8 }}>(-20%)</span>
                    </button>
                </div>
            </div>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {PRESETS.map((preset, i) => (
                    <motion.button
                        key={preset.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => applyPreset(preset)}
                        style={{
                            background: `linear-gradient(135deg, ${preset.color}22, ${preset.color}11)`,
                            border: `1px solid ${preset.color}44`,
                            padding: '12px 20px',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>{preset.icon}</span>
                        <div style={{ textAlign: 'left' }}>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{preset.name}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                {preset.cpu} vCPU • {preset.ram}GB • {preset.storage}GB
                            </div>
                        </div>
                        <span style={{ marginLeft: '8px', fontSize: '11px', color: '#94a3b8' }}>[{i + 1}]</span>
                    </motion.button>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Left Column - Sliders */}
                <div style={{ display: 'grid', gap: '20px' }}>
                    {/* CPU Slider */}
                    <SliderCard
                        icon={<Cpu size={18} />}
                        label="Processor (vCPU)"
                        value={config.cpu}
                        unit="Cores"
                        min={1}
                        max={32}
                        step={1}
                        color="#6366f1"
                        price={config.cpu * PRICING.cpu}
                        onChange={(v) => handleUpdate('cpu', v)}
                    />

                    {/* RAM Slider */}
                    <SliderCard
                        icon={<Database size={18} />}
                        label="Memory (RAM)"
                        value={config.ram}
                        unit="GB"
                        min={1}
                        max={128}
                        step={1}
                        color="#10b981"
                        price={config.ram * PRICING.ram}
                        onChange={(v) => handleUpdate('ram', v)}
                    />

                    {/* Storage Slider */}
                    <SliderCard
                        icon={<HardDrive size={18} />}
                        label="NVMe Storage"
                        value={config.storage}
                        unit="GB"
                        min={10}
                        max={2000}
                        step={10}
                        color="#f59e0b"
                        price={config.storage * PRICING.storage}
                        onChange={(v) => handleUpdate('storage', v)}
                    />

                    {/* Price Display */}
                    <motion.div
                        layout
                        style={{
                            background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(99,102,241,0.1))',
                            border: '1px solid rgba(0,212,255,0.3)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Estimated Cost</div>
                        <motion.div
                            key={displayPrice}
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            style={{ fontSize: '36px', fontWeight: 'bold', color: '#00d4ff' }}
                        >
                            ${displayPrice.toFixed(2)}
                            <span style={{ fontSize: '16px', color: '#94a3b8' }}>/mo</span>
                        </motion.div>
                        {billingCycle === 'yearly' && (
                            <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                                Saving ${(monthlyPrice * 12 * 0.2).toFixed(2)}/year
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right Column - Terminal & Status */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Terminal Logs */}
                    <div style={{
                        background: '#0a0e14',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        flex: 1,
                        minHeight: '200px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{
                            padding: '10px 16px',
                            background: 'rgba(255,255,255,0.03)',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '13px',
                            color: '#94a3b8'
                        }}>
                            <Terminal size={14} />
                            System Log
                        </div>
                        <div style={{
                            padding: '12px 16px',
                            fontSize: '12px',
                            fontFamily: 'Share Tech Mono, monospace',
                            overflow: 'auto',
                            flex: 1,
                            maxHeight: '180px'
                        }}>
                            {logs.length === 0 ? (
                                <div style={{ color: '#475569' }}>Awaiting deployment...</div>
                            ) : (
                                logs.map((log, i) => (
                                    <div key={i} style={{
                                        color: log.type === 'success' ? '#10b981' : log.type === 'system' ? '#00d4ff' : '#94a3b8',
                                        marginBottom: '4px'
                                    }}>
                                        <span style={{ color: '#475569' }}>[{log.timestamp}]</span> {log.message}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Deployment Progress */}
                    {status === 'deploying' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(255,255,255,0.03)',
                                padding: '16px',
                                borderRadius: '12px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                <span style={{ color: '#f59e0b' }}>{DEPLOY_STAGES[deployStage]?.name || 'Complete'}</span>
                                <span style={{ color: '#94a3b8' }}>{Math.round(deployProgress)}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                <motion.div
                                    style={{
                                        height: '100%',
                                        background: 'linear-gradient(90deg, #00d4ff, #6366f1)',
                                        borderRadius: '3px'
                                    }}
                                    animate={{ width: `${deployProgress}%` }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* Live Metrics (when active) */}
                    {status === 'active' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                padding: '16px',
                                borderRadius: '12px'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981' }}>
                                    <Activity size={16} />
                                    <span style={{ fontWeight: '600' }}>System Active</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8' }}>
                                    <Clock size={14} />
                                    {formatUptime(uptime)}
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                                <MetricBar label="CPU" value={metrics.cpu} color="#6366f1" />
                                <MetricBar label="RAM" value={metrics.ram} color="#10b981" />
                                <MetricBar label="Network" value={metrics.network} color="#00d4ff" icon={<Wifi size={12} />} />
                            </div>
                        </motion.div>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDeploy}
                            disabled={status === 'deploying'}
                            style={{
                                flex: 1,
                                padding: '14px 24px',
                                background: status === 'active' ? '#10b981' : 'linear-gradient(135deg, #00d4ff, #6366f1)',
                                border: 'none',
                                borderRadius: '10px',
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '14px',
                                cursor: status === 'deploying' ? 'not-allowed' : 'pointer',
                                opacity: status === 'deploying' ? 0.7 : 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {status === 'deploying' ? (
                                <>Deploying...</>
                            ) : status === 'active' ? (
                                <><Check size={18} /> System Active</>
                            ) : (
                                <><Rocket size={18} /> Deploy System</>
                            )}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={copyConfig}
                            style={{
                                padding: '14px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '10px',
                                color: copied ? '#10b981' : '#94a3b8',
                                cursor: 'pointer'
                            }}
                            title="Copy Configuration"
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Slider Card Component
function SliderCard({ icon, label, value, unit, min, max, step, color, price, onChange }) {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.05)'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <span style={{ color }}>{icon}</span>
                    {label}
                </label>
                <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#00d4ff', fontWeight: 'bold', fontSize: '18px' }}>{value}</span>
                    <span style={{ color: '#94a3b8', fontSize: '14px', marginLeft: '4px' }}>{unit}</span>
                </div>
            </div>

            {/* Custom Slider Track */}
            <div style={{ position: 'relative', height: '8px', marginBottom: '8px' }}>
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '4px'
                }} />
                <motion.div
                    style={{
                        position: 'absolute',
                        height: '100%',
                        background: `linear-gradient(90deg, ${color}, ${color}88)`,
                        borderRadius: '4px',
                        boxShadow: `0 0 10px ${color}44`
                    }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer'
                    }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b' }}>
                <span>{min} {unit}</span>
                <span style={{ color: '#94a3b8' }}>${price.toFixed(2)}/mo</span>
                <span>{max} {unit}</span>
            </div>
        </div>
    );
}

// Metric Bar Component
function MetricBar({ label, value, color, icon }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                {icon}
                {label}
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                    style={{ height: '100%', background: color, borderRadius: '2px' }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <div style={{ fontSize: '11px', color, marginTop: '2px' }}>{value.toFixed(0)}%</div>
        </div>
    );
}
