import { Outlet, NavLink } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function DocsLayout() {
    const links = [
        { title: 'Getting Started', to: '/docs/getting-started' },
        { title: 'WhitTech OS', to: '/docs/os' },
        { title: 'API Reference', to: '/docs/api' },
        { title: 'SDKs', to: '/docs/sdks' },
        { title: 'Security', to: '/docs/security' },
        { title: 'Changelog', to: '/docs/changelog' },
    ];

    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '80px', minHeight: '100vh', display: 'flex' }}>
                {/* Sidebar */}
                <aside style={{ width: '280px', flexShrink: 0, borderRight: '1px solid rgba(0, 212, 255, 0.1)', background: '#030508', position: 'fixed', top: '80px', bottom: 0, overflowY: 'auto' }}>
                    <div style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: '#64748b', marginBottom: '16px' }}>Documentation</h3>
                        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            {links.map(link => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => isActive ? 'docs-nav-icon active' : 'docs-nav-link'}
                                    style={({ isActive }) => ({
                                        display: 'block',
                                        padding: '8px 12px',
                                        color: isActive ? '#00d4ff' : '#94a3b8',
                                        fontSize: '14px',
                                        textDecoration: 'none',
                                        borderRadius: '6px',
                                        background: isActive ? 'rgba(0, 212, 255, 0.1)' : 'transparent',
                                        transition: 'all 0.2s',
                                    })}
                                >
                                    {link.title}
                                </NavLink>
                            ))}
                        </nav>
                    </div>

                    <div style={{ padding: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                        <div style={{ padding: '16px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' }}>Need Help?</div>
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>Our engineers are ready to assist you.</p>
                            <a href="/contact" style={{ display: 'block', textAlign: 'center', background: '#6366f1', color: '#fff', fontSize: '12px', padding: '6px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>Contact Support</a>
                        </div>
                    </div>
                </aside>

                {/* Content */}
                <main style={{ marginLeft: '280px', flex: 1, minWidth: 0 }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '48px' }}>
                        <Outlet />
                    </div>
                    <Footer />
                </main>
            </div>

            {/* Mobile Styles Override (Basic) */}
            <style>{`
        @media (max-width: 768px) {
            aside { display: none; }
            main { margin-left: 0 !important; }
        }
      `}</style>
        </>
    );
}
