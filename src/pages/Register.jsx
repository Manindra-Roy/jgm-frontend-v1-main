/**
 * @fileoverview User Registration & Email Verification Component.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import brandLogo from '../assets/brand-logo.png';
import namasteImg from '../assets/namaste.webp';
import './Login.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import Magnetic from '../components/Magnetic';

export default function Register() {
    useReveal();
    const navigate = useNavigate();
    
    // UI State Manager: 1 = Registration | 2 = OTP Verification
    const [step, setStep] = useState(1); 
    
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', phone: '' 
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users/register', formData);
            toast.success(res.data.message || `Verification code sent to ${formData.email}`);
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users/verify-email', { 
                email: formData.email, 
                otp: otp 
            });
            toast.success('Account Activated. Welcome to JGM Industries.');
            navigate('/login', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid verification code.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-portal">
            <SEO 
                title="Create Account | JGM Industries" 
                description="Join the JGM Industries community and start your journey with pure herbal care."
                url="https://jgm-industries.com/register"
            />
            
            <div className="login-visual-side">
                <div className="visual-overlay"></div>
                <div className="visual-content reveal">
                    <div className="brand-badge">SINCE INCEPTION</div>
                    <img src={namasteImg} alt="Namaste" className="visual-namaste" />
                    <div className="visual-text">
                        <span className="brand-cursive">Join our Journey</span>
                        <h2>PURE WELLNESS</h2>
                    </div>
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-header-mini reveal">
                    <div className="login-logo-circle" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <img src={brandLogo} alt="JGM Logo" className="login-logo" />
                    </div>
                    <h1>REGISTRATION</h1>
                </div>

                <div className="login-card reveal delay-1">
                    <h2>{step === 1 ? 'Join the Movement' : 'Verify Account'}</h2>
                    
                    {step === 1 && (
                        <form onSubmit={handleRegister} className="login-form">
                            <div className="input-group">
                                <label>Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required maxLength="50" />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required maxLength="100" />
                            </div>
                            <div className="input-group">
                                <label>Phone Number</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} minLength="10" maxLength="10" required placeholder="10-digit mobile number" />
                            </div>
                            <div className="input-group">
                                <label>Secure Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" maxLength="255" />
                            </div>
                            <Magnetic>
                                <button type="submit" className="login-submit-btn" disabled={loading}>
                                    {loading ? 'INITIATING...' : 'CREATE ACCOUNT'}
                                </button>
                            </Magnetic>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="login-form">
                            <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
                                Enter the 6-digit verification code sent to your email.
                            </p>
                            <div className="input-group">
                                <label>Verification Code</label>
                                <input 
                                    type="text" 
                                    value={otp} 
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                    required 
                                    maxLength="6"
                                    style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.5rem' }}
                                />
                            </div>
                            <Magnetic>
                                <button type="submit" className="login-submit-btn" disabled={loading}>
                                    {loading ? 'VERIFYING...' : 'FINALIZE ACTIVATION'}
                                </button>
                            </Magnetic>
                        </form>
                    )}

                    {step === 1 && (
                        <p className="toggle-text" onClick={() => navigate('/login')}>
                            Existing Member? Access Account here.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}