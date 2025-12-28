import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// WhitTech.AI Knowledge Base - Customized responses
const knowledgeBase = {
    greetings: [
        "Hey there! 👋 I'm the WhitTech.AI assistant. I can answer questions about our custom software services. What would you like to know?",
        "Welcome to WhitTech.AI! I'm here to help you learn about our services. What can I help you with today?"
    ],

    services: {
        keywords: ['services', 'offer', 'do you do', 'what can you', 'help with', 'build'],
        response: `We specialize in **custom software solutions** for businesses:

🔧 **Estimation & Bidding Tools** - Custom calculators and bid generators
📋 **Project Management Apps** - Track jobs, crews, and budgets
📱 **Field & Mobile Tools** - Real-time syncing for on-site work
🤖 **AI-Powered Automation** - Document processing & smart alerts
🔗 **System Integrations** - Connect QuickBooks, CRMs, and more

Would you like details on any of these? Or tell me about YOUR project!`
    },

    pricing: {
        keywords: ['cost', 'price', 'pricing', 'how much', 'expensive', 'budget', 'afford', 'quote'],
        response: `Great question! Our pricing is **transparent and project-based**:

💰 **No monthly fees** - You own the code outright
📊 **Fixed quotes** - No surprise bills or scope creep
💵 **Typical range**: $2,000 - $15,000 depending on complexity

We offer a **FREE consultation** to discuss your needs and give you an accurate quote. Want me to help you schedule one?`
    },

    timeline: {
        keywords: ['how long', 'timeline', 'time', 'fast', 'quick', 'weeks', 'months', 'turnaround'],
        response: `We move FAST because we've built similar tools before:

⚡ **Simple tools**: 1-2 weeks
📊 **Standard apps**: 2-4 weeks  
🚀 **Complex systems**: 4-8 weeks

Most projects are delivered in **2-4 weeks**. You'll see daily progress with access to a private staging environment. Ready to get started?`
    },

    process: {
        keywords: ['process', 'how does it work', 'get started', 'start', 'begin', 'next step'],
        response: `Here's our simple 3-step process:

**1️⃣ Discovery Call** (Free, 30 min)
Tell us about your workflow challenges. We'll map out a solution together.

**2️⃣ Blueprint & Quote**
You get a detailed spec document and fixed-price quote within 48 hours.

**3️⃣ Rapid Build**
We build it fast. You see daily progress. Launch when you're happy.

Want to schedule that discovery call? Just share your email and I'll have someone reach out!`
    },

    construction: {
        keywords: ['construction', 'contractor', 'builder', 'trade', 'field', 'jobsite', 'crew'],
        response: `You're in the right place! 🏗️ WhitTech.AI was **built for the construction industry**.

Our founder spent 18+ years in the field - installing systems, managing projects, and dealing with the same operational headaches you face.

We've built tools for:
- General Contractors
- Specialty Trades (HVAC, Electrical, Plumbing)
- Construction Estimators
- Field Operations Teams

What specific challenge are you trying to solve?`
    },

    integration: {
        keywords: ['integrate', 'integration', 'connect', 'quickbooks', 'excel', 'google', 'crm', 'api'],
        response: `Absolutely! We're integration experts. We can connect:

✅ **QuickBooks** (Online & Desktop)
✅ **Google Sheets/Drive**
✅ **Salesforce, HubSpot, and other CRMs**
✅ **Supplier catalogs & pricing databases**
✅ **Custom APIs**

If your current tools don't talk to each other, we can fix that. What systems are you trying to connect?`
    },

    contact: {
        keywords: ['contact', 'email', 'phone', 'call', 'reach', 'talk', 'speak', 'human'],
        response: `I'd love to connect you with our team! Here's how:

📧 **Email**: jwhitton@zoho.com
📅 **Schedule a Call**: Visit our Contact page

Or just tell me your email right here and we'll reach out within 24 hours! What works best for you?`
    },

    fallback: [
        "Interesting question! I'm still learning, but I'd love to help. Could you rephrase that, or would you prefer to speak with our team directly?",
        "I want to make sure I give you the right answer. Could you tell me more about what you're looking for?",
        "Great question! For detailed inquiries like this, I'd recommend scheduling a quick call with our team. Want me to help you set that up?"
    ]
};

// Simple pattern matching
function getResponse(message) {
    const lower = message.toLowerCase();

    // Check each category
    for (const [key, data] of Object.entries(knowledgeBase)) {
        if (key === 'greetings' || key === 'fallback') continue;
        if (data.keywords && data.keywords.some(kw => lower.includes(kw))) {
            return data.response;
        }
    }

    // Greetings
    if (['hi', 'hello', 'hey', 'sup', 'yo', 'good morning', 'good afternoon'].some(g => lower.includes(g))) {
        return knowledgeBase.greetings[Math.floor(Math.random() * knowledgeBase.greetings.length)];
    }

    // Fallback
    return knowledgeBase.fallback[Math.floor(Math.random() * knowledgeBase.fallback.length)];
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: knowledgeBase.greetings[0] }
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

    const handleSend = () => {
        if (!input.trim()) return;

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: input }]);
        const userMessage = input;
        setInput('');

        // Simulate typing
        setIsTyping(true);
        setTimeout(() => {
            const response = getResponse(userMessage);
            setMessages(prev => [...prev, { role: 'bot', content: response }]);
            setIsTyping(false);
        }, 800 + Math.random() * 700);
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 20px rgba(0, 212, 255, 0.4)',
                    zIndex: 1000,
                }}
            >
                {isOpen ? <X size={28} color="#030508" /> : <MessageCircle size={28} color="#030508" />}
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
                                <div style={{ fontWeight: '600', color: '#fff' }}>WhitTech Assistant</div>
                                <div style={{ fontSize: '12px', color: '#00d4ff' }}>● Online</div>
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
                                        maxWidth: '80%',
                                        padding: '12px 16px',
                                        borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                        background: msg.role === 'user'
                                            ? 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)'
                                            : 'rgba(255, 255, 255, 0.05)',
                                        color: msg.role === 'user' ? '#030508' : '#fff',
                                        fontSize: '14px',
                                        lineHeight: '1.5',
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
                                style={{
                                    flex: 1,
                                    padding: '12px 16px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid rgba(0, 212, 255, 0.2)',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    fontSize: '14px',
                                    outline: 'none',
                                }}
                            />
                            <button
                                onClick={handleSend}
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #00d4ff 0%, #00a8cc 100%)',
                                    border: 'none',
                                    cursor: 'pointer',
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
