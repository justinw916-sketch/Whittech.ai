import { useState, useEffect, useCallback } from 'react';
import { Cpu, HardDrive, Database, Zap, Rocket, Check, Copy, Download, Terminal, Activity, Wifi, Clock, Globe, Server, AlertTriangle, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Performance scoring weights
const PERF_WEIGHTS = {
    cpu: 500,     // Points per vCPU
    ram: 100,     // Points per GB RAM
    storage: 2    // Points per GB storage
};

const PRESETS = [
    { name: 'Starter', cpu: 2, ram: 4, storage: 50, color: '#10b981', icon: '🚀' },
    { name: 'Professional', cpu: 8, ram: 16, storage: 250, color: '#6366f1', icon: '⚡' },
    { name: 'Enterprise', cpu: 16, ram: 64, storage: 1000, color: '#f59e0b', icon: '🏢' },
];

const DO_REGIONS = [
    { id: 'nyc', name: 'New York', flag: '🇺🇸', latency: 12 },
    { id: 'lon', name: 'London', flag: '🇬🇧', latency: 78 },
    { id: 'sgp', name: 'Singapore', flag: '🇸🇬', latency: 185 },
    { id: 'fra', name: 'Frankfurt', flag: '🇩🇪', latency: 82 },
];

const OS_OPTIONS = [
    { id: 'ubuntu', name: 'Ubuntu 24.04', icon: '🐧' },
    { id: 'debian', name: 'Debian 12', icon: '🍥' },
    { id: 'centos', name: 'CentOS Stream', icon: '💠' },
    { id: 'alpine', name: 'Alpine Linux', icon: '🏔️' },
];

const DEPLOY_STAGES = [
    { name: 'Initializing', duration: 800, message: 'Initializing virtual environment...' },
    { name: 'Provisioning', duration: 1200, message: 'Provisioning compute resources...' },
    { name: 'Configuring', duration: 1000, message: 'Configuring network and security...' },
    { name: 'Installing', duration: 1500, message: 'Installing system dependencies...' },
    { name: 'Optimizing', duration: 800, message: 'Optimizing performance settings...' },
    { name: 'Finalizing', duration: 600, message: 'Finalizing deployment...' },
];

export default function ResourceConfigurator({ onLog, onStatusChange }) {
    const [config, setConfig] = useState({ cpu: 4, ram: 8, storage: 100 });
    const [region, setRegion] = useState(DO_REGIONS[0]);
    const [os, setOs] = useState(OS_OPTIONS[0]);
    const [status, setStatus] = useState('idle'); // idle, deploying, active
    const [stressTest, setStressTest] = useState(false);
    const [deployStage, setDeployStage] = useState(0);
    const [deployProgress, setDeployProgress] = useState(0);
    const [logs, setLogs] = useState([]);
    // Performance score calculation
    const performanceScore = (config.cpu * PERF_WEIGHTS.cpu) + (config.ram * PERF_WEIGHTS.ram) + (config.storage * PERF_WEIGHTS.storage);
    const [copied, setCopied] = useState(false);
    const [uptime, setUptime] = useState(0);
    const [metrics, setMetrics] = useState({ cpu: 0, ram: 0, network: 0 });

    // Calculate capacity
    const estimatedVisitors = Math.floor((config.cpu * 5000) + (config.ram * 2000));



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
        if (onStatusChange) onStatusChange('deploying');
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
            if (i === 1) addLog(`Selected region: ${region.name} (${region.id})`);
            if (i === 2) addLog(`Booting ${os.name} kernel image...`);
            if (i === 3) addLog(`Allocated ${config.cpu} vCPU, ${config.ram}GB RAM`);
        }

        addLog('✅ Deployment complete! System is now active.', 'success');
        setStatus('active');
        if (onStatusChange) onStatusChange('active');
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
            setMetrics(prev => ({
                cpu: stressTest ? Math.min(99, prev.cpu + 10) : Math.max(5, (15 + Math.random() * 25)),
                ram: stressTest ? Math.min(95, prev.ram + 5) : Math.max(10, (30 + Math.random() * 20)),
                network: stressTest ? Math.random() * 1000 : Math.random() * 100
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, [status, stressTest]);

    // Copy configuration
    const copyConfig = () => {
        const configStr = `WhitTech.AI Server Config\n━━━━━━━━━━━━━━━━━━━━\n• Region: ${region.name}\n• OS: ${os.name}\n• CPU: ${config.cpu} vCPU\n• RAM: ${config.ram} GB\n• Storage: ${config.storage} GB\n• Est. Visitors: ~${estimatedVisitors.toLocaleString()}/day`;
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
            </div>

            {/* Config Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) minmax(300px, 2fr)', gap: '24px', marginBottom: '24px' }}>
                {/* Left Col: Region, OS, Benchmarks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Region Selection */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Globe size={14} /> Data Center Region
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            {DO_REGIONS.map(r => (
                                <button
                                    key={r.id}
                                    onClick={() => setRegion(r)}
                                    style={{
                                        background: region.id === r.id ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255,255,255,0.05)',
                                        border: region.id === r.id ? '1px solid #00d4ff' : '1px solid transparent',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        fontSize: '13px'
                                    }}
                                >
                                    <span>{r.flag} {r.name}</span>
                                    <span style={{ fontSize: '10px', color: r.latency < 50 ? '#10b981' : '#f59e0b' }}>
                                        {r.latency}ms
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* OS Selection */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Server size={14} /> Operating System
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {OS_OPTIONS.map(o => (
                                <button
                                    key={o.id}
                                    onClick={() => setOs(o)}
                                    style={{
                                        flex: 1,
                                        background: os.id === o.id ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.05)',
                                        border: os.id === o.id ? '1px solid #6366f1' : '1px solid transparent',
                                        padding: '8px',
                                        borderRadius: '8px',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                        fontSize: '11px'
                                    }}
                                >
                                    <span style={{ fontSize: '16px' }}>{o.icon}</span>
                                    {o.name.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Capacity Estimator */}
                    <motion.div
                        layout
                        style={{
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1))',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            padding: '20px',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#10b981', marginBottom: '4px' }}>
                            <Users size={16} /> <span style={{ fontSize: '12px', fontWeight: '600' }}>CAPACITY PERF.</span>
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff' }}>
                            ~{(estimatedVisitors / 1000).toFixed(1)}k
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>Est. Daily Unique Visitors</div>
                    </motion.div>
                </div>

                {/* Right Col: Sliders & Presets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Presets */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {PRESETS.map((preset, i) => (
                            <motion.button
                                key={preset.name}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => applyPreset(preset)}
                                style={{
                                    flex: 1,
                                    background: `linear-gradient(135deg, ${preset.color}22, ${preset.color}11)`,
                                    border: `1px solid ${preset.color}44`,
                                    padding: '12px 20px',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    transition: 'all 0.2s',
                                    minWidth: '140px'
                                }}
                            >
                                <span style={{ fontSize: '18px' }}>{preset.icon}</span>
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{preset.name}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                        {preset.cpu} vCPU • {preset.ram}GB RAM
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <SliderCard
                            icon={<Cpu size={18} />}
                            label="Processor (vCPU)"
                            value={config.cpu}
                            unit="Cores"
                            min={1} max={32} step={1}
                            color="#6366f1"
                            onChange={(v) => handleUpdate('cpu', v)}
                        />
                        <SliderCard
                            icon={<Database size={18} />}
                            label="Memory (RAM)"
                            value={config.ram}
                            unit="GB"
                            min={1} max={128} step={1}
                            color="#10b981"
                            onChange={(v) => handleUpdate('ram', v)}
                        />
                        <SliderCard
                            icon={<HardDrive size={18} />}
                            label="NVMe Storage"
                            value={config.storage}
                            unit="GB"
                            min={10} max={2000} step={10}
                            color="#f59e0b"
                            onChange={(v) => handleUpdate('storage', v)}
                        />
                    </div>
                </div>
            </div>

            {/* Bottom Section: Terminal + Status */}
            <div>
                {/* Deployment Progress - Full Width */}
                {status === 'deploying' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            padding: '16px',
                            borderRadius: '12px',
                            marginBottom: '20px'
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

                {/* Dashboard (Active State) */}
                {status === 'active' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="active-dashboard"
                        style={{
                            background: stressTest ? 'rgba(239, 68, 68, 0.05)' : 'rgba(16, 185, 129, 0.05)',
                            border: stressTest ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                            borderRadius: '16px',
                            padding: '24px',
                            marginBottom: '24px',
                            transition: 'all 0.3s'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    padding: '8px',
                                    borderRadius: '8px',
                                    background: stressTest ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                                    color: stressTest ? '#ef4444' : '#10b981'
                                }}>
                                    {stressTest ? <AlertTriangle size={20} /> : <Activity size={20} />}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 'bold', fontSize: '16px', color: stressTest ? '#ef4444' : '#10b981' }}>
                                        {stressTest ? 'SYSTEM UNDER LOAD' : 'SYSTEM HEALTHY'}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                                        {region.name} • {os.name} • Uptime: {formatUptime(uptime)}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStressTest(!stressTest)}
                                style={{
                                    background: stressTest ? '#ef4444' : 'rgba(255,255,255,0.05)',
                                    color: stressTest ? '#fff' : '#ef4444',
                                    border: '1px solid #ef4444',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Zap size={14} />
                                {stressTest ? 'STOP STRESS TEST' : 'RUN STRESS TEST'}
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                            <MetricGauge label="vCPU Usage" value={metrics.cpu} color={metrics.cpu > 80 ? '#ef4444' : '#6366f1'} />
                            <MetricGauge label="Memory Usage" value={metrics.ram} color={metrics.ram > 80 ? '#ef4444' : '#10b981'} />
                            <MetricGauge label="Network I/O" value={metrics.network} max={1000} unit="Mbps" color="#00d4ff" />
                        </div>
                    </motion.div>
                )}

                {/* Bottom Row: Logs + Pricing + Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: status === 'active' ? '1fr' : '1.5fr 1fr', gap: '24px' }}>
                    {/* Terminal Logs */}
                    <div style={{
                        background: '#0a0e14',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        height: '280px',
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
                            System Log {status === 'active' && '— Tailing /var/log/syslog'}
                        </div>
                        <div style={{
                            padding: '12px 16px',
                            fontSize: '11px',
                            fontFamily: 'Share Tech Mono, monospace',
                            overflow: 'auto',
                            flex: 1,
                            display: 'flex', flexDirection: 'column-reverse' // Auto scrol to bottom trick
                        }}>
                            <div> {/* Wrapper for column-reverse */}
                                {logs.map((log, i) => (
                                    <div key={i} style={{
                                        color: log.type === 'success' ? '#10b981' : log.type === 'system' ? '#00d4ff' : '#94a3b8',
                                        marginBottom: '4px',
                                        lineHeight: '1.4'
                                    }}>
                                        <span style={{ color: '#475569', marginRight: '8px' }}>[{log.timestamp}]</span>
                                        {log.message}
                                    </div>
                                ))}
                                {logs.length === 0 && <div style={{ color: '#475569' }}>Ready to initialize...</div>}
                            </div>
                        </div>
                    </div>

                    {/* Action Panel (Hidden when active to focus on dashboard) */}
                    {status !== 'active' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Performance Score Display */}
                            <motion.div
                                layout
                                style={{
                                    background: 'linear-gradient(135deg, rgba(0,212,255,0.05), rgba(99,102,241,0.05))',
                                    border: '1px solid rgba(0,212,255,0.2)',
                                    padding: '24px',
                                    borderRadius: '12px',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', fontWeight: '500' }}>COMPUTE POWER SCORE</div>
                                <motion.div
                                    key={performanceScore}
                                    initial={{ scale: 1.1, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    style={{ fontSize: '42px', fontWeight: 'bold', color: '#00d4ff', letterSpacing: '-1px' }}
                                >
                                    {performanceScore.toLocaleString()}
                                    <span style={{ fontSize: '16px', color: '#94a3b8', fontWeight: '400' }}> pts</span>
                                </motion.div>
                                <div style={{ fontSize: '12px', color: '#6366f1', marginTop: '4px', background: 'rgba(99, 102, 241, 0.1)', padding: '4px 12px', borderRadius: '20px' }}>
                                    {performanceScore < 3000 ? 'Entry Level' : performanceScore < 8000 ? 'Professional Grade' : 'Enterprise Class'}
                                </div>
                            </motion.div>

                            {/* Deploy Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDeploy}
                                disabled={status === 'deploying'}
                                style={{
                                    padding: '20px',
                                    background: 'linear-gradient(135deg, #00d4ff, #6366f1)',
                                    border: 'none',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    cursor: status === 'deploying' ? 'not-allowed' : 'pointer',
                                    opacity: status === 'deploying' ? 0.7 : 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    boxShadow: '0 10px 30px -10px rgba(99, 102, 241, 0.5)'
                                }}
                            >
                                {status === 'deploying' ? (
                                    <>
                                        <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                                        Initializing...
                                    </>
                                ) : (
                                    <><Rocket size={20} /> DEPLOY SERVER INSTANCE</>
                                )}
                            </motion.button>
                        </div>
                    )}
                </div>
            </div>

            {/* Styles for spinner */}
            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

// Helper Components
function SliderCard({ icon, label, value, unit, min, max, step, color, onChange }) {
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
                <span>{max} {unit}</span>
            </div>
        </div>
    );
}

// Metric Gauge Component
function MetricGauge({ label, value, max = 100, unit = '%', color }) {
    return (
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>{label}</div>
            <div style={{ display: 'flex', alignItems: 'end', gap: '4px', marginBottom: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: color, lineHeight: 1 }}>{value.toFixed(0)}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>{unit}</div>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
                <motion.div
                    style={{ height: '100%', background: color, borderRadius: '2px' }}
                    animate={{ width: `${(value / max) * 100}%` }}
                />
            </div>
        </div>
    );
}
