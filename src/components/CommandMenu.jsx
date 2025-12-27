import { Command } from 'cmdk';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, Zap, Layout, Code, Phone, Home, Layers, Book, Activity, Building, Briefcase } from 'lucide-react';

export default function CommandMenu() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // Toggle with Ctrl+K or Cmd+K
    useEffect(() => {
        const down = (e) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command) => {
        setOpen(false);
        command();
    };

    const toggleMatrixMode = () => {
        document.body.classList.toggle('matrix-mode');
    };

    if (!open) return null;

    return (
        <div className="command-menu-overlay" onClick={() => setOpen(false)}>
            <div className="command-menu-wrapper" onClick={(e) => e.stopPropagation()}>
                <Command label="Global Command Menu" className="command-menu">
                    <div className="command-search-wrapper">
                        <Terminal size={18} color="#00d4ff" />
                        <Command.Input placeholder="Type a command or search..." />
                    </div>

                    <Command.List>
                        <Command.Empty>No results found.</Command.Empty>

                        <Command.Group heading="Navigation">
                            <Command.Item onSelect={() => runCommand(() => navigate('/'))}>
                                <Home size={16} /> Home
                            </Command.Item>
                            <Command.Item onSelect={() => runCommand(() => navigate('/playground'))}>
                                <Code size={16} /> Playground
                            </Command.Item>
                            <Command.Item onSelect={() => runCommand(() => navigate('/portal'))}>
                                <Layout size={16} /> Client Portal
                            </Command.Item>
                            <Command.Item onSelect={() => runCommand(() => navigate('/projects'))}>
                                <Layers size={16} /> Projects
                            </Command.Item>
                            <Command.Item onSelect={() => runCommand(() => navigate('/contact'))}>
                                <Phone size={16} /> Contact
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="Resources">
                            <Command.Item onSelect={() => runCommand(() => navigate('/docs'))}>
                                <Book size={16} /> Documentation
                            </Command.Item>
                            <Command.Item onSelect={() => runCommand(() => navigate('/status'))}>
                                <Activity size={16} /> System Status
                            </Command.Item>
                            <Command.Item onSelect={() => runCommand(() => navigate('/enterprise'))}>
                                <Building size={16} /> Enterprise
                            </Command.Item>
                            <Command.Item onSelect={() => runCommand(() => navigate('/careers'))}>
                                <Briefcase size={16} /> Careers
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="System Overrides">
                            <Command.Item onSelect={() => runCommand(toggleMatrixMode)}>
                                <Zap size={16} color="#10b981" /> Toggle Matrix Mode
                            </Command.Item>
                            <Command.Item onSelect={() => runCommand(() => window.open('https://github.com/justinw916-sketch', '_blank'))}>
                                <Code size={16} /> View Source Intelligence
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>
        </div>
    );
}
