import { useState, useEffect } from 'react';

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // Check if redirected from formsubmit
        const query = new URLSearchParams(window.location.search);
        if (query.get('success') === 'true') {
            setSubmitted(true);
        }
    }, []);

    useEffect(() => {
        // Scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.contact-method, .faq-item, .contact-form-wrapper').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <div className="page-header">
                <h1>Let's <span className="accent">Talk</span></h1>
                <p>Got an idea? A problem? A question? We're here to help—and we respond fast.</p>
            </div>

            <section>
                <div className="container">
                    <div className="contact-grid">
                        <div className="contact-info">
                            <h2>Start the <span className="accent">Conversation</span></h2>
                            <p>Whether you have a detailed spec or just a rough idea, we want to hear about it. Tell us what's slowing you down, and we'll tell you if we can help—with a realistic timeline and honest pricing. No sales pitch, no pressure.</p>

                            <div className="contact-methods">
                                <div className="contact-method">
                                    <div className="method-icon">📧</div>
                                    <div className="method-content">
                                        <h3>Email</h3>
                                        <p><a href="mailto:admin@whittech.ai">admin@whittech.ai</a></p>
                                    </div>
                                </div>
                                <div className="contact-method">
                                    <div className="method-icon">📍</div>
                                    <div className="method-content">
                                        <h3>Location</h3>
                                        <p>Pollock Pines, California<br />Working remotely with clients nationwide</p>
                                    </div>
                                </div>
                                <div className="contact-method">
                                    <div className="method-icon">💼</div>
                                    <div className="method-content">
                                        <h3>LinkedIn</h3>
                                        <p><a href="#">Connect professionally</a></p>
                                    </div>
                                </div>
                            </div>

                            <div className="response-box">
                                <p><strong>⚡ Quick Response:</strong> We typically respond within 24 hours. For project inquiries, we'll follow up with questions to understand your needs, then provide a detailed proposal within a few days—usually including timeline, cost breakdown, and approach.</p>
                            </div>
                        </div>

                        <div className="contact-form-wrapper">
                            {!submitted ? (
                                <>
                                    <h2>Send a Message</h2>
                                    <p>Fill out the form below and we'll get back to you quickly.</p>

                                    <form
                                        action="https://formsubmit.co/admin@whittech.ai"
                                        method="POST"
                                        className="contact-form"
                                        onSubmit={() => setIsSubmitting(true)}
                                    >
                                        {/* FormSubmit Configuration */}
                                        <input type="hidden" name="_subject" value="New Inquiry from WhitTech.AI Code" />
                                        <input type="hidden" name="_captcha" value="false" />
                                        <input type="hidden" name="_next" value="http://localhost:5173/contact?success=true" />
                                        {/* Use localhost for dev, in prod this needs real URL */}

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="name">Name *</label>
                                                <input type="text" id="name" name="name" placeholder="John Smith" required />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="email">Email *</label>
                                                <input type="email" id="email" name="email" placeholder="john@example.com" required />
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="company">Company / Business</label>
                                            <input type="text" id="company" name="company" placeholder="Smith Construction (optional)" />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="interest">What are you looking for?</label>
                                            <select id="interest" name="interest">
                                                <option value="">Select an option...</option>
                                                <option value="estimation">Estimation / Bidding Tool</option>
                                                <option value="project-management">Project Management App</option>
                                                <option value="mobile">Field / Mobile Application</option>
                                                <option value="automation">Automation / Integration</option>
                                                <option value="ai">AI-Powered Solution</option>
                                                <option value="startup">Startup MVP / Prototype</option>
                                                <option value="other">Something Else</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="budget">Budget Range</label>
                                            <select id="budget" name="budget">
                                                <option value="">Select a range (optional)...</option>
                                                <option value="under-2k">Under $2,000</option>
                                                <option value="2k-5k">$2,000 - $5,000</option>
                                                <option value="5k-10k">$5,000 - $10,000</option>
                                                <option value="10k-25k">$10,000 - $25,000</option>
                                                <option value="over-25k">$25,000+</option>
                                                <option value="not-sure">Not sure yet</option>
                                            </select>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="message">Tell us about your project *</label>
                                            <textarea id="message" name="message" placeholder="What problem are you trying to solve? What would the ideal solution look like?" required></textarea>
                                        </div>

                                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                            {isSubmitting ? '⏳ Sending...' : '🚀 Send Message'}
                                        </button>
                                    </form>
                                </>
                            ) : (
                                <div className="form-success show">
                                    <div className="icon">✅</div>
                                    <h3>Message Sent!</h3>
                                    <p>Thanks for reaching out. We'll review your message and get back to you within 24 hours with next steps.</p>
                                    <button onClick={() => setSubmitted(false)} className="btn btn-secondary" style={{ marginTop: '20px' }}>Send Another</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="faq-section">
                <div className="container">
                    <div className="section-header">
                        <h2>Quick <span className="accent">Answers</span></h2>
                        <p>Common questions about working together.</p>
                    </div>
                    <div className="faq-grid">
                        <div className="faq-item"><h3>What does the process look like?</h3><p>We start with a call to understand your needs. Then we'll send a proposal with scope, timeline, and pricing. Once approved, we build in sprints with regular check-ins.</p></div>
                        <div className="faq-item"><h3>How long does a project take?</h3><p>Simple tools: 1-2 weeks. Full applications: 2-4 weeks. Complex platforms: 4-8 weeks. We'll give you a realistic timeline upfront.</p></div>
                        <div className="faq-item"><h3>What's the typical cost?</h3><p>Quick tools start around $1,500. Full applications typically run $5,000-15,000. Complex projects vary. We quote fixed prices.</p></div>
                        <div className="faq-item"><h3>Do I need to know exactly what I want?</h3><p>Not at all. You need to know the problem. We'll help you figure out the solution—that's part of what we do.</p></div>
                        <div className="faq-item"><h3>What if I need changes later?</h3><p>Expected! We build modular code that's easy to modify. Post-launch changes are either hourly or quoted as small add-ons.</p></div>
                        <div className="faq-item"><h3>Do you offer ongoing support?</h3><p>All projects include 30-90 days of bug fixes and support (depending on size). Ongoing maintenance packages are available.</p></div>
                    </div>
                </div>
            </section>
        </>
    );
}
