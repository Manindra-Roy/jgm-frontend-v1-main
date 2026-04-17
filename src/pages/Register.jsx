/**
 * @fileoverview User Registration & Email Verification Component.
 * Manages a secure two-step onboarding process: capturing user details and
 * verifying their email address via a 6-digit Nodemailer OTP before activation.
 */

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import brandLogo from '../assets/brand-logo.png';
import namasteImg from '../assets/namaste.webp';
import './Login.css';

/**
 * Register Component
 * @returns {JSX.Element} The rendered registration and OTP verification interface.
 */
export default function Register() {
    const navigate = useNavigate();
    
    // UI State Manager: Step 1 = Registration Details | Step 2 = OTP Verification
    const [step, setStep] = useState(1); 
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '' 
    });
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    /**
     * Updates local component state on input change.
     */
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    /**
     * STEP 1: Submits initial user data to create an unverified account in the database
     * and triggers the backend to dispatch an OTP email.
     */
    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users/register', formData);
            toast.success(res.data.message || `OTP sent to ${formData.email}`);
            setStep(2); // Progress to OTP input screen
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * STEP 2: Submits the 6-digit OTP to the backend to verify the email address
     * and fully activate the user account.
     */
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/users/verify-email', { 
                email: formData.email, 
                otp: otp 
            });
            
            toast.success(res.data.message || 'Email verified successfully! Please log in.');
            navigate('/login', { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data || 'Invalid or expired OTP.');
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
                <h2>....{step === 1 ? 'Register' : 'Verify Email'}....</h2>
                
                {/* --- STEP 1: DETAILS FORM --- */}
                {step === 1 && (
                    <form onSubmit={handleRegister} className="login-form">
                        <div className="input-group">
                            <label>Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required maxLength="50" />
                        </div>
                        <div className="input-group">
                            <label>E-mail</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required maxLength="100" />
                        </div>
                        <div className="input-group">
                            <label>Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })} minLength="10" maxLength="10" required placeholder="10-digit number" />
                        </div>
                        <div className="input-group">
                            <label>Pass</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" maxLength="255" />
                        </div>
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? 'CREATING ACCOUNT...' : 'REGISTER & SEND OTP'}
                        </button>
                    </form>
                )}

                {/* --- STEP 2: OTP VERIFICATION FORM --- */}
                {step === 2 && (
                    <form onSubmit={handleVerifyOTP} className="login-form">
                        <p style={{ textAlign: 'center', marginBottom: '20px', color: '#555' }}>
                            Enter the 6-digit code sent to your email.
                        </p>
                        <div className="input-group">
                            <label>OTP</label>
                            <input 
                                type="text" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
                                required 
                                maxLength="6"
                                style={{ letterSpacing: '5px', textAlign: 'center', fontWeight: 'bold' }}
                            />
                        </div>
                        <button type="submit" className="login-submit-btn" disabled={loading}>
                            {loading ? 'VERIFYING...' : 'VERIFY ACCOUNT'}
                        </button>
                    </form>
                )}

                {step === 1 && (
                    <p className="toggle-text" onClick={() => navigate('/login')}>
                        Already have an account? Login here.
                    </p>
                )}
            </div>

            <img src={namasteImg} alt="Namaste" className="namaste-img" />
        </div>
    );
}