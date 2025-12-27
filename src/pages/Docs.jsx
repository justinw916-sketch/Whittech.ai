import { Terminal } from 'lucide-react';

export default function Docs() {
    return (
        <div className="docs-content">
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '40px', marginBottom: '16px' }}>Getting Started</h1>
                <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: '1.7' }}>
                    Welcome to the WhitTech Platform documentation. This guide will help you integrate our operating system into your construction or business workflow.
                </p>
            </div>

            <div style={{ marginBottom: '48px' }}>
                <h2>Quick Install</h2>
                <p style={{ color: '#94a3b8', marginBottom: '16px' }}>Install the WhitTech CLI to manage your cloud resources.</p>

                <div style={{ background: '#0d1117', border: '1px solid #30363d', borderRadius: '8px', padding: '16px', fontFamily: 'Share Tech Mono', color: '#e6edf3', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Terminal size={16} color="#64748b" />
                    <span>npm install -g @whittech/cli</span>
                </div>
            </div>

            <div style={{ marginBottom: '48px' }}>
                <h2>Core Concepts</h2>
                <p style={{ color: '#94a3b8', lineHeight: '1.7', marginBottom: '24px' }}>
                    The WhitTech Platform is built on three core pillars designed to maximize efficiency and minimize overhead.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <Concept title="Workspaces" desc="Isolated environments for your different projects or clients." />
                    <Concept title="Blueprints" desc="Pre-configured templates for common construction workflows." />
                    <Concept title="Connectors" desc="Integrations with Procore, QuickBooks, and more." />
                    <Concept title="Functions" desc="Serverless compute for custom data processing." />
                </div>
            </div>

            <style>{`
        .docs-content h2 { font-size: 24px; margin-bottom: 16px; margin-top: 32px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; }
      `}</style>
        </div>
    );
}

function Concept({ title, desc }) {
    return (
        <div style={{ padding: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px', color: '#00d4ff' }}>{title}</h3>
            <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6' }}>{desc}</p>
        </div>
    );
}
