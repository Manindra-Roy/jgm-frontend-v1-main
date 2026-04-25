/**
 * @fileoverview Contact Us Page Component.
 */

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import './Editorial.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import PremiumButton from '../components/PremiumButton';
import Magnetic from '../components/Magnetic';

export default function Contact() {
    useReveal();
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => window.scrollTo(0, 0), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/contact', formData);
            toast.success("Thank you! Your message has been sent.");
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editorial-wrapper">
            <SEO 
                title="Connect With Us | JGM Industries" 
                description="Get in touch with JGM Industries. We are here to answer your questions about natural wellness."
                url="https://jgm-industries.com/contact"
            />
            <div className="editorial-container">
                <div className="editorial-header reveal">
                    <span className="section-tag">Direct Dialogue</span>
                    <h1 className="section-title">GET IN TOUCH</h1>
                    <p className="section-description">We'd love to hear from you. Reach out today for pure wellness inquiries.</p>
                </div>
                
                <div className="contact-grid">
                    <div className="contact-info-card reveal delay-1">
                        <div className="contact-info-item">
                            <FaMapMarkerAlt className="contact-info-icon" />
                            <div className="contact-info-text">
                                <h3>Our Headquarters</h3>
                                <p>Siliguri, Darjeeling<br/>West Bengal - 734434, India</p>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <FaPhoneAlt className="contact-info-icon" />
                            <div className="contact-info-text">
                                <h3>Direct Lines</h3>
                                <p>Care: 62962-63480<br/>Business: 76796-00984</p>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <FaEnvelope className="contact-info-icon" />
                            <div className="contact-info-text">
                                <h3>Digital Correspondence</h3>
                                <p>jgmindustriesofficial@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container reveal delay-2">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={formData.name} 
                                onChange={e => setFormData({...formData, name: e.target.value})} 
                                required 
                                maxLength="50" 
                            />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                value={formData.email} 
                                onChange={e => setFormData({...formData, email: e.target.value})} 
                                required 
                                maxLength="100" 
                            />
                            <input 
                                type="text" 
                                placeholder="Subject of Inquiry" 
                                value={formData.subject} 
                                onChange={e => setFormData({...formData, subject: e.target.value})} 
                                required 
                                maxLength="100" 
                            />
                            <textarea 
                                rows="6" 
                                placeholder="How can we assist you?" 
                                value={formData.message} 
                                onChange={e => setFormData({...formData, message: e.target.value})} 
                                required 
                                maxLength="1000"
                            ></textarea>
                            
                            <Magnetic>
                                <PremiumButton 
                                    type="submit" 
                                    variant="gold" 
                                    disabled={loading}
                                    style={{ width: '100%' }}
                                >
                                    {loading ? 'SENDING...' : (
                                        <>SEND MESSAGE <FaPaperPlane style={{ marginLeft: '12px' }} /></>
                                    )}
                                </PremiumButton>
                            </Magnetic>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}