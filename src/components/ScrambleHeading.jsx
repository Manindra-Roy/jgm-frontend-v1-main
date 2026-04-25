import { useRef, useEffect, useState } from 'react';
import useScrambleText from '../hooks/useScrambleText';

export default function ScrambleHeading({ text, className }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const ref = useRef(null);
    const scrambledText = useScrambleText(text, isRevealed);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsRevealed(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <h3 className={className} ref={ref}>
            {scrambledText}
        </h3>
    );
}
