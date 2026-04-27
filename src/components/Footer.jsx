/**
 * @fileoverview Rebuilt God-Level Footer (Silent Authority 4.0)
 */

import { Link } from 'react-router-dom';
import { FaBuilding, FaPhoneAlt, FaEnvelope, FaHeadset, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-grid reveal">
                {/* 1. BRAND & MISSION */}
                <div className="footer-column brand-column">
                    <h2 className="footer-brand">JGM<span>.</span></h2>
                    <p className="footer-mission">
                        Awakening pure wellness through the ancient power of powerful, pure herbs. 
                        We architect health for the modern era.
                    </p>
                    <div className="footer-socials">
                        <a href="#" aria-label="Instagram"><FaInstagram /></a>
                        <a href="#" aria-label="Twitter"><FaTwitter /></a>
                        <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
                    </div>
                </div>

                {/* 2. QUICK NAVIGATION */}
                <div className="footer-column">
                    <h4 className="column-title">NAVIGATION</h4>
                    <ul className="footer-links">
                        <li><Link to="/">HOME</Link></li>
                        <li><Link to="/about">ABOUT</Link></li>
                        <li><Link to="/products">PRODUCTS</Link></li>
                        <li><Link to="/certification">CERTIFICATION</Link></li>
                        <li><Link to="/contact">CONTACT</Link></li>
                    </ul>
                </div>

                {/* 3. SUPPORT & SERVICES */}
                <div className="footer-column">
                    <h4 className="column-title">SUPPORT</h4>
                    <ul className="footer-links">
                        <li><Link to="/shipping">SHIPPING POLICY</Link></li>
                        <li><Link to="/returns">RETURNS & REFUNDS</Link></li>
                        <li><Link to="/terms">TERMS OF SERVICE</Link></li>
                        <li><Link to="/privacy">PRIVACY POLICY</Link></li>
                    </ul>
                </div>

                {/* 4. CONTACT DIRECTORY */}
                <div className="footer-column contact-column">
                    <h4 className="column-title">CONNECT</h4>
                    <div className="contact-details">
                        <div className="detail-item">
                            <FaBuilding className="detail-icon" />
                            <p>SILIGURI, DARJEELING - 734434 (W.B)</p>
                        </div>
                        <div className="detail-item">
                            <FaPhoneAlt className="detail-icon" />
                            <p>+91 76796 00984</p>
                        </div>
                        <div className="detail-item">
                            <FaEnvelope className="detail-icon" />
                            <p>official@jgmindustries.in</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom reveal">
                <div className="footer-divider"></div>
                <div className="footer-legal">
                    <p>&copy; {new Date().getFullYear()} JGM Industries. All rights reserved.</p>
                    <p className="dev-credit">Architected by <a href="https://manindra.in" target="_blank" rel="noopener noreferrer">manindra.in</a></p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
