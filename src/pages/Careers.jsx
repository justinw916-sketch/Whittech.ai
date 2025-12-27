import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Zap, Coffee, Code } from 'lucide-react';

export default function Careers() {
    const jobs = [
        { title: 'Senior Full Stack Engineer', dept: 'Engineering', loc: 'Remote (US)', type: 'Full-time' },
        { title: 'AI Systems Architect', dept: 'AI Research', loc: 'San Francisco', type: 'Full-time' },
        { title: 'Product Designer', dept: 'Design', loc: 'Remote', type: 'Contract' },
    ];

    return (
        <div style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '80px' }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '80px' }}>
                    <h1>Build the <span className="accent">Future</span></h1>
                    <p style={{ maxWidth: '600px', margin: '20px auto', color: '#94a3b8', fontSize: '20px' }}>
                        We're a team of builders, hackers, and problem solvers. Join us and help build the operating system for modern business.
                    </p>
                </div>

                <div style={{ marginBottom: '100px' }}>
                    <h2 style={{ marginBottom: '40px', fontSize: '28px' }}>Open Roles</h2>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {jobs.map((job, i) => (
                            <div key={i} className="job-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '32px', background: 'rgba(13, 18, 25, 0.6)', border: '1px solid rgba(0, 212, 255, 0.1)', borderRadius: '12px', transition: 'all 0.3s' }}>
                                <div>
                                    <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{job.title}</h3>
                                    <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '14px' }}>
                                        <span>{job.dept}</span>
                                        <span>•</span>
                                        <span>{job.loc}</span>
                                        <span>•</span>
                                        <span>{job.type}</span>
                                    </div>
                                </div>
                                <Link to="/contact" className="btn btn-secondary" style={{ padding: '10px 20px', fontSize: '14px' }}>
                                    Apply <ArrowRight size={16} />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <style>{`
                .job-card:hover {
                    border-color: #00d4ff;
                    transform: translateX(10px);
                }
            `}</style>
                </div>

                <div className="features-section" style={{ background: 'transparent', padding: 0 }}>
                    <h2 style={{ marginBottom: '40px', fontSize: '28px' }}>Perks & Benefits</h2>
                    <div className="features-grid">
                        <Perk icon={Code} title="Latest Tech" desc="We equip everyone with top-tier hardware." />
                        <Perk icon={Zap} title="Move Fast" desc="No red tape. Ship code on day one." />
                        <Perk icon={Coffee} title="Remote First" desc="Work from anywhere. We value output, not hours." />
                    </div>
                </div>
            </div>
        </div>
    );
}

function Perk({ icon: Icon, title, desc }) {
    return (
        <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', background: 'rgba(0, 212, 255, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#00d4ff' }}>
                <Icon size={24} />
            </div>
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{title}</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>{desc}</p>
        </div>
    );
}
