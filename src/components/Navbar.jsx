/**
 * @fileoverview Rebuilt Editorial Navbar (Silent Authority 4.0)
 * Synchronized with 'Invisible Quality' CSS.
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isAuthenticated = localStorage.getItem('is_customer_authenticated') === 'true';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
            <div className="nav-container">
                {/* 1. LINKS LEFT */}
                <div className="nav-links-left">
                    <Link to="/" className="nav-item" onClick={closeMenu}>HOME</Link>
                    <Link to="/about" className="nav-item" onClick={closeMenu}>ABOUT</Link>
                    <Link to="/products" className="nav-item" onClick={closeMenu}>PRODUCTS</Link>
                    <Link to="/contact" className="nav-item" onClick={closeMenu}>CONTACT</Link>
                </div>



                {/* 3. LINKS RIGHT & AUTH */}
                <div className="nav-links-right">
                    {isAuthenticated ? (
                        <button 
                            className="nav-auth-btn" 
                            onClick={() => { navigate('/profile'); closeMenu(); }}
                        >
                            PROFILE
                        </button>
                    ) : (
                        <button 
                            className="nav-auth-btn" 
                            onClick={() => { navigate('/login'); closeMenu(); }}
                        >
                            LOGIN
                        </button>
                    )}
                </div>

                {/* 4. MOBILE TOGGLE */}
                <div className="mobile-toggle" onClick={toggleMenu}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect y="8" width="30" height="1.5" fill="var(--primary-emerald)"/>
                        <rect y="20" width="30" height="1.5" fill="var(--primary-emerald)"/>
                    </svg>
                </div>
            </div>

            {/* MOBILE OVERLAY */}
            <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
                <Link to="/" className="mobile-nav-item" onClick={closeMenu}>HOME</Link>
                <Link to="/about" className="mobile-nav-item" onClick={closeMenu}>ABOUT</Link>
                <Link to="/products" className="mobile-nav-item" onClick={closeMenu}>PRODUCTS</Link>
                <Link to="/contact" className="mobile-nav-item" onClick={closeMenu}>CONTACT</Link>
                <Link to="/login" className="mobile-nav-item" onClick={closeMenu}>LOGIN</Link>
            </div>
        </nav>
    );
}