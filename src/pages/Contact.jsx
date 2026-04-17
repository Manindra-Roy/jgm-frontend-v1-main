/**
 * @fileoverview Contact Us Page Component.
 * Displays corporate contact information and provides an interactive form
 * that dispatches messages to the backend Nodemailer service.
 */

import { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import './Editorial.css';
import './Login.css'; // Reusing input-group styles

/**
 * Contact Component
 * @returns {JSX.Element} The rendered contact page and form.
 */
export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [loading, setLoading] = useState(false);

    // Scroll to the top of the page immediately upon loading
    useEffect(() => window.scrollTo(0, 0), []);

    /**
     * Dispatches the user's inquiry to the backend email service.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/contact', formData);
            toast.success("Thank you! Your message has been sent.");
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form on success
        } catch (err) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editorial-wrapper">
            <div className="editorial-container animate-fade-up">
                <div className="editorial-header">
                    <h1>Get In Touch</h1>
                    <p>We'd love to hear from you. Reach out with any questions or inquiries.</p>
                </div>
                
                <div className="contact-grid">
                    {/* --- Static Contact Information --- */}
                    <div className="contact-info delay-1 animate-fade-up">
                        <div className="contact-info-item">
                            <FaMapMarkerAlt className="contact-info-icon" />
                            <div>
                                <h3>Our Headquarters</h3>
                                <p>Siliguri, Darjeeling<br/>West Bengal - 734434, India</p>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <FaPhoneAlt className="contact-info-icon" />
                            <div>
                                <h3>Call Us</h3>
                                <p>Customer Care: 62962-63480<br/>Business: 76796-00984</p>
                            </div>
                        </div>
                        <div className="contact-info-item">
                            <FaEnvelope className="contact-info-icon" />
                            <div>
                                <h3>Email Us</h3>
                                <p>jgmindustriesofficial@gmail.com</p>
                            </div>
                        </div>
                    </div>

                    {/* --- Interactive Email Form --- */}
                    <div className="contact-form-container delay-2 animate-fade-up">
                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="input-group">
                                <input type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required maxLength="50" />
                            </div>
                            <div className="input-group">
                                <input type="email" placeholder="Your Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required maxLength="100" />
                            </div>
                            <div className="input-group">
                                <input type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required maxLength="100" />
                            </div>
                            <textarea rows="5" placeholder="Your Message..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required maxLength="1000"></textarea>
                            
                            <button type="submit" className="hero-cta-btn" style={{ width: '100%', background: 'var(--primary-green)', borderColor: 'var(--primary-green)' }} disabled={loading}>
                                {loading ? 'SENDING...' : 'SEND MESSAGE'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}