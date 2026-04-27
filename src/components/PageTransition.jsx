import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition({ children }) {
    const location = useLocation();
    const [displayLocation, setDisplayLocation] = useState(location);
    const [transitionStage, setTransitionStage] = useState('idle');

    useEffect(() => {
        if (location.pathname !== displayLocation.pathname) {
            setTransitionStage('wiping');
            
            // Sync the content switch with the shutter's "fully closed" state
            // Animation is 1.2s total, so 0.6s is the peak coverage point.
            const timer = setTimeout(() => {
                setDisplayLocation(location);
                window.scrollTo(0, 0);
            }, 600);

            return () => clearTimeout(timer);
        }
    }, [location, displayLocation.pathname]);

    const handleAnimationEnd = (e) => {
        if (e.animationName === 'shutterWipe') {
            setTransitionStage('idle');
        }
    };

    return (
        <div className={`page-transition-wrapper ${transitionStage}`}>
            {/* Minimal Premium Navigation Loader */}
            <div className="navigation-progress"></div>
            
            <div className="shutter-layer" onAnimationEnd={handleAnimationEnd}>
                <div className="navigation-mark">
                    <svg viewBox="0 0 100 100">
                        <path d="M50 20C50 20 70 40 70 60C70 71.0457 61.0457 80 50 80C38.9543 80 30 71.0457 30 60C30 40 50 20 50 20Z" fill="none" stroke="var(--accent-gold)" strokeWidth="1" />
                    </svg>
                </div>
            </div>
            
            <div className="page-content">
                {typeof children === 'function' ? children(displayLocation) : children}
            </div>
        </div>
    );
}
