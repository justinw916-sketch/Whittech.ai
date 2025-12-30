import { useState, useEffect } from 'react';
import { Wifi, WifiOff, X, Maximize2, Minimize2, Terminal } from 'lucide-react';

export default function AppContainer({ title, onClose, children, externalStatus }) {
    const [status, setStatus] = useState('connecting');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [logs, setLogs] = useState([]);

    // Use external status if provided (from ResourceConfigurator deployment)
    const displayStatus = externalStatus === 'active' ? 'connected' : (externalStatus === 'deploying' ? 'deploying' : status);

    useEffect(() => {
        // Simulate initial connection (always succeed for demo)
        setTimeout(() => {
            setStatus('ready');
            addLog('System initialized - ready for deployment');
        }, 1000);
    }, []);

    const addLog = (msg) => {
        setLogs(prev => [...prev.slice(-4), `> ${msg}`]);
    };

    return (
        <div style={{
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            right: isFullscreen ? 0 : 'auto',
            bottom: isFullscreen ? 0 : 'auto',
            width: isFullscreen ? '100vw' : '100%',
            height: isFullscreen ? '100vh' : 'auto',
            minHeight: '600px',
            zIndex: isFullscreen ? 2000 : 1,
            background: '#0d1219',
            border: isFullscreen ? 'none' : '1px solid rgba(0, 212, 255, 0.2)',
            borderRadius: isFullscreen ? 0 : '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: isFullscreen ? '0 0 0 0' : '0 20px 50px rgba(0,0,0,0.5)'
        }}>
            {/* App Header */}
            <div style={{
                padding: '12px 20px',
                background: 'rgba(3, 5, 8, 0.95)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></div>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                    </div>
                    <span style={{ fontFamily: 'monospace', color: '#94a3b8', fontSize: '13px' }}>~/apps/{title.toLowerCase().replace(/\s+/g, '-')}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                        {displayStatus === 'deploying' ?
                            <WifiOff size={14} color="#f59e0b" /> :
                            <Wifi size={14} color="#10b981" />
                        }
                        <span style={{ color: displayStatus === 'deploying' ? '#f59e0b' : '#10b981' }}>
                            {displayStatus === 'deploying' ? 'DEPLOYING' : 'ONLINE'}
                        </span>
                    </div>
                    <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <button onClick={() => setIsFullscreen(!isFullscreen)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                        <X size={16} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
                {children}
            </div>

            {/* Terminal Footer */}
            <div style={{
                padding: '12px 20px',
                background: 'rgba(0,0,0,0.3)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                fontFamily: 'monospace',
                fontSize: '12px',
                color: '#64748b'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Terminal size={12} />
                    <span>System Log</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {logs.map((log, i) => (
                        <div key={i}>{log}</div>
                    ))}
                </div>
            </div>
        </div>
    );
}
