/**
 * @fileoverview Reusable Footer Component.
 */

import { FaBuilding, FaPhoneAlt, FaEnvelope, FaHeadset } from 'react-icons/fa';
import brandLogo from '../assets/brand-logo.png';
import './Footer.css';

function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-top reveal">
                <div className="footer-logo-wrapper">
                    <img src={brandLogo} alt="JGM Industries - Awakening Pure Wellness Logo" className="footer-logo" />
                </div>
                <h2>CRAFTED FROM PURE, POWERFUL HERBS</h2>
                <h2>AWAKENING PURE WELLNESS</h2>
                <div className="footer-divider"></div>
            </div>

            <div className="footer-bottom reveal">
                <div className="contact-item">
                    <div className="contact-icon-wrapper"><FaBuilding className="contact-icon" aria-hidden="true" /></div>
                    <div className="contact-text">
                        <h4>LOCATION</h4>
                        <p>SILIGURI, DARJEELING - 734434 (W.B)</p>
                    </div>
                </div>
                
                <div className="contact-item">
                    <div className="contact-icon-wrapper"><FaPhoneAlt className="contact-icon" aria-hidden="true" /></div>
                    <div className="contact-text">
                        <h4>CONNECT</h4>
                        <p>76796-00984</p>
                    </div>
                </div>

                <div className="contact-item">
                    <div className="contact-icon-wrapper"><FaEnvelope className="contact-icon" aria-hidden="true" /></div>
                    <div className="contact-text">
                        <h4>ENQUIRE</h4>
                        <p>jgmindustriesofficial@gmail.com</p>
                    </div>
                </div>

                <div className="contact-item">
                    <div className="contact-icon-wrapper"><FaHeadset className="contact-icon" aria-hidden="true" /></div>
                    <div className="contact-text">
                        <h4>SUPPORT</h4>
                        <p>62962-63480</p>
                    </div>
                </div>
            </div>

            <div className="footer-copyright reveal">
                <p>&copy; {new Date().getFullYear()} JGM Industries. All rights reserved.</p>
                <p className="dev-credit">Architected by <a href="https://manindra.in" target="_blank" rel="noopener noreferrer">manindra.in</a></p>
            </div>
        </footer>
    );
}

export default Footer;
