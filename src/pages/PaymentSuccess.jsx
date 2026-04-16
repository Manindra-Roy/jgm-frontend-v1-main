/**
 * @fileoverview Payment Result Component.
 * After PhonePe redirects the user back, this page fetches the actual
 * order payment status from the backend and displays the correct outcome
 * (Paid, Failed, or Pending) instead of blindly showing "Success".
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import api from '../services/api';
import './DirectCheckout.css'; 

export default function PaymentSuccess() {
    const { orderId } = useParams();
    const [paymentStatus, setPaymentStatus] = useState('loading'); // loading | Paid | Failed | Pending
    const [order, setOrder] = useState(null);

    /**
     * Effect: Fetches the order from the backend to check the real payment status.
     * Polls every 3 seconds for up to 30 seconds in case the webhook hasn't arrived yet.
     */
    useEffect(() => {
        window.scrollTo(0, 0);

        let attempts = 0;
        const maxAttempts = 10; // 10 attempts × 3 seconds = 30 seconds max

        const checkPaymentStatus = async () => {
            try {
                const { data } = await api.get(`/payments/check-status/${orderId}`);

                if (data.paymentStatus === 'Paid') {
                    setPaymentStatus('Paid');
                    return true; // Stop polling
                } else if (data.paymentStatus === 'Failed') {
                    setPaymentStatus('Failed');
                    return true; // Stop polling
                } else {
                    // Still Pending — keep polling
                    setPaymentStatus('Pending');
                    return false;
                }
            } catch (err) {
                console.error("Failed to check payment status:", err);
                setPaymentStatus('Pending');
                return false;
            }
        };

        const poll = async () => {
            const resolved = await checkPaymentStatus();
            if (!resolved && attempts < maxAttempts) {
                attempts++;
                setTimeout(poll, 3000);
            }
        };

        poll();
    }, [orderId]);

    // --- LOADING STATE ---
    if (paymentStatus === 'loading') {
        return (
            <div className="checkout-wrapper">
                <div className="checkout-card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '600px' }}>
                    <FaHourglassHalf style={{ fontSize: '4rem', color: '#f1c40f', marginBottom: '20px' }} className="animate-fade-up" />
                    <h1 style={{ fontFamily: 'var(--font-brand)', color: '#555', marginBottom: '10px' }} className="animate-fade-up delay-1">
                        Verifying Payment...
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#777' }} className="animate-fade-up delay-2">
                        Please wait while we confirm your transaction with PhonePe.
                    </p>
                </div>
            </div>
        );
    }

    // --- PAYMENT PAID ---
    if (paymentStatus === 'Paid') {
        return (
            <div className="checkout-wrapper">
                <div className="checkout-card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '600px' }}>
                    <FaCheckCircle style={{ fontSize: '5rem', color: '#2ecc71', marginBottom: '20px' }} className="animate-fade-up" />
                    <h1 style={{ fontFamily: 'var(--font-brand)', color: 'var(--primary-green)', marginBottom: '10px' }} className="animate-fade-up delay-1">
                        Order Successful!
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px' }} className="animate-fade-up delay-2">
                        Thank you for choosing JGM Industries. Your payment has been received and your order is now being processed.
                    </p>
                    <div style={{ backgroundColor: '#f4fdf0', padding: '20px', borderRadius: '12px', border: '1px solid #c8e6c9', marginBottom: '40px', display: 'inline-block', textAlign: 'left' }} className="animate-fade-up delay-3">
                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>Order Reference ID:</p>
                        <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#111' }}>
                            {orderId}
                        </p>
                    </div>
                    <div className="animate-fade-up delay-3">
                        <Link to="/products">
                            <button className="hero-cta-btn" style={{ backgroundColor: 'var(--primary-green)', color: 'white', borderColor: 'var(--primary-green)' }}>
                                CONTINUE SHOPPING
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- PAYMENT FAILED ---
    if (paymentStatus === 'Failed') {
        return (
            <div className="checkout-wrapper">
                <div className="checkout-card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '600px' }}>
                    <FaTimesCircle style={{ fontSize: '5rem', color: '#e74c3c', marginBottom: '20px' }} className="animate-fade-up" />
                    <h1 style={{ fontFamily: 'var(--font-brand)', color: '#e74c3c', marginBottom: '10px' }} className="animate-fade-up delay-1">
                        Payment Failed
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px' }} className="animate-fade-up delay-2">
                        Unfortunately, your payment could not be processed. No money has been deducted from your account. Please try again.
                    </p>
                    <div style={{ backgroundColor: '#fdf4f0', padding: '20px', borderRadius: '12px', border: '1px solid #f5c6cb', marginBottom: '40px', display: 'inline-block', textAlign: 'left' }} className="animate-fade-up delay-3">
                        <p style={{ margin: '0 0 5px 0', color: '#666' }}>Order Reference ID:</p>
                        <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#111' }}>
                            {orderId}
                        </p>
                    </div>
                    <div className="animate-fade-up delay-3">
                        <Link to="/products">
                            <button className="hero-cta-btn" style={{ backgroundColor: '#e74c3c', color: 'white', borderColor: '#e74c3c' }}>
                                TRY AGAIN
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- PAYMENT PENDING (webhook hasn't arrived yet after 30s polling) ---
    return (
        <div className="checkout-wrapper">
            <div className="checkout-card" style={{ textAlign: 'center', padding: '60px 40px', maxWidth: '600px' }}>
                <FaHourglassHalf style={{ fontSize: '5rem', color: '#f39c12', marginBottom: '20px' }} className="animate-fade-up" />
                <h1 style={{ fontFamily: 'var(--font-brand)', color: '#f39c12', marginBottom: '10px' }} className="animate-fade-up delay-1">
                    Payment Pending
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#555', marginBottom: '30px' }} className="animate-fade-up delay-2">
                    Your order has been placed but we're still waiting for payment confirmation from PhonePe. 
                    You can check your order status from your profile.
                </p>
                <div style={{ backgroundColor: '#fef9e7', padding: '20px', borderRadius: '12px', border: '1px solid #f9e79f', marginBottom: '40px', display: 'inline-block', textAlign: 'left' }} className="animate-fade-up delay-3">
                    <p style={{ margin: '0 0 5px 0', color: '#666' }}>Order Reference ID:</p>
                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold', fontFamily: 'monospace', color: '#111' }}>
                        {orderId}
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }} className="animate-fade-up delay-3">
                    <Link to="/profile">
                        <button className="hero-cta-btn" style={{ backgroundColor: '#f39c12', color: 'white', borderColor: '#f39c12' }}>
                            CHECK ORDER STATUS
                        </button>
                    </Link>
                    <Link to="/products">
                        <button className="hero-cta-btn" style={{ borderColor: 'var(--primary-green)', color: 'var(--primary-green)' }}>
                            CONTINUE SHOPPING
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}