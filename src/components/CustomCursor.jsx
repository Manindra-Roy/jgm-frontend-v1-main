import { useEffect, useState, useRef } from 'react';
import './CustomCursor.css';

export default function CustomCursor() {
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
    const [position, setPosition] = useState({ x: 0, y: 0, active: false });
    const [ringPosition, setRingPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    
    const requestRef = useRef();

    // Smooth spring physics simulation
    const animate = () => {
        setRingPosition(prev => ({
            x: prev.x + (position.x - prev.x) * 0.15,
            y: prev.y + (position.y - prev.y) * 0.15
        }));
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isTouchDevice) return;

        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY, active: true });
        };

        const handleMouseOver = (e) => {
            const target = e.target;
            if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        
        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            cancelAnimationFrame(requestRef.current);
        };
    }, [position]);

    if (isTouchDevice) return null;

    return (
        <div className={`custom-cursor-container ${isHovering ? 'hover' : ''} ${isClicking ? 'clicking' : ''}`}>
            <div 
                className="cursor-dot"
                style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
            ></div>
            <div 
                className="cursor-ring"
                style={{ transform: `translate3d(${ringPosition.x}px, ${ringPosition.y}px, 0)` }}
            ></div>
        </div>
    );
}
