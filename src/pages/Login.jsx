/**
 * @fileoverview User Login & Password Recovery Component.
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import namasteImg from '../assets/namaste.webp';
import './Login.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import Magnetic from '../components/Magnetic';

export default function Login() {
    useReveal();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    
    // UI State Manager: 0 = Login | 1 = Forgot Password | 2 = Reset
    const [step, setStep] = useState(0);
    
    const [formData, setFormData] = useState({
        email: '', password: '', otp: '', newPassword: ''
    });

    const from = location.state?.from?.pathname || "/";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/login', { email: formData.email, password: formData.password });
            localStorage.setItem('is_customer_authenticated', 'true');
            toast.success('Access Granted. Welcome back.');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/forgot-password', { email: formData.email });
            toast.success('Verification code dispatched to your email.');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/reset-password', { 
                email: formData.email, 
                otp: formData.otp, 
                newPassword: formData.newPassword 
            });
            toast.success('Credentials updated successfully.');
            setStep(0);
            setFormData({ ...formData, password: '', otp: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-portal">
            <SEO 
                title="Secure Login | JGM Industries" 
                description="Securely access your JGM Industries portal for premium herbal solutions."
                url="https://jgm-industries.com/login"
            />
            
            <div className="login-visual-side">
                <div className="visual-overlay"></div>
                <div className="visual-content reveal">
                    <div className="brand-badge">SINCE INCEPTION</div>
                    <img src={namasteImg} alt="Namaste" className="visual-namaste" />
                    <div className="visual-text">
                        <span className="brand-cursive">Rooted in Tradition</span>
                        <h2>PURE WELLNESS</h2>
                    </div>
                </div>
            </div>

            <div className="login-form-side">
                <div className="login-header-mini reveal">
                    <h1>AUTHENTICATION</h1>
                </div>

                <div className="login-card reveal delay-1">
                    <h2>
                        {step === 0 && 'Welcome Back'}
                        {step === 1 && 'Recover Access'}
                        {step === 2 && 'Verify Identity'}
                    </h2>

                    {step === 0 && (
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="input-group">
                                <label>Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                            </div>

                            <div className="form-actions">
                                <span className="forgot-pass" onClick={() => setStep(1)}>Forgotten Password?</span>
                            </div>
                            
                            <Magnetic>
                                <button type="submit" className="login-submit-btn" disabled={loading}>
                                    {loading ? 'AUTHORIZING...' : 'LOG IN'}
                                </button>
                            </Magnetic>
                        </form>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleForgotPassword} className="login-form">
                            <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
                                We will send a verification code to your registered email.
                            </p>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            
                            <Magnetic>
                                <button type="submit" className="login-submit-btn" disabled={loading}>
                                    {loading ? 'SENDING...' : 'DISPATCH CODE'}
                                </button>
                            </Magnetic>
                            <p className="toggle-text" onClick={() => setStep(0)}>
                                Return to Secure Login
                            </p>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="login-form">
                            <p style={{ textAlign: 'center', marginBottom: '20px', color: 'var(--text-muted)' }}>
                                Enter the 6-digit verification code and your new password.
                            </p>
                            <div className="input-group">
                                <label>Verification Code</label>
                                <input 
                                    type="text" 
                                    name="otp" 
                                    value={formData.otp} 
                                    onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })} 
                                    required 
                                    maxLength="6"
                                    style={{ letterSpacing: '8px', textAlign: 'center', fontSize: '1.5rem' }}
                                />
                            </div>
                            <div className="input-group">
                                <label>New Secure Password</label>
                                <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required minLength="6" />
                            </div>
                            
                            <Magnetic>
                                <button type="submit" className="login-submit-btn" disabled={loading}>
                                    {loading ? 'UPDATING...' : 'UPDATE CREDENTIALS'}
                                </button>
                            </Magnetic>
                            <p className="toggle-text" onClick={() => setStep(1)}>
                                Incorrect Email? Change it here.
                            </p>
                        </form>
                    )}

                    {step === 0 && (
                        <p className="toggle-text" onClick={() => navigate('/register')}>
                            New to JGM Industries? Create an Account
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}