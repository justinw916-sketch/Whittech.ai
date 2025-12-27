import { Activity, CheckCircle, Server, Globe, Wifi, Cpu, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Status() {
    const regions = [
        { name: 'US East (N. Virginia)', status: 'Operational', latency: '24ms' },
        { name: 'US West (Oregon)', status: 'Operational', latency: '45ms' },
        { name: 'EU West (Ireland)', status: 'Operational', latency: '89ms' },
        { name: 'Asia Pacific (Tokyo)', status: 'Operational', latency: '112ms' },
    ];

    const services = [
        { name: 'API Gateway', status: 'Operational', uptime: '99.999%' },
        { name: 'Database Cluster', status: 'Operational', uptime: '99.99%' },
        { name: 'CDN Delivery', status: 'Operational', uptime: '100%' },
        { name: 'Authentication', status: 'Operational', uptime: '99.98%' },
    ];

    return (
        <div className="status-page" style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="container">
                {/* Header */}
                <div className="status-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10b981', padding: '8px 20px', borderRadius: '50px', color: '#10b981', marginBottom: '24px' }}>
                        <span style={{ position: 'relative', display: 'flex', width: '10px', height: '10px' }}>
                            <span style={{ animate: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: '#10b981', opacity: '0.75' }}></span>
                            <span style={{ position: 'relative', display: 'inline-flex', height: '10px', width: '10px', borderRadius: '50%', background: '#10b981' }}></span>
                        </span>
                        All Systems Operational
                    </div>
                    <h1>System <span className="accent" style={{ color: '#00d4ff' }}>Status</span></h1>
                    <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
                        Real-time performance metrics and operational status for the WhitTech Platform.
                    </p>
                </div>

                {/* Overview Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                    <StatusCard icon={Activity} label="Current Load" value="42%" sub="Normal Traffic" />
                    <StatusCard icon={Wifi} label="Global Latency" value="38ms" sub="Avg. Response Time" />
                    <StatusCard icon={Server} label="Active Nodes" value="842" sub="Auto-scaling Enabled" />
                    <StatusCard icon={ShieldCheck} label="Security" value="Secure" sub="No Threats Detected" />
                </div>

                {/* Regional Status */}
                <div style={{ background: 'rgba(13, 18, 25, 0.6)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: '16px', overflow: 'hidden', marginBottom: '40px' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid rgba(0, 212, 255, 0.1)' }}>
                        <h3>Regional Connectivity</h3>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', divideY: '1px solid rgba(0, 212, 255, 0.1)' }}>
                        {regions.map((region, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderTop: i > 0 ? '1px solid rgba(0, 212, 255, 0.1)' : 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Globe size={18} color="#64748b" />
                                    <span>{region.name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <span style={{ color: '#64748b', fontSize: '14px', fontFamily: 'Share Tech Mono' }}>{region.latency}</span>
                                    <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={16} /> {region.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detailed Services */}
                <div style={{ background: 'rgba(13, 18, 25, 0.6)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: '16px', padding: '32px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Platform Services</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {services.map((service, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0, 0, 0, 0.2)', padding: '16px 24px', borderRadius: '8px' }}>
                                <div style={{ fontWeight: '500' }}>{service.name}</div>
                                <div style={{ width: '200px', height: '4px', background: '#1e293b', borderRadius: '2px', overflow: 'hidden', margin: '0 24px' }}>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 1.5, delay: i * 0.1 }}
                                        style={{ height: '100%', background: '#10b981' }}
                                    />
                                </div>
                                <div style={{ fontFamily: 'Share Tech Mono', color: '#10b981' }}>{service.uptime}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatusCard({ icon: Icon, label, value, sub }) {
    return (
        <div style={{ background: 'linear-gradient(135deg, #0d1219 0%, rgba(13, 18, 25, 0.8) 100%)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ color: '#94a3b8', fontSize: '14px' }}>{label}</div>
                <Icon size={20} color="#00d4ff" />
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>{value}</div>
            <div style={{ color: '#10b981', fontSize: '13px' }}>{sub}</div>
        </div>
    );
}
