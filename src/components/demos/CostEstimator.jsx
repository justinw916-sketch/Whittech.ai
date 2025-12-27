import { useState } from 'react';
import { DollarSign, Smartphone, Monitor, Database, Globe } from 'lucide-react';

export default function CostEstimator() {
    const [platform, setPlatform] = useState('web');
    const [features, setFeatures] = useState([]);

    const toggleFeature = (id) => {
        setFeatures(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const featureList = [
        { id: 'auth', label: 'User Authentication', price: 1500, icon: <LockIcon /> },
        { id: 'payment', label: 'Payment Processing', price: 2000, icon: <DollarSign size={16} /> },
        { id: 'admin', label: 'Admin Dashboard', price: 2500, icon: <Monitor size={16} /> },
        { id: 'db', label: 'Database Integration', price: 1000, icon: <Database size={16} /> },
        { id: 'api', label: 'External API', price: 1500, icon: <Globe size={16} /> }
    ];

    const basePrice = platform === 'mobile' ? 8000 : 5000;
    const featureTotal = features.reduce((acc, current) => {
        const feature = featureList.find(f => f.id === current);
        return acc + (feature ? feature.price : 0);
    }, 0);
    const total = basePrice + featureTotal;

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0d1219 0%, #131a24 100%)',
            padding: '30px', borderRadius: '16px', border: '1px solid rgba(0, 212, 255, 0.2)'
        }}>
            <h3 style={{ marginBottom: '24px' }}>Software Cost Estimator</h3>

            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', fontSize: '14px' }}>Platform</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setPlatform('web')}
                        className={`btn ${platform === 'web' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '10px' }}
                    >
                        Web App
                    </button>
                    <button
                        onClick={() => setPlatform('mobile')}
                        className={`btn ${platform === 'mobile' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ flex: 1, padding: '10px' }}
                    >
                        Mobile App
                    </button>
                </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', marginBottom: '10px', color: '#94a3b8', fontSize: '14px' }}>Features</label>
                <div style={{ display: 'grid', gap: '10px' }}>
                    {featureList.map(feature => (
                        <div
                            key={feature.id}
                            onClick={() => toggleFeature(feature.id)}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                background: features.includes(feature.id) ? 'rgba(0, 212, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                                border: features.includes(feature.id) ? '1px solid #00d4ff' : '1px solid transparent',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {feature.icon}
                                <span>{feature.label}</span>
                            </div>
                            <span style={{ color: '#94a3b8', fontSize: '13px' }}>+${feature.price}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
                <span style={{ color: '#94a3b8' }}>Estimated Cost</span>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#00d4ff' }}>${total.toLocaleString()}</span>
            </div>
        </div>
    );
}

function LockIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
    );
}
