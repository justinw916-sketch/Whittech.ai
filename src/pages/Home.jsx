import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import StrategicNeuralNet from '../components/3d/StrategicNeuralNet';
import Magnetic from '../components/Magnetic';

export default function Home() {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.service-card, .feature-card, .who-card, .stat-item, .hero h1, .hero p, .hero-cta').forEach(el => {
            // Don't override if already set (e.g. by previous render)
            if (!el.style.opacity) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'all 0.6s ease';
            }
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-3d" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                    <Canvas camera={{ position: [0, 0, 1] }}>
                        <StrategicNeuralNet />
                    </Canvas>
                </div>
                <div className="hero-content" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="hero-badge" style={{ opacity: 1, transform: 'translateY(0)' }}>Custom Software, Fast</div>
                    <h1>Your Idea.<br /><span className="gradient">Built in Weeks, Not Months.</span></h1>
                    <p>Custom software for construction companies, startups, and small businesses. We turn your workflow headaches into streamlined applications—flexible, affordable, and built exactly the way you need it.</p>
                    <div className="hero-cta">
                        <Magnetic>
                            <Link to="/contact" className="btn btn-primary">⚡ Get a Free Quote</Link>
                        </Magnetic>
                        <Magnetic>
                            <Link to="/projects" className="btn btn-secondary">📁 See Our Work</Link>
                        </Magnetic>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section>
                <div className="container">
                    <div className="section-header">
                        <h2>What We <span className="accent">Build</span></h2>
                        <p>From simple calculators to full-scale management platforms—we build exactly what you need, nothing more, nothing less.</p>
                    </div>

                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">📊</div>
                            <h3>Estimation & Bidding Tools</h3>
                            <p>Custom calculators, material takeoff tools, and bid generators that match your actual pricing structure. Stop wrestling with spreadsheets.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">📋</div>
                            <h3>Project Management Apps</h3>
                            <p>Track jobs, crews, schedules, and budgets in one place. Built around how you actually work—not how software companies think you should.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">📱</div>
                            <h3>Field & Mobile Tools</h3>
                            <p>Apps your crew can actually use on the jobsite. Time tracking, daily logs, photo documentation, punch lists—all synced in real-time.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">🤖</div>
                            <h3>AI-Powered Automation</h3>
                            <p>Let AI handle the repetitive stuff. Document processing, report generation, data entry, and smart alerts that save hours every week.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">🔗</div>
                            <h3>System Integrations</h3>
                            <p>Connect your existing tools. QuickBooks, Google Sheets, CRMs, supplier catalogs—we make your software talk to each other.</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">💡</div>
                            <h3>Custom Solutions</h3>
                            <p>Got a unique problem? We love those. If you can describe what you need, we can probably build it—and faster than you'd expect.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-number">2-4</div>
                            <div className="stat-label">Week Turnaround</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Custom Built</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">0</div>
                            <div className="stat-label">Monthly Fees*</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">∞</div>
                            <div className="stat-label">Flexibility</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Why <span className="accent">WhitTech.AI</span>?</h2>
                        <p>We're not a big agency with endless overhead. We're builders who understand your business.</p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">⚡</div>
                            <h3>Rapid Development</h3>
                            <p>Most projects delivered in 2-4 weeks. We move fast because we've built similar tools before and know what works.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Built to Your Specs</h3>
                            <p>No templates, no "that's how the software works." Every feature is designed around your actual workflow and terminology.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">💰</div>
                            <h3>Transparent Pricing</h3>
                            <p>Fixed quotes for fixed scopes. No surprise bills, no scope creep charges. You know exactly what you're paying before we start.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🔧</div>
                            <h3>Easy to Change</h3>
                            <p>Business evolves. Your software should too. We build modular systems that grow with you and are easy to modify later.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤝</div>
                            <h3>Direct Communication</h3>
                            <p>No account managers or ticket systems. You talk directly to the person building your software. Questions get answered fast.</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📚</div>
                            <h3>You Own Everything</h3>
                            <p>Your code, your data, your application. We hand over complete ownership. No vendor lock-in, no hostage situations.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Preview */}
            <section>
                <div className="container">
                    <div className="about-grid">
                        <div className="about-visual">
                            <div className="about-frame">
                                <div className="about-logo"><span>W</span></div>
                            </div>
                        </div>
                        <div className="about-content">
                            <h2>Built by a <span className="accent">Problem Solver</span></h2>
                            <p>I spent 18+ years in the field—installing systems, managing projects, estimating jobs, and dealing with the same operational headaches you face. I know what it's like to need a tool that doesn't exist, or to outgrow a spreadsheet that's held together with duct tape.</p>
                            <p>WhitTech.AI exists because I started building tools for myself and realized others needed the same thing: custom software that solves real problems, built by someone who actually understands the work.</p>
                            <Link to="/about" className="btn btn-secondary">👤 Learn More About Us</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who We Work With */}
            <section className="who-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Who We <span className="accent">Work With</span></h2>
                        <p>If you've ever thought "there should be an app for this," we should talk.</p>
                    </div>

                    <div className="who-grid">
                        <div className="who-card">
                            <div className="who-icon">🏗️</div>
                            <h3>Construction Companies</h3>
                            <p>GCs, subcontractors, specialty trades. Estimation tools, project tracking, crew management, and jobsite apps built for how construction actually works.</p>
                        </div>
                        <div className="who-card">
                            <div className="who-icon">🚀</div>
                            <h3>Startups</h3>
                            <p>Need an MVP fast? We build functional prototypes that you can show investors and test with real users—without burning through your runway.</p>
                        </div>
                        <div className="who-card">
                            <div className="who-icon">💼</div>
                            <h3>Small Businesses</h3>
                            <p>Service companies, consultants, local businesses. Custom tools that automate the stuff you hate doing and free you up for actual work.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <div className="container">
                    <div className="cta-box">
                        <h2>Got an Idea? <span class="accent">Let's Talk.</span></h2>
                        <p>Tell me what's slowing you down. I'll tell you if I can help—and give you a realistic timeline and quote. No pressure, no sales pitch.</p>
                        <div className="cta-buttons">
                            <Link to="/contact" className="btn btn-primary">🚀 Start a Conversation</Link>
                            <Link to="/projects" className="btn btn-secondary">📁 View Projects</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
