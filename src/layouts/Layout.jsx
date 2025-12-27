import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CommandMenu from '../components/CommandMenu';
import { useEffect } from 'react';

export default function Layout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <>
            <div className="bg-grid"></div>
            <div className="bg-glow bg-glow-1"></div>
            <div className="bg-glow bg-glow-2"></div>

            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
            <CommandMenu />
        </>
    );
}
