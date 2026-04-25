import { useRef, useState } from 'react';

export default function Magnetic({ children }) {
    const ref = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0, active: false });
    const isTouchDevice = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);

    const handleMouseMove = (e) => {
        if (isTouchDevice) return;
        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();
        
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        
        // Intensity of the magnetic pull
        setPosition({ x: middleX * 0.3, y: middleY * 0.3, active: true });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0, active: false });
    };

    const { x, y, active } = position;

    return (
        <div
            ref={ref}
            onMouseMove={!isTouchDevice ? handleMouseMove : undefined}
            onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined}
            style={{ position: 'relative' }}
        >
            <div
                style={{ 
                    transition: active ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: `translate(${x}px, ${y}px)`,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {children}
            </div>
        </div>
    );
}
