/**
 * @fileoverview Global Navigation Bar Component.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaPhoneAlt, FaUserCircle } from 'react-icons/fa';
import brandLogo from '../assets/brand-logo.png';
import Magnetic from './Magnetic';
import PremiumButton from './PremiumButton';
import './Navbar.css';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const isHome = location.pathname === '/';
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    useEffect(() => {
        setIsAuthenticated(localStorage.getItem('is_customer_authenticated') === 'true');
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        
        // --- A11y: Focus Trap & Scroll Lock ---
        const handleKeyDown = (e) => {
            if (!isMobileMenuOpen || e.key !== 'Tab') return;
            
            const focusableElements = document.querySelectorAll('.nav-menu-wrapper.active a, .nav-menu-wrapper.active button');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) { // Shift + Tab
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else { // Tab
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        };

        if (isMobileMenuOpen) {
            document.documentElement.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
            // Auto-focus first link when menu opens
            setTimeout(() => {
                const firstLink = document.querySelector('.nav-links a');
                if (firstLink) firstLink.focus();
            }, 100);
        } else {
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'visible';
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'visible';
        };
    }, [location, isMobileMenuOpen]);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className={`jgm-navbar ${isScrolled ? 'scrolled' : ''} ${isHome ? 'on-home' : ''} ${isAuthPage ? 'on-auth' : ''}`}>
            <div className="nav-logo-container">
                <Link to="/" onClick={closeMenu} aria-label="Go to Home Page">
                    <img src={brandLogo} alt="JGM Industries" className="nav-logo" />
                </Link>
            </div>

            <button 
                className={`hamburger-premium ${isMobileMenuOpen ? 'open' : ''}`} 
                onClick={toggleMenu}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
            >
                <div className="burger-line line-1"></div>
                <div className="burger-line line-2"></div>
                <div className="burger-line line-3"></div>
            </button>
            
            {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMenu} aria-hidden="true"></div>}

            <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="nav-links">
                    <Magnetic><Link to="/" onClick={closeMenu}>HOME</Link></Magnetic>
                    <Magnetic><Link to="/about" onClick={closeMenu}>ABOUT Us</Link></Magnetic>
                    <Magnetic><Link to="/products" onClick={closeMenu}>OUR PRODUCTS</Link></Magnetic>
                    <Magnetic><Link to="/contact" onClick={closeMenu}>CONTACT Us</Link></Magnetic>
                    <Magnetic><Link to="/certification" onClick={closeMenu}>CERTIFICATION</Link></Magnetic>
                </div>

                <div className="nav-right">
                    <span className="nav-phone"><FaPhoneAlt aria-hidden="true" /> 76796-00984</span>
                    
                    {isAuthenticated ? (
                        <PremiumButton 
                            className="btn-sm" 
                            variant="gold"
                            onClick={() => { navigate('/profile'); closeMenu(); }}
                            aria-label="View Profile"
                        >
                            <FaUserCircle size={18} /> MY PROFILE
                        </PremiumButton>
                    ) : (
                        <PremiumButton 
                            className="btn-sm" 
                            variant="gold"
                            onClick={() => { navigate('/login'); closeMenu(); }}
                            aria-label="Login or Join Us"
                        >
                            JOIN Us
                        </PremiumButton>
                    )}
                </div>
            </div>
        </nav>
    );
}