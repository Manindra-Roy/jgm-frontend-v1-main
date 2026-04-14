/**
 * @fileoverview User Login & Password Recovery Component.
 * Handles standard authentication, OTP generation for forgotten passwords,
 * and secure password resetting within a unified, multi-step interface.
 */

import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import brandLogo from '../assets/brand-logo.png';
import './Login.css';

/**
 * Login Component
 * @returns {JSX.Element} The rendered login and password recovery interface.
 */
export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    
    // UI State Manager: 
    // 0 = Normal Login | 1 = Forgot Password (Email) | 2 = Reset (OTP + New Pass)
    const [step, setStep] = useState(0);
    
    // Unified form state for all 3 steps
    const [formData, setFormData] = useState({
        email: '', password: '', otp: '', newPassword: ''
    });

    // Determines where to redirect the user after a successful login
    const from = location.state?.from?.pathname || "/";

    /**
     * Updates local component state on input change.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * STEP 0: Authenticates the user and stores the auth flag.
     * The actual secure JWT is handled automatically via HTTP-only cookies by the API interceptor.
     */
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/users/login', { email: formData.email, password: formData.password });
            localStorage.setItem('is_customer_authenticated', 'true');
            toast.success('Logged in successfully!');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    /**
     * STEP 1: Requests a 6-digit OTP to the user's registered email address.
     */
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users/forgot-password', { email: formData.email });
            toast.success(res.data.message || 'OTP sent to your email.');
            setStep(2); // Progress to OTP entry view
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * STEP 2: Submits the emailed OTP alongside a new password to finalize the reset.
     */
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users/reset-password', { 
                email: formData.email, 
                otp: formData.otp, 
                newPassword: formData.newPassword 
            });
            toast.success(res.data.message || 'Password reset successfully!');
            setStep(0); // Return to standard login view
            setFormData({ ...formData, password: '', otp: '', newPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-header">
                <div className="login-logo-circle">
                    <img src={brandLogo} alt="JGM Logo" className="login-logo" />
                </div>
                <h1>JGM INDUSTRIES</h1>
            </div>

            <div className="login-card">
                <h2>
                    {step === 0 && '....Login....'}
                    {step === 1 && 'Reset Password'}
                    {step === 2 && 'Enter OTP'}
                </h2>

                {/* --- NORMAL LOGIN FORM --- */}
                {step === 0 && (
                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group">
                            <label>E-mail</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="input-group">
                            <label>Pass</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>

                        <div className="form-actions">
                            <span className="forgot-pass" onClick={() => setStep(1)}>FORGOT PASS</span>
                        </div>
                        
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? 'LOGGING IN...' : 'LOGIN'}
                        </button>
                    </form>
                )}

                {/* --- REQUEST OTP FORM --- */}
                {step === 1 && (
                    <form onSubmit={handleForgotPassword} className="login-form animate-fade-up">
                        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                            Enter your registered email address to receive a password reset code.
                        </p>
                        <div className="input-group">
                            <label>E-mail</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? 'SENDING...' : 'SEND OTP'}
                        </button>
                        <p className="toggle-text" onClick={() => setStep(0)}>
                            ← Back to Login
                        </p>
                    </form>
                )}

                {/* --- RESET PASSWORD FORM --- */}
                {step === 2 && (
                    <form onSubmit={handleResetPassword} className="login-form animate-fade-up">
                        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                            Enter the 6-digit code sent to your email and create a new password.
                        </p>
                        <div className="input-group">
                            <label style={{ fontSize: '1.2rem' }}>OTP</label>
                            <input 
                                type="text" 
                                name="otp" 
                                value={formData.otp} 
                                onChange={handleChange} 
                                required 
                                maxLength="6"
                                style={{ letterSpacing: '3px', textAlign: 'center', fontWeight: 'bold' }}
                            />
                        </div>
                        <div className="input-group">
                            <label style={{ fontSize: '1.2rem' }}>New Pass</label>
                            <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} required minLength="6" />
                        </div>
                        
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? 'RESETTING...' : 'RESET PASSWORD'}
                        </button>
                        <p className="toggle-text" onClick={() => setStep(1)}>
                            ← Change Email Address
                        </p>
                    </form>
                )}

                {step === 0 && (
                    <p className="toggle-text" onClick={() => navigate('/register')}>
                        Don't have an account? Register.
                    </p>
                )}
            </div>
        </div>
    );
}