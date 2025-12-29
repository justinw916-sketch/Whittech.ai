import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Maximize2, Minimize2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

// Update this URL once the CRM is deployed to Cloudflare
const CRM_DEMO_URL = 'https://crm-demo.justinw916.workers.dev';

export default function CRMDemo() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showInfo, setShowInfo] = useState(true);

    return (
        <div style={{
            minHeight: '100vh',
            paddingTop: isFullscreen ? '0' : '80px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header Bar */}
            {!isFullscreen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                        padding: '16px 24px',
                        background: 'rgba(13, 18, 25, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        position: 'sticky',
                        top: '80px',
                        zIndex: 10
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link
                            to="/projects"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#94a3b8',
                                textDecoration: 'none',
                                fontSize: '14px',
                                transition: 'color 0.2s'
                            }}
                        >
                            <ArrowLeft size={18} />
                            Back to Projects
                        </Link>
                        <div style={{
                            width: '1px',
                            height: '20px',
                            background: 'rgba(255, 255, 255, 0.1)'
                        }} />
                        <div>
                            <h1 style={{
                                fontSize: '16px',
                                fontWeight: '600',
                                margin: 0,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                Sales Pipeline CRM
                                <span style={{
                                    padding: '3px 8px',
                                    background: 'rgba(16, 185, 129, 0.2)',
                                    color: '#10b981',
                                    borderRadius: '4px',
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    textTransform: 'uppercase'
                                }}>
                                    Live Demo
                                </span>
                            </h1>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                            onClick={() => setShowInfo(!showInfo)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                background: showInfo ? 'rgba(0, 212, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(0, 212, 255, 0.2)',
                                borderRadius: '6px',
                                color: showInfo ? '#00d4ff' : '#94a3b8',
                                fontSize: '13px',
                                cursor: 'pointer'
                            }}
                        >
                            <Info size={14} />
                            Info
                        </button>
                        <button
                            onClick={() => setIsFullscreen(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '6px',
                                color: '#94a3b8',
                                fontSize: '13px',
                                cursor: 'pointer'
                            }}
                        >
                            <Maximize2 size={14} />
                            Fullscreen
                        </button>
                        <a
                            href={CRM_DEMO_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                background: 'linear-gradient(135deg, #00d4ff, #00a8cc)',
                                borderRadius: '6px',
                                color: '#030508',
                                fontSize: '13px',
                                fontWeight: '600',
                                textDecoration: 'none'
                            }}
                        >
                            <ExternalLink size={14} />
                            Open in New Tab
                        </a>
                    </div>
                </motion.div>
            )}

            {/* Info Banner */}
            {showInfo && !isFullscreen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                        padding: '16px 24px',
                        background: 'linear-gradient(90deg, rgba(0, 212, 255, 0.08), rgba(99, 102, 241, 0.08))',
                        borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '24px'
                    }}
                >
                    <p style={{
                        margin: 0,
                        fontSize: '13px',
                        color: '#94a3b8',
                        textAlign: 'center'
                    }}>
                        <strong style={{ color: '#fff' }}>Interactive Demo:</strong> This is a fully functional CRM.
                        Data is stored in your browser's local storage. Try adding leads, managing your pipeline, and exploring the analytics!
                    </p>
                    <button
                        onClick={() => setShowInfo(false)}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            fontSize: '18px',
                            padding: '4px'
                        }}
                    >
                        ×
                    </button>
                </motion.div>
            )}

            {/* Fullscreen Exit Button */}
            {isFullscreen && (
                <button
                    onClick={() => setIsFullscreen(false)}
                    style={{
                        position: 'fixed',
                        top: '16px',
                        right: '16px',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                >
                    <Minimize2 size={14} />
                    Exit Fullscreen
                </button>
            )}

            {/* Iframe Container */}
            <div style={{
                flex: 1,
                position: isFullscreen ? 'fixed' : 'relative',
                top: isFullscreen ? 0 : 'auto',
                left: isFullscreen ? 0 : 'auto',
                right: isFullscreen ? 0 : 'auto',
                bottom: isFullscreen ? 0 : 'auto',
                zIndex: isFullscreen ? 999 : 1,
                background: '#0a0a0a'
            }}>
                <iframe
                    src={CRM_DEMO_URL}
                    title="Sales Pipeline CRM Demo"
                    style={{
                        width: '100%',
                        height: isFullscreen ? '100vh' : 'calc(100vh - 240px)',
                        minHeight: '600px',
                        border: 'none',
                        display: 'block'
                    }}
                    allow="clipboard-read; clipboard-write"
                />
            </div>
        </div>
    );
}
