import { Link } from 'react-router-dom';
import { Shield, Lock, Zap, BarChart, Server, Globe } from 'lucide-react';

export default function Enterprise() {
    return (
        <>
            <section className="hero" style={{ minHeight: '80vh', paddingTop: '160px' }}>
                <div className="hero-content">
                    <div className="hero-badge" style={{ borderColor: '#6366f1', color: '#6366f1' }}>WhitTech Enterprise</div>
                    <h1>Scale Without <span className="gradient" style={{ backgroundImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' }}>Limits.</span></h1>
                    <p>Mission-critical software solutions for organizations that can't afford downtime. SOC2 compliance, dedicated support, and custom SLAs.</p>
                    <div className="hero-cta">
                        <Link to="/contact" className="btn btn-primary" style={{ background: '#6366f1', boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}>Talk to Sales</Link>
                    </div>
                </div>
            </section>

            <section style={{ background: 'rgba(10, 14, 20, 0.5)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Enterprise-Grade <span className="accent" style={{ color: '#6366f1' }}>Security</span></h2>
                        <p>Your data is protected by industry-leading security protocols.</p>
                    </div>
                    <div className="features-grid">
                        <Feature icon={Shield} title="SOC2 Compliant" desc="Audited security controls to ensure your data is safe." color="#6366f1" />
                        <Feature icon={Lock} title="SSO & MFA" desc="Integrate with Okta, Azure AD, or Google Workspace." color="#6366f1" />
                        <Feature icon={Server} title="Private Cloud" desc="Dedicated infrastructure options for complete isolation." color="#6366f1" />
                    </div>
                </div>
            </section>

            <section>
                <div className="container">
                    <div className="services-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: '80px' }}>
                        <div>
                            <h2>Dedicated <span style={{ color: '#6366f1' }}>Support</span></h2>
                            <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: '1.8', marginBottom: '32px' }}>
                                When you run at scale, you need more than just software. You need a partner. Our enterprise plans include 24/7 priority support and a dedicated Technical Account Manager.
                            </p>
                            <ul style={{ listStyle: 'none', color: '#cbd5e1', display: 'grid', gap: '16px' }}>
                                {['99.99% Uptime SLA', '15-minute response times', 'Quarterly strategic reviews', 'Custom feature prioritization'].map(item => (
                                    <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#6366f1', borderRadius: '50%' }}></div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #0d1219 0%, #1e1b4b 100%)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                                <div style={{ width: '60px', height: '60px', background: '#6366f1', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Globe color="#fff" size={32} />
                                </div>
                                <div>
                                    <div style={{ fontSize: '20px', fontWeight: 'bold' }}>Global Infrastructure</div>
                                    <div style={{ color: '#94a3b8' }}>Deployed across 12 regions</div>
                                </div>
                            </div>
                            <div style={{ height: '2px', background: 'rgba(255, 255, 255, 0.1)', marginBottom: '32px' }}></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>24/7</div>
                                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>Support Coverage</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '32px', fontWeight: 'bold' }}>&lt;15m</div>
                                    <div style={{ color: '#94a3b8', fontSize: '14px' }}>Response Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

function Feature({ icon: Icon, title, desc, color }) {
    return (
        <div className="feature-card" style={{ transition: 'all 0.3s' }}>
            <div className="feature-icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color }}>
                <Icon size={32} color={color} />
            </div>
            <h3>{title}</h3>
            <p>{desc}</p>
        </div >
    );
}
