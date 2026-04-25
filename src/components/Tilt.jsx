import { useRef, useState } from 'react';

export default function Tilt({ children }) {
    const ref = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e) => {
        const { clientX, clientY } = e;
        const { width, height, left, top } = ref.current.getBoundingClientRect();
        
        const x = (clientX - left) / width - 0.5;
        const y = (clientY - top) / height - 0.5;
        
        setTilt({ x: x * 15, y: y * -15 }); // 15 degrees max tilt
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                perspective: '1000px',
                transition: 'transform 0.1s ease-out',
                transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
            }}
        >
            {children}
        </div>
    );
}
