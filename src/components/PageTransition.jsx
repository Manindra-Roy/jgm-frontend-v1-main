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
        }
    }, [location, displayLocation.pathname]);

    const handleAnimationEnd = (e) => {
        // Only trigger on the main wrapper's animation
        if (e.animationName === 'shutterWipe') {
            setTransitionStage('idle');
            setDisplayLocation(location);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className={`page-transition-wrapper ${transitionStage}`}>
            {/* The Cinematic Shutter Layer */}
            <div 
                className="shutter-layer" 
                onAnimationEnd={handleAnimationEnd}
            ></div>
            
            <div className="page-content">
                {children}
            </div>
        </div>
    );
}
