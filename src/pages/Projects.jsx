import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink, Database, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const projects = [
    {
        id: 'crm-demo',
        title: 'Sales Pipeline CRM',
        subtitle: 'Full-Featured CRM Demo',
        description: 'A comprehensive sales pipeline management system with leads tracking, accounts, contacts, tasks, campaigns, forecasting, and analytics dashboards.',
        tags: ['React', 'TypeScript', 'TailwindCSS', 'Recharts'],
        icon: TrendingUp,
        color: '#00d4ff',
        features: [
            'Kanban Pipeline Board',
            'Lead Management',
            'Sales Forecasting',
            'Analytics Dashboard',
            'Contact Management',
            'Task Tracking'
        ],
        link: '/projects/crm-demo',
        isLive: true
    },
    {
        id: 'estimation-tool',
        title: 'Construction Estimator',
        subtitle: 'Bid Calculation Tool',
        description: 'Custom estimation tool for construction companies. Calculate material costs, labor hours, and generate professional bids automatically.',
        tags: ['React', 'PDF Generation', 'Real-time Calculations'],
        icon: Database,
        color: '#a855f7',
        features: [
            'Material Takeoffs',
            'Labor Costing',
            'Profit Margins',
            'PDF Export',
            'Template Library',
            'Multi-project Support'
        ],
        link: null,
        isLive: false
    },
    {
        id: 'team-dashboard',
        title: 'Project Dashboard',
        subtitle: 'Team Management Tool',
        description: 'Real-time project tracking dashboard for teams. Monitor progress, deadlines, budgets, and team performance in one place.',
        tags: ['React', 'Real-time', 'Charts'],
        icon: Users,
        color: '#ec4899',
        features: [
            'Task Assignment',
            'Progress Tracking',
            'Budget Monitoring',
            'Team Chat',
            'File Sharing',
            'Reporting'
        ],
        link: null,
        isLive: false
    },
    {
        id: 'analytics-platform',
        title: 'Business Analytics',
        subtitle: 'Data Visualization Platform',
        description: 'Transform your business data into actionable insights with custom dashboards, automated reports, and predictive analytics.',
        tags: ['React', 'D3.js', 'AI/ML'],
        icon: BarChart3,
        color: '#10b981',
        features: [
            'Custom Dashboards',
            'Automated Reports',
            'Data Connectors',
            'Trend Analysis',
            'Export Tools',
            'Real-time Sync'
        ],
        link: null,
        isLive: false
    }
];

export default function Projects() {
    return (
        <div style={{ minHeight: '100vh', paddingTop: '120px' }}>
            {/* Hero Section */}
            <section style={{ padding: '60px 24px', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ maxWidth: '800px', margin: '0 auto' }}
                >
                    <span style={{
                        display: 'inline-block',
                        padding: '8px 16px',
                        background: 'rgba(0, 212, 255, 0.1)',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        borderRadius: '20px',
                        fontSize: '13px',
                        color: '#00d4ff',
                        marginBottom: '24px',
                        fontFamily: "'Share Tech Mono', monospace"
                    }}>
                        ● Live Portfolio
                    </span>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        marginBottom: '20px',
                        lineHeight: '1.1'
                    }}>
                        Projects That <span style={{ color: '#00d4ff' }}>Prove</span> Our Process
                    </h1>
                    <p style={{
                        fontSize: '1.1rem',
                        color: '#94a3b8',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: '1.7'
                    }}>
                        Explore live demos and case studies of our custom software solutions.
                        See what we've built and imagine what we can build for you.
                    </p>
                </motion.div>
            </section>

            {/* Projects Grid */}
            <section style={{ padding: '40px 24px 100px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '30px'
                }}>
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            style={{
                                background: 'rgba(255, 255, 255, 0.02)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: '16px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}
                        >
                            {/* Accent Top Border */}
                            <div style={{
                                height: '4px',
                                background: `linear-gradient(90deg, ${project.color}, transparent)`
                            }} />

                            <div style={{ padding: '28px' }}>
                                {/* Header */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                                    <div style={{
                                        width: '50px',
                                        height: '50px',
                                        borderRadius: '12px',
                                        background: `${project.color}20`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0
                                    }}>
                                        <project.icon size={24} style={{ color: project.color }} />
                                    </div>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>
                                                {project.title}
                                            </h3>
                                            {project.isLive && (
                                                <span style={{
                                                    padding: '3px 8px',
                                                    background: 'rgba(16, 185, 129, 0.2)',
                                                    color: '#10b981',
                                                    borderRadius: '4px',
                                                    fontSize: '11px',
                                                    fontWeight: '600',
                                                    textTransform: 'uppercase'
                                                }}>
                                                    Live Demo
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                                            {project.subtitle}
                                        </p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p style={{
                                    fontSize: '14px',
                                    color: '#94a3b8',
                                    lineHeight: '1.6',
                                    marginBottom: '20px'
                                }}>
                                    {project.description}
                                </p>

                                {/* Features */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '8px',
                                    marginBottom: '20px'
                                }}>
                                    {project.features.map((feature, i) => (
                                        <div key={i} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            fontSize: '12px',
                                            color: '#64748b'
                                        }}>
                                            <div style={{
                                                width: '4px',
                                                height: '4px',
                                                borderRadius: '50%',
                                                background: project.color
                                            }} />
                                            {feature}
                                        </div>
                                    ))}
                                </div>

                                {/* Tags */}
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '8px',
                                    marginBottom: '24px'
                                }}>
                                    {project.tags.map((tag, i) => (
                                        <span key={i} style={{
                                            padding: '4px 10px',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            color: '#94a3b8',
                                            fontFamily: "'Share Tech Mono', monospace"
                                        }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* CTA */}
                                {project.isLive ? (
                                    <Link
                                        to={project.link}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            padding: '12px 20px',
                                            background: `linear-gradient(135deg, ${project.color}, ${project.color}99)`,
                                            borderRadius: '8px',
                                            color: '#030508',
                                            fontWeight: '600',
                                            fontSize: '14px',
                                            textDecoration: 'none',
                                            transition: 'transform 0.2s'
                                        }}
                                    >
                                        Try Demo <ArrowRight size={16} />
                                    </Link>
                                ) : (
                                    <div style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '12px 20px',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        borderRadius: '8px',
                                        color: '#64748b',
                                        fontWeight: '600',
                                        fontSize: '14px',
                                        cursor: 'not-allowed'
                                    }}>
                                        Coming Soon
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section style={{
                padding: '80px 24px',
                textAlign: 'center',
                background: 'linear-gradient(180deg, transparent, rgba(0, 212, 255, 0.03))'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{ maxWidth: '600px', margin: '0 auto' }}
                >
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '16px' }}>
                        Want Something Similar?
                    </h2>
                    <p style={{ color: '#94a3b8', marginBottom: '32px', lineHeight: '1.7' }}>
                        Every project starts with a conversation. Let's talk about
                        what you need and how we can build it together.
                    </p>
                    <Link
                        to="/contact"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '14px 28px',
                            background: 'linear-gradient(135deg, #00d4ff, #00a8cc)',
                            borderRadius: '10px',
                            color: '#030508',
                            fontWeight: '600',
                            fontSize: '15px',
                            textDecoration: 'none'
                        }}
                    >
                        Start a Project <ExternalLink size={18} />
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
