import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-inner">
                    <NavLink to="/" className="logo">
                        <img src="/logo.jpg" alt="WhitTech Logo" style={{ height: '55px', width: '55px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span className="logo-text">WHITTECH<span>.AI</span></span>
                    </NavLink>

                    <ul className="nav-links">
                        <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink></li>
                        <li><Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>About</Link></li>
                        <li><Link to="/docs" className={location.pathname.startsWith('/docs') ? 'active' : ''}>Docs</Link></li>
                        <li><Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link></li>
                        <li><NavLink to="/projects" className={({ isActive }) => isActive ? "active" : ""}>Projects</NavLink></li>
                        <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>Contact</NavLink></li>
                        <li><NavLink to="/playground" className={({ isActive }) => isActive ? "active" : ""}>Playground</NavLink></li>
                        <li><NavLink to="/portal" className="btn-portal" style={{ color: '#00d4ff' }}>Portal</NavLink></li>
                    </ul>

                    <button className={`mobile-toggle ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
                <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
                <NavLink to="/about" onClick={() => setIsOpen(false)}>About</NavLink>
                <NavLink to="/services" onClick={() => setIsOpen(false)}>Services</NavLink>
                <NavLink to="/projects" onClick={() => setIsOpen(false)}>Projects</NavLink>
                <NavLink to="/contact" onClick={() => setIsOpen(false)}>Contact</NavLink>
                <NavLink to="/portal" onClick={() => setIsOpen(false)} style={{ color: '#00d4ff' }}>Client Portal</NavLink>
            </div>
        </>
    );
}
