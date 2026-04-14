/**
 * @fileoverview Global Navigation Bar Component.
 * Provides responsive navigation, mobile side-drawer functionality,
 * and dynamic rendering based on the user's authentication status.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhoneAlt, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import brandLogo from '../assets/brand-logo.png';
import './Navbar.css';

/**
 * Navbar Component
 * @returns {JSX.Element} The rendered navigation bar.
 */
export default function Navbar() {
    const navigate = useNavigate();
    
    // Determine auth state to toggle "Join Us" vs "My Profile" buttons
    const isAuthenticated = localStorage.getItem('is_customer_authenticated') === 'true';
    
    // State to manage the mobile slide-out menu
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    /**
     * Toggles the visibility of the mobile menu side-drawer.
     */
    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    /**
     * Closes the mobile menu. Passed to all navigation links to ensure 
     * the drawer closes automatically after a user makes a selection.
     */
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className="jgm-navbar">
            {/* LOGO - Always visible */}
            <div className="nav-logo-container">
                <Link to="/" onClick={closeMenu}>
                    <img src={brandLogo} alt="JGM Industries" className="nav-logo" />
                </Link>
            </div>

            {/* HAMBURGER ICON - Only visible on mobile screens via CSS */}
            <div className="hamburger-icon" onClick={toggleMenu}>
                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </div>
            
            {/* DARK OVERLAY - Captures clicks outside the menu to close it */}
            {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMenu}></div>}

            {/* MENU WRAPPER - Slides in on mobile, renders inline horizontally on desktop */}
            <div className={`nav-menu-wrapper ${isMobileMenuOpen ? 'active' : ''}`}>
                <div className="nav-links">
                    <Link to="/" onClick={closeMenu}>HOME</Link>
                    <Link to="/about" onClick={closeMenu}>ABOUT Us</Link>
                    <Link to="/products" onClick={closeMenu}>OUR PRODUCTS</Link>
                    <Link to="/contact" onClick={closeMenu}>CONTACT Us</Link>
                    <Link to="/certification" onClick={closeMenu}>CERTIFICATION</Link>
                </div>

                <div className="nav-right">
                    <span className="nav-phone"><FaPhoneAlt /> 76796-00984</span>
                    
                    {/* Dynamic Button Rendering based on Authentication State */}
                    {isAuthenticated ? (
                        <button 
                            className="join-us-btn" 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }} 
                            onClick={() => { navigate('/profile'); closeMenu(); }}
                        >
                            <FaUserCircle size={18} /> MY PROFILE
                        </button>
                    ) : (
                        <button 
                            className="join-us-btn" 
                            onClick={() => { navigate('/login'); closeMenu(); }}
                        >
                            JOIN Us
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}