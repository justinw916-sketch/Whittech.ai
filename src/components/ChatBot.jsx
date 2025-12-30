import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Fallback responses for when AI is unavailable
const fallbackResponses = [
    "I'm having trouble connecting right now. Please email us at admin@whittech.ai or visit our Contact page!",
    "Hmm, I couldn't process that. You can reach our team directly at admin@whittech.ai.",
];

const INITIAL_MESSAGE = "Hey there! 👋 I'm the WhitTech.AI assistant, powered by AI. Ask me anything about our custom software services, pricing, timeline, or how we can help your business!";

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: INITIAL_MESSAGE }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');

        // Add user message
        const newMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(newMessages);

        // Show typing indicator
        setIsTyping(true);

        try {
            // Call Cloudflare Workers AI
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages.slice(-10) // Send last 10 messages for context
                }),
            });

            if (!response.ok) {
                throw new Error('AI service unavailable');
            }

            const data = await response.json();

            if (data.fallback || !data.response) {
                throw new Error('Fallback needed');
            }

            setMessages(prev => [...prev, { role: 'bot', content: data.response }]);

        } catch (error) {
            console.error('Chat error:', error);
            // Use fallback response
            const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
            setMessages(prev => [...prev, { role: 'bot', content: fallback }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    padding: isOpen ? '14px' : '14px 24px',
                    borderRadius: isOpen ? '50%' : '30px',
                    background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
                    zIndex: 1000,
                    fontFamily: "'Exo 2', sans-serif",
                    fontWeight: '600',
                    fontSize: '15px',
                    color: '#030508',
                }}
            >
                {isOpen ? <X size={24} color="#030508" /> : (
                    <>
                        <MessageCircle size={20} color="#030508" />
                        Chat Now
                    </>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'fixed',
                            bottom: '100px',
                            right: '24px',
                            width: '380px',
                            maxWidth: 'calc(100vw - 48px)',
                            height: '500px',
                            maxHeight: 'calc(100vh - 150px)',
                            background: '#0d1219',
                            border: '1px solid rgba(0, 212, 255, 0.2)',
                            borderRadius: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
                            zIndex: 999,
                        }}
                    >
                        {/* Header */}
                        <div style={{
                            padding: '16px 20px',
                            background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
                            borderBottom: '1px solid rgba(0, 212, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                        }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #00d4ff 0%, #6366f1 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Bot size={24} color="#fff" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600', color: '#fff' }}>WhitTech AI Assistant</div>
                                <div style={{ fontSize: '12px', color: '#00d4ff' }}>● Powered by Llama</div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div style={{
                            flex: 1,
                            overflowY: 'auto',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                        }}>
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                    }}
                                >
                                    <div style={{
                                        maxWidth: '85%',
                                        padding: '12px 16px',
                                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        color: msg.role === 'user' ? '#030508' : '#fff',
                                        fontSize: '14px',
                                        lineHeight: '1.6',
                                        whiteSpace: 'pre-wrap',
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}

                            {isTyping && (
                                <div style={{ display: 'flex', gap: '4px', padding: '12px' }}>
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d4ff' }}
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d4ff' }}
                                    />
                                    <motion.div
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                        style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00d4ff' }}
                                    />
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div style={{
                            padding: '16px',
                            borderTop: '1px solid rgba(0, 212, 255, 0.1)',
                            display: 'flex',
                            gap: '12px',
                        }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask me anything..."
                                disabled={isTyping}
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(0, 212, 255, 0.2)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    outline: 'none',
                                    opacity: isTyping ? 0.5 : 1,
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isTyping || !input.trim()}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    background: isTyping ? 'rgba(0, 212, 255, 0.3)' : 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
                                    border: 'none',
                                    cursor: isTyping ? 'not-allowed' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Send size={20} color="#030508" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
