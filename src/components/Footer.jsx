/**
 * @fileoverview Reusable Footer Component.
 * Displays brand info, contact details, and links across all pages.
 */

import { FaBuilding, FaPhoneAlt, FaEnvelope, FaHeadset, FaGlobe } from 'react-icons/fa';
import brandLogo from '../assets/brand-logo.png';
import footerBg from '../assets/footer-bg.webp';
import './Footer.css';

function Footer() {
    return (
        <footer className="site-footer" style={{ backgroundImage: `url(${footerBg})` }}>
            <div className="footer-top">
                <div className="footer-logo-wrapper floating-graphic">
                    <img src={brandLogo} alt="JGM Logo" className="footer-logo" />
                </div>
                <h2>CRAFTED FROM PURE, POWERFUL HERBS.</h2>
                <h2>MADE TO CARE FOR YOU THE NATURAL WAY.</h2>
                <div className="footer-divider"></div>
            </div>

            <div className="footer-bottom">
                <div className="footer-row-top">
                    <div className="contact-item">
                        <div className="contact-icon-wrapper"><FaBuilding className="contact-icon" /></div>
                        <div className="contact-text">
                            <h4>ADDRESS</h4>
                            <p>SILIGURI, DARJEELING - 734434 (W.B)</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon-wrapper"><FaPhoneAlt className="contact-icon" /></div>
                        <div className="contact-text">
                            <h4>PHONE No.</h4>
                            <p>76796-00984</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon-wrapper"><FaEnvelope className="contact-icon" /></div>
                        <div className="contact-text">
                            <h4>E-Mail</h4>
                            <p>jgmindustriesofficial@gmail.com</p>
                        </div>
                    </div>
                </div>

                <div className="footer-row-bottom">
                    <div className="contact-item">
                        <div className="contact-icon-wrapper"><FaHeadset className="contact-icon" /></div>
                        <div className="contact-text">
                            <h4>Customer Care</h4>
                            <p>62962-63480</p>
                        </div>
                    </div>
                    <div className="contact-item">
                        <div className="contact-icon-wrapper"><FaGlobe className="contact-icon" /></div>
                        <div className="contact-text">
                            <h4>Website</h4>
                            <a href="https://www.jgmindustries.in" target="_blank" rel="noopener noreferrer">www.jgmindustries.in</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-copyright">
                <p>&copy; {new Date().getFullYear()} JGM Industries. All rights reserved.</p>
                <p className="dev-credit">Developed by <a href="https://manindra.in" target="_blank" rel="noopener noreferrer">manindra.in</a></p>
            </div>
        </footer>
    );
}

export default Footer;
