import { useState } from 'react';
import AppContainer from '../components/playground/AppContainer';
import ResourceConfigurator from '../components/demos/ResourceConfigurator';
import ConstructionSchedule from '../components/demos/ConstructionSchedule';
import MobileAppPreview from '../components/demos/MobileAppPreview';
import { Package, Smartphone, Database, Server, Calendar } from 'lucide-react';

export default function Playground() {
    const [activeApp, setActiveApp] = useState(null);
    const [deploymentStatus, setDeploymentStatus] = useState('idle');

    const apps = [
        {
            id: 'resources',
            name: 'Resource Planner',
            category: 'DevOps Tool',
            description: 'Configure and provision virtual server instances with real-time validated simulation.',
            icon: <Server size={32} color="#00d4ff" />,
            component: ResourceConfigurator
        },
        {
            id: 'schedule',
            name: 'Job Site Scheduler',
            category: 'Project Management',
            description: 'Interactive Gantt chart for multi-phase construction timeline & critical path analysis.',
            icon: <Calendar size={32} color="#f59e0b" />,
            component: ConstructionSchedule
        },
        {
            id: 'mobile-preview',
            name: 'Mobile App Preview',
            category: 'Construction Tools',
            description: '5 fully interactive field tools: Reports, Punch Lists, Safety, Materials, Time Cards.',
            icon: <Smartphone size={32} color="#10b981" />,
            component: MobileAppPreview
        }
    ];

    return (
        <div className="container" style={{ paddingTop: '150px', paddingBottom: '100px' }}>

            {/* Header */}
            {!activeApp && (
                <div className="section-header" style={{ textAlign: 'left', marginBottom: '60px' }}>
                    <h2>Hosted <span className="accent">Applications</span></h2>
                    <p style={{ maxWidth: '100%', margin: 0 }}>
                        Launch live, full-stack demo applications running directly on our infrastructure.
                    </p>
                </div>
            )}

            {/* App Grid / Active App View */}
            {activeApp ? (
                <div style={{ animation: 'fadeIn 0.5s ease' }}>
                    <button
                        onClick={() => { setActiveApp(null); setDeploymentStatus('idle'); }}
                        style={{
                            background: 'none', border: 'none', color: '#94a3b8',
                            marginBottom: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        ← Back to App Store
                    </button>

                    <AppContainer
                        title={apps.find(a => a.id === activeApp).name}
                        onClose={() => { setActiveApp(null); setDeploymentStatus('idle'); }}
                        externalStatus={deploymentStatus}
                    >
                        {(() => {
                            const App = apps.find(a => a.id === activeApp).component;
                            return <App key={activeApp} onStatusChange={setDeploymentStatus} />;
                        })()}
                    </AppContainer>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                    {apps.map(app => (
                        <div
                            key={app.id}
                            onClick={() => setActiveApp(app.id)}
                            className="service-card"
                            style={{ cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
                        >
                            <div style={{
                                width: '64px', height: '64px', background: 'rgba(255,255,255,0.05)',
                                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '24px'
                            }}>
                                {app.icon}
                            </div>
                            <div style={{
                                background: 'rgba(0, 212, 255, 0.1)', color: '#00d4ff', fontSize: '12px',
                                fontWeight: '600', padding: '4px 10px', borderRadius: '20px', marginBottom: '12px'
                            }}>
                                {app.category}
                            </div>
                            <h3 style={{ fontSize: '20px', marginBottom: '10px' }}>{app.name}</h3>
                            <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.6', flex: 1 }}>
                                {app.description}
                            </p>
                            <button className="btn btn-secondary" style={{ width: '100%', marginTop: '20px', justifyContent: 'center', padding: '12px' }}>
                                Launch App
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
