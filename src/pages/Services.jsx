import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calculator, ClipboardList, Smartphone, Bot, Link2, Lightbulb,
    ArrowRight, CheckCircle, Zap, Clock, Shield, Sparkles,
    LineChart, Users, Database, Cloud, Code, Workflow
} from 'lucide-react';
import Magnetic from '../components/Magnetic';

const services = [
    {
        id: 'estimation',
        icon: Calculator,
        title: 'Estimation & Bidding Tools',
        tagline: 'Win More Jobs, Faster',
        color: '#00d4ff',
        description: 'Stop wrestling with spreadsheets and generic software that doesn\'t understand your business. We build custom estimation tools that match YOUR pricing structure, YOUR materials, and YOUR workflow.',
        features: [
            'Custom material takeoff calculators',
            'Labor cost estimation with crew rates',
            'Automated bid document generation',
            'Historical job cost analysis',
            'Supplier pricing integration',
            'Margin and markup calculators'
        ],
        benefits: [
            { icon: Clock, text: 'Cut bid prep time by 60%' },
            { icon: Zap, text: 'Eliminate calculation errors' },
            { icon: LineChart, text: 'Track win rates by job type' }
        ]
    },
    {
        id: 'project-management',
        icon: ClipboardList,
        title: 'Project Management Apps',
        tagline: 'Your Operations, Your Way',
        color: '#6366f1',
        description: 'Off-the-shelf PM tools force you to work their way. We build systems around YOUR process—tracking jobs, crews, schedules, and budgets exactly how you need it.',
        features: [
            'Custom project dashboards',
            'Real-time job status tracking',
            'Crew scheduling and dispatch',
            'Budget vs. actual monitoring',
            'Document management',
            'Client communication portal'
        ],
        benefits: [
            { icon: Users, text: 'Coordinate crews in real-time' },
            { icon: Database, text: 'Centralize all project data' },
            { icon: Shield, text: 'Never miss a deadline' }
        ]
    },
    {
        id: 'field-mobile',
        icon: Smartphone,
        title: 'Field & Mobile Tools',
        tagline: 'Built for the Jobsite',
        color: '#ec4899',
        description: 'Your crew doesn\'t sit at desks. They need apps that work on dusty tablets in bright sunlight. We build mobile-first tools designed for real field conditions.',
        features: [
            'Time tracking with GPS verification',
            'Daily log and progress reports',
            'Photo documentation with markup',
            'Digital punch lists',
            'Equipment tracking',
            'Offline-first architecture'
        ],
        benefits: [
            { icon: Cloud, text: 'Works without cell service' },
            { icon: Smartphone, text: 'Designed for gloved hands' },
            { icon: Zap, text: 'Syncs instantly when online' }
        ]
    },
    {
        id: 'ai-automation',
        icon: Bot,
        title: 'AI-Powered Automation',
        tagline: 'Let Machines Handle the Boring Stuff',
        color: '#a855f7',
        description: 'AI isn\'t just hype—it\'s a force multiplier. We implement smart automation that handles document processing, generates reports, and alerts you before problems happen.',
        features: [
            'Intelligent document parsing',
            'Automated report generation',
            'Smart data entry from photos',
            'Predictive maintenance alerts',
            'Natural language queries',
            'Anomaly detection in costs'
        ],
        benefits: [
            { icon: Sparkles, text: 'Save 10+ hours per week' },
            { icon: Bot, text: 'AI that learns your patterns' },
            { icon: Workflow, text: 'Zero manual data entry' }
        ]
    },
    {
        id: 'integrations',
        icon: Link2,
        title: 'System Integrations',
        tagline: 'Make Your Tools Talk',
        color: '#f59e0b',
        description: 'Your business runs on multiple systems that don\'t communicate. We build bridges between QuickBooks, CRMs, supplier catalogs, and your custom tools.',
        features: [
            'QuickBooks Online/Desktop sync',
            'Google Sheets automation',
            'CRM data synchronization',
            'Supplier catalog imports',
            'Custom API development',
            'Automated data pipelines'
        ],
        benefits: [
            { icon: Database, text: 'Single source of truth' },
            { icon: Workflow, text: 'Eliminate double-entry' },
            { icon: Code, text: 'Custom webhooks & APIs' }
        ]
    },
    {
        id: 'custom',
        icon: Lightbulb,
        title: 'Custom Solutions',
        tagline: 'If You Can Describe It, We Can Build It',
        color: '#10b981',
        description: 'Got a unique problem? That\'s our specialty. From inventory trackers to customer portals to internal tools nobody else makes—we love building what doesn\'t exist yet.',
        features: [
            'Unique business logic',
            'Industry-specific workflows',
            'Customer-facing portals',
            'Internal operations tools',
            'Data visualization dashboards',
            'Anything you can imagine'
        ],
        benefits: [
            { icon: Lightbulb, text: 'Solve unsolvable problems' },
            { icon: Zap, text: 'Built exactly to spec' },
            { icon: Users, text: 'Your competitive advantage' }
        ]
    }
];

function ServiceCard({ service, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            id={service.id}
            style={{
                background: 'linear-gradient(135deg, #0d1219 0%, rgba(13, 18, 25, 0.8) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '48px',
                marginBottom: '32px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Glow effect */}
            <div style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '300px',
                height: '300px',
                background: `radial-gradient(circle, ${service.color}15 0%, transparent 70%)`,
                pointerEvents: 'none',
            }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>
                {/* Left: Content */}
                <div>
                    <div style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: '16px',
                        background: `${service.color}15`,
                        border: `2px solid ${service.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '24px',
                    }}>
                        <service.icon size={36} color={service.color} />
                    </div>

                    <div style={{ fontSize: '14px', color: service.color, fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                        {service.tagline}
                    </div>

                    <h3 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '16px', color: '#fff' }}>
                        {service.title}
                    </h3>

                    <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.7', marginBottom: '32px' }}>
                        {service.description}
                    </p>

                    {/* Benefits */}
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {service.benefits.map((benefit, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <benefit.icon size={18} color={service.color} />
                                <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{benefit.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Features */}
                <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderRadius: '16px',
                    padding: '32px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                }}>
                    <h4 style={{ fontSize: '16px', color: '#94a3b8', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        What's Included
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {service.features.map((feature, i) => (
                            <motion.li
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.05 }}
                                viewport={{ once: true }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '12px 0',
                                    borderBottom: i < service.features.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none',
                                }}
                            >
                                <CheckCircle size={18} color={service.color} />
                                <span style={{ color: '#e2e8f0', fontSize: '15px' }}>{feature}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </div>
        </motion.div>
    );
}

export default function Services() {
    return (
        <>
            {/* Hero Section */}
            <section className="hero" style={{ minHeight: '70vh', paddingTop: '140px' }}>
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="hero-badge">Our Capabilities</div>
                        <h1>
                            Solutions That <br />
                            <span className="gradient">Actually Solve Problems.</span>
                        </h1>
                        <p style={{ fontSize: '20px', maxWidth: '700px', margin: '0 auto' }}>
                            We don't build generic software. Every tool we create is engineered around YOUR business logic, YOUR workflows, and YOUR goals. Here's what we do best.
                        </p>
                    </motion.div>

                    {/* Quick Navigation */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        style={{
                            display: 'flex',
                            gap: '12px',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginTop: '40px',
                        }}
                    >
                        {services.map((s) => (
                            <a
                                key={s.id}
                                href={`#${s.id}`}
                                style={{
                                    padding: '10px 20px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${s.color}40`,
                                    borderRadius: '50px',
                                    color: s.color,
                                    textDecoration: 'none',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {s.title}
                            </a>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Services Detail Section */}
            <section style={{ padding: '80px 32px' }}>
                <div className="container">
                    {services.map((service, index) => (
                        <ServiceCard key={service.id} service={service} index={index} />
                    ))}
                </div>
            </section>

            {/* Why Choose Us Strip */}
            <section style={{ background: 'rgba(0, 212, 255, 0.05)', borderTop: '1px solid rgba(0, 212, 255, 0.1)', borderBottom: '1px solid rgba(0, 212, 255, 0.1)' }}>
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">2-4</div>
                            <div className="stat-label">Week Delivery</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">$0</div>
                            <div className="stat-label">Monthly Fees</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Custom Built</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">∞</div>
                            <div className="stat-label">Flexibility</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section" style={{ padding: '120px 32px' }}>
                <div className="container">
                    <div className="cta-box">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2>Ready to Build Something <span className="accent">Amazing?</span></h2>
                            <p style={{ fontSize: '18px', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px' }}>
                                Tell us about your challenge. We'll give you a no-BS assessment of whether we can help, a realistic timeline, and a fixed-price quote. No pressure, no sales pitch.
                            </p>
                            <div className="cta-buttons">
                                <Magnetic>
                                    <Link to="/contact" className="btn btn-primary">
                                        Start Your Project <ArrowRight size={20} style={{ marginLeft: '8px' }} />
                                    </Link>
                                </Magnetic>
                                <Magnetic>
                                    <Link to="/projects" className="btn btn-secondary">
                                        View Our Work
                                    </Link>
                                </Magnetic>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Responsive Styles */}
            <style>{`
                @media (max-width: 900px) {
                    #estimation > div > div,
                    #project-management > div > div,
                    #field-mobile > div > div,
                    #ai-automation > div > div,
                    #integrations > div > div,
                    #custom > div > div {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </>
    );
}
