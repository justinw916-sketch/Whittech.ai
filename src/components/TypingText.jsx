import { useState, useEffect } from 'react';

export default function TypingText({ text, speed = 100, delay = 0 }) {
    const [displayedText, setDisplayedText] = useState('');
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setStarted(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useEffect(() => {
        if (!started) return;

        let index = 0;
        const interval = setInterval(() => {
            if (index < text.length) {
                setDisplayedText((prev) => prev + text.charAt(index));
                index++;
            } else {
                clearInterval(interval);
            }
        }, speed);

        return () => clearInterval(interval);
    }, [started, text, speed]);

    return (
        <span style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            {displayedText}
            <span className="cursor" style={{ animation: 'blink 1s step-end infinite' }}>|</span>
            <style>{`
        @keyframes blink { 50% { opacity: 0; } }
      `}</style>
        </span>
    );
}
