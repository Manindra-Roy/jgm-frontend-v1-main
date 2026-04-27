import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
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

    // Body Scroll Lock
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileMenuOpen]);

    const mobileMenuContent = (
        <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
            <div className="mobile-overlay-header">
                <span className="mobile-brand">JGM<span>.</span></span>
                <div className="mobile-close" onClick={closeMenu}>
                    <span>CLOSE</span>
                    <div className="close-line"></div>
                </div>
            </div>

            <div className="mobile-nav-links">
                {[
                    { name: 'HOME', path: '/' },
                    { name: 'ABOUT', path: '/about' },
                    { name: 'PRODUCTS', path: '/products' },
                    { name: 'CONTACT', path: '/contact' },
                    { name: isAuthenticated ? 'PROFILE' : 'LOGIN', path: isAuthenticated ? '/profile' : '/login' }
                ].map((link, index) => (
                    <Link 
                        key={link.name} 
                        to={link.path} 
                        className="mobile-nav-item" 
                        onClick={closeMenu}
                        style={{ '--item-index': index }}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            <div className="mobile-overlay-footer">
                <div className="mobile-contact-info">
                    <p>CARE: 62962-63480</p>
                    <p>jgmindustriesofficial@gmail.com</p>
                </div>
                <div className="mobile-socials">
                    <span>INSTAGRAM</span>
                    <span>FACEBOOK</span>
                </div>
            </div>
        </div>
    );

    return (
        <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''} ${isMobileMenuOpen ? 'menu-open' : ''}`}>
            {!isMobileMenuOpen && (
                <div className="nav-container">
                    {/* 1. LINKS LEFT */}
                    <div className="nav-links-left">
                        <Link to="/" className="nav-item">HOME</Link>
                        <Link to="/about" className="nav-item">ABOUT</Link>
                        <Link to="/products" className="nav-item">PRODUCTS</Link>
                        <Link to="/contact" className="nav-item">CONTACT</Link>
                    </div>

                    {/* 3. LINKS RIGHT & AUTH */}
                    <div className="nav-links-right">
                        {isAuthenticated ? (
                            <button className="nav-auth-btn" onClick={() => navigate('/profile')}>PROFILE</button>
                        ) : (
                            <button className="nav-auth-btn" onClick={() => navigate('/login')}>LOGIN</button>
                        )}
                    </div>

                    {/* 4. MOBILE TOGGLE */}
                    <div className="mobile-toggle" onClick={toggleMenu}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                            <rect y="8" width="30" height="1.5" fill="var(--primary-emerald)"/>
                            <rect y="20" width="30" height="1.5" fill="var(--primary-emerald)"/>
                        </svg>
                    </div>
                </div>
            )}

            {/* Render Mobile Menu through Portal */}
            {createPortal(mobileMenuContent, document.body)}
        </nav>
    );
}