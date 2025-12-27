import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer>
            <div className="footer-grid">
                <div className="footer-brand">
                    <Link to="/" className="logo">
                        <div className="logo-hex"><span>W</span></div>
                        <span className="logo-text">WHITTECH<span>.AI</span></span>
                    </Link>
                    <p>Custom software for construction companies, startups, and small businesses. Fast turnaround. Fair pricing. Built exactly how you need it.</p>
                </div>
                <div className="footer-links">
                    <h4>Navigation</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/services">Services</Link></li>
                        <li><Link to="/projects">Projects</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Services</h4>
                    <ul>
                        <li><Link to="/services">Estimation Tools</Link></li>
                        <li><Link to="/services">Project Management</Link></li>
                        <li><Link to="/services">Mobile Apps</Link></li>
                        <li><Link to="/services">AI Automation</Link></li>
                    </ul>
                </div>
                <div className="footer-links">
                    <h4>Work With Us</h4>
                    <ul>
                        <li><Link to="/contact">Get a Quote</Link></li>
                        <li><Link to="/projects">See Examples</Link></li>
                        <li><Link to="/about">Our Process</Link></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2025 WhitTech.AI. All rights reserved. *Hosting costs may apply for web applications.</p>
                <div className="social-links">
                    <a href="#" className="social-link" title="GitHub">GH</a>
                    <a href="#" className="social-link" title="LinkedIn">in</a>
                    <a href="#" className="social-link" title="X/Twitter">X</a>
                </div>
            </div>
        </footer>
    );
}
