/**
 * @fileoverview Initial Application Loading Screen.
 * Displays brand assets and a loading animation while the React application
 * boots up and resolves initial data dependencies.
 */

import brandLogo from '../assets/brand-logo.png';
import './Preloader.css';

/**
 * Preloader Component
 * Rendered globally by App.jsx during the initial 2-second loading phase.
 * @returns {JSX.Element} The rendered loading screen.
 */
export default function Preloader({ isAppLoading }) {
    return (
        <div className={`preloader-wrapper ${!isAppLoading ? 'closing' : ''}`}>
            <div className="preloader-content">
                {/* Pulsing Brand Logo */}
                <div className="logo-container">
                    <img src={brandLogo} alt="JGM Industries" className="preloader-logo" />
                </div>
                
                <h2 className="preloader-text">JGM INDUSTRIES</h2>
                
                {/* CSS Animated Progress Bar */}
                <div className="loading-bar-bg">
                    <div className="loading-bar-fill"></div>
                </div>
                
                <p className="preloader-subtext">Awakening Pure Wellness...</p>
            </div>
        </div>
    );
}