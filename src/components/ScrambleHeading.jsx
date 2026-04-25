import { useRef, useEffect, useState } from 'react';

export default function ScrambleHeading({ text, className }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <h2 
            className={`${className} reveal ${isVisible ? 'active' : ''}`} 
            ref={ref}
            style={{ transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
            {text}
        </h2>
    );
}
