import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ConsentManager.css';

export default function ConsentManager() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already consented
        const hasConsented = localStorage.getItem('jgm_cookie_consent');
        if (!hasConsented) {
            // Slight delay to not overwhelm the initial load animation
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('jgm_cookie_consent', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="cookie-banner-wrapper">
            <div className="cookie-banner-content">
                <div className="cookie-text">
                    <p>
                        We use cookies to elevate your browsing experience, analyze site traffic, and serve tailored content. 
                        By continuing to navigate our platform, you consent to our use of cookies as detailed in our <Link to="/privacy">Privacy Policy</Link>.
                    </p>
                </div>
                <div className="cookie-actions">
                    <button className="cookie-accept-btn" onClick={handleAccept}>
                        AGREE & CONTINUE
                    </button>
                </div>
            </div>
        </div>
    );
}
