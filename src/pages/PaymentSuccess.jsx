/**
 * @fileoverview Payment Confirmation Component.
 * Displayed immediately after a successful PhonePe transaction.
 * Extracts the order reference ID from the URL and provides a call-to-action to continue shopping.
 */

import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import './DirectCheckout.css'; 

export default function PaymentSuccess() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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