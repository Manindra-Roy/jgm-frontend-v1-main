import { useRef, useState } from 'react';
import './PremiumButton.css';

export default function PremiumButton({ children, onClick, className = '', variant = 'dark', disabled = false, type = 'button' }) {
    const buttonRef = useRef(null);
    const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        setGlowPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const variantClass = variant === 'gold' ? 'btn-premium-gold' : 
                         variant === 'outline' ? 'btn-outline-premium' : '';
    
    const sizeClass = className.includes('btn-sm') ? 'btn-sm' : '';

    return (
        <button
            ref={buttonRef}
            type={type}
            className={`btn-premium ${variantClass} ${sizeClass} ${className}`}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            disabled={disabled}
        >
            <span 
                className="btn-glow" 
                style={{ 
                    left: `${glowPos.x}px`, 
                    top: `${glowPos.y}px` 
                }}
            ></span>
            <span className="btn-text">{children}</span>
        </button>
    );
}
