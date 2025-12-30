import { Link } from 'react-router-dom';
import { Cpu, Code, Zap, Globe, Shield, Rocket, ArrowRight, Brain, Layers } from 'lucide-react';
import Magnetic from '../components/Magnetic';

export default function About() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero" style={{ minHeight: '80vh', paddingTop: '160px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.1 }}>
                    {/* Abstract Background Grid */}
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="hero-badge" style={{ borderColor: '#00d4ff', color: '#00d4ff' }}>The Future of Systems</div>
                    <h1>Engineering <span className="gradient" style={{ backgroundImage: 'linear-gradient(135deg, #00d4ff 0%, #0ea5e9 100%)' }}>Intelligence.</span></h1>
                    <p style={{ fontSize: '20px', maxWidth: '700px' }}>
                        We don't just write code. We architect digital nervous systems for businesses that demand speed, scale, and absolute precision.
                    </p>
                </div>
            </section>

            {/* The DNA Section */}
            <section style={{ background: 'rgba(10, 14, 20, 0.5)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2>Our <span className="accent" style={{ color: '#00d4ff' }}>DNA</span></h2>
                        <p>Born in the cloud, forged in code. We operate on three core principles.</p>
                    </div>

                    <div className="features-grid">
                        <Principle icon={Zap} title="Velocity" desc="Speed is a feature. We deploy in days, not months, using our proprietary 'Hyper-Agile' framework." color="#00d4ff" />
                        <Principle icon={Shield} title="Resilience" desc="Zero tolerance for downtime. We build systems that heal themselves and scale automatically." color="#0ea5e9" />
                        <Principle icon={Brain} title="Intelligence" desc="AI isn't an afterthought. It's the core of everything we build, from UI to database optimization." color="#06b6d4" />
                    </div>
                </div>
            </section>

            {/* The Process - Timeline */}
            <section>
                <div className="container">
                    <div className="section-header">
                        <h2>The <span className="accent" style={{ color: '#00d4ff' }}>Execution</span> Protocol</h2>
                    </div>

                    <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', paddingTop: '40px' }}>
                        {/* Vertical Line */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: '2px', background: 'rgba(255, 255, 255, 0.1)', transform: 'translateX(-50%)' }} className="timeline-line"></div>

                        <TimelineItem
                            step="01"
                            title="Discovery & Blueprint"
                            desc="We decode your business logic. No assumptions. We map every data point and workflow before writing a single line of code."
                            icon={Layers}
                            side="left"
                        />
                        <TimelineItem
                            step="02"
                            title="Rapid Synthesis"
                            desc="Construction begins. You see daily progress. Our CI/CD pipelines push code to your private staging environment continuously."
                            icon={Code}
                            side="right"
                        />
                        <TimelineItem
                            step="03"
                            title="Validation & Launch"
                            desc="Rigorous automated testing and security audits. When we flip the switch, your system is bulletproof and ready for scale."
                            icon={Rocket}
                            side="left"
                        />
                    </div>

                    <style>{`
                @media (max-width: 768px) {
                    .timeline-line { left: 20px !important; transform: none !important; }
                    .timeline-item { flexDirection: column !important; align-items: flex-start !important; padding-left: 50px !important; text-align: left !important; }
                    .timeline-icon { left: 0 !important; right: auto !important; }
                    .timeline-content.left { text-align: left !important; align-items: flex-start !important; }
                }
              `}</style>
                </div>
            </section>

            {/* Why Choose Us CTA */}
            <section style={{ background: 'linear-gradient(180deg, rgba(13, 18, 25, 0) 0%, #0f172a 100%)', padding: '100px 0', textAlign: 'center' }}>
                <div className="container">
                    <h2 style={{ fontSize: '48px', marginBottom: '32px' }}>Ready to Upgrade Your <span className="accent" style={{ color: '#00d4ff' }}>Reality?</span></h2>
                    <p style={{ fontSize: '20px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 48px' }}>
                        Stop settling for off-the-shelf software. Build the tool that gives you the unfair advantage.
                    </p>
                    <Magnetic>
                        <Link to="/contact" className="btn btn-primary" style={{ padding: '16px 48px', fontSize: '18px', background: '#00d4ff', boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)' }}>
                            Start Your Project <ArrowRight size={20} style={{ marginLeft: '12px' }} />
                        </Link>
                    </Magnetic>
                </div>
            </section>
        </>
    );
}

function Principle({ icon: Icon, title, desc, color }) {
    return (
        <div className="feature-card" style={{ textAlign: 'left', borderTop: `4px solid ${color}`, padding: '32px' }}>
            <div style={{ marginBottom: '24px', background: `rgba(255, 255, 255, 0.05)`, width: 'fit-content', padding: '12px', borderRadius: '12px' }}>
                <Icon size={32} color={color} />
            </div>
            <h3 style={{ fontSize: '24px', marginBottom: '12px' }}>{title}</h3>
            <p style={{ color: '#94a3b8', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}

function TimelineItem({ step, title, desc, icon: Icon, side }) {
    const isLeft = side === 'left';
    return (
        <div className="timeline-item" style={{
            display: 'flex',
            justifyContent: isLeft ? 'flex-end' : 'flex-start',
            padding: '40px 0',
            position: 'relative',
            width: '100%'
        }}>
            <div className="timeline-icon" style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '40px',
                background: '#0d1219',
                border: '2px solid #00d4ff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
                color: '#00d4ff',
                fontWeight: 'bold',
                fontFamily: 'Share Tech Mono'
            }}>
                {step}
            </div>

            <div className={`timeline-content ${side}`} style={{
                width: '50%',
                padding: isLeft ? '0 60px 0 0' : '0 0 0 60px',
                textAlign: isLeft ? 'right' : 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: isLeft ? 'flex-end' : 'flex-start'
            }}>
                <h3 style={{ fontSize: '28px', color: '#fff', marginBottom: '12px' }}>{title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: '1.6' }}>{desc}</p>
            </div>
        </div>
    );
}
