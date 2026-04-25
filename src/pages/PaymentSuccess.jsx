/**
 * @fileoverview Payment Result Component.
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import './DirectCheckout.css'; 
import useReveal from '../hooks/useReveal';

/**
 * Reusable wrapper for result cards.
 * Moved outside the main component to prevent unnecessary unmounting during state changes.
 */
const CardWrapper = ({ children }) => (
    <div className="checkout-wrapper">
        <div className="checkout-card reveal" style={{ maxWidth: '700px', textAlign: 'center', margin: '0 auto' }}>
            {children}
        </div>
    </div>
);

export default function PaymentSuccess() {
    const params = useParams();
    const location = useLocation();
    const [paymentStatus, setPaymentStatus] = useState('loading'); 
    
    // Extract Order ID from either URL parameter or Query string (?id=... or ?orderId=...)
    const queryParams = new URLSearchParams(location.search);
    const orderId = params.orderId || queryParams.get('id') || queryParams.get('orderId');

    // Watch paymentStatus to ensure the reveal animation triggers after the state resolves
    useReveal([paymentStatus]);
    
    useEffect(() => {
        window.scrollTo(0, 0);

        if (!orderId) {
            setPaymentStatus('Failed');
            return;
        }

        let attempts = 0;
        const maxAttempts = 10; 

        const checkPaymentStatus = async () => {
            try {
                const { data } = await api.get(`/payments/check-status/${orderId}`);

                if (data.paymentStatus === 'Paid') {
                    setPaymentStatus('Paid');
                    return true; 
                } else if (data.paymentStatus === 'Failed') {
                    setPaymentStatus('Failed');
                    return true; 
                } else {
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

    if (paymentStatus === 'loading') {
        return (
            <CardWrapper>
                <FaHourglassHalf className="spinning" style={{ fontSize: '4rem', color: 'var(--accent-gold)', marginBottom: '30px' }} />
                <h1 className="checkout-title" style={{ marginBottom: '20px' }}>VERIFYING TRANSACTION</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    Please hold for a moment as we synchronize with the secure payment gateway.
                </p>
            </CardWrapper>
        );
    }

    if (paymentStatus === 'Paid') {
        return (
            <CardWrapper>
                <FaCheckCircle style={{ fontSize: '5rem', color: 'var(--primary-green)', marginBottom: '30px' }} />
                <h1 className="checkout-title" style={{ color: 'var(--primary-green)', marginBottom: '10px' }}>ORDER MANIFESTED</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                    Gratitude for choosing JGM Industries. Your pure herbal solution is now being prepared for shipment.
                </p>
                <div style={{ background: 'var(--light-green)', padding: '30px', borderRadius: '20px', marginBottom: '40px' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--primary-green)', marginBottom: '10px' }}>Reference ID</p>
                    <p style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '4px', color: 'var(--text-dark)', margin: 0 }}>
                        {orderId ? orderId.slice(-10).toUpperCase() : 'N/A'}
                    </p>
                </div>
                <Link to="/products">
                    <button className="pay-btn">
                        CONTINUE JOURNEY <FaArrowRight style={{ marginLeft: '12px' }} />
                    </button>
                </Link>
            </CardWrapper>
        );
    }

    if (paymentStatus === 'Failed') {
        return (
            <CardWrapper>
                <FaTimesCircle style={{ fontSize: '5rem', color: '#dc2626', marginBottom: '30px' }} />
                <h1 className="checkout-title" style={{ color: '#dc2626', marginBottom: '10px' }}>TRANSACTION ABORTED</h1>
                <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                    Regrettably, your payment could not be finalized. No consideration has been deducted.
                </p>
                <Link to="/products">
                    <button className="pay-btn" style={{ background: '#dc2626' }}>
                        RETRY ACQUISITION
                    </button>
                </Link>
            </CardWrapper>
        );
    }

    return (
        <CardWrapper>
            <FaHourglassHalf style={{ fontSize: '5rem', color: 'var(--accent-gold-dark)', marginBottom: '30px' }} />
            <h1 className="checkout-title" style={{ color: 'var(--accent-gold-dark)', marginBottom: '10px' }}>PAYMENT PENDING</h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '40px' }}>
                Your order is registered, but we are awaiting final clearance from PhonePe. 
                You may monitor the status from your profile repository.
            </p>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <Link to="/profile" style={{ flex: 1 }}>
                    <button className="pay-btn" style={{ background: 'var(--text-dark)', width: '100%' }}>GO TO PROFILE</button>
                </Link>
                <Link to="/products" style={{ flex: 1 }}>
                    <button className="pay-btn" style={{ background: 'transparent', color: 'var(--text-dark)', border: '1px solid var(--text-dark)', width: '100%' }}>CONTINUE SHOPPING</button>
                </Link>
            </div>
        </CardWrapper>
    );
}