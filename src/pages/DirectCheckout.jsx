/**
 * @fileoverview Rebuilt Checkout Page (Silent Authority 3.0)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import './DirectCheckout.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';

export default function DirectCheckout() {
    const { productId } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [userId, setUserId] = useState(null); 
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    
    useReveal([product]);
    
    const [formData, setFormData] = useState({
        shippingAddress1: '', shippingAddress2: '', city: '', state: '', zip: '', country: 'India', phone: ''
    });

    useEffect(() => {
        const fetchInitData = async () => {
            try {
                const [productRes, userRes] = await Promise.all([
                    api.get(`/products/${productId}`),
                    api.get('/users/me/profile')
                ]);
                
                setProduct(productRes.data);
                setUserId(userRes.data.id || userRes.data._id); 
                
                if (userRes.data.street) {
                    setFormData({
                        shippingAddress1: userRes.data.street,
                        shippingAddress2: userRes.data.apartment || '',
                        city: userRes.data.city,
                        state: userRes.data.state || '',
                        zip: userRes.data.zip,
                        country: userRes.data.country || 'India',
                        phone: userRes.data.phone
                    });
                }
            } catch (err) {
                console.error("Checkout init error:", err);
                toast.error("Session expired or product not found.");
                navigate('/products');
            }
        };
        fetchInitData();
    }, [productId, navigate]);

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderPayload = {
                ...formData,
                orderItems: [{ product: productId, quantity: quantity }],
                status: 'Pending',
                user: userId 
            };

            const orderRes = await api.post('/orders', orderPayload);
            const orderId = orderRes.data.id || orderRes.data._id;
            const paymentRes = await api.post(`/payments/checkout/${orderId}`);
            
            if (paymentRes.data.success && paymentRes.data.paymentUrl) {
                window.location.href = paymentRes.data.paymentUrl;
            }
        } catch {
            toast.error("Checkout failed. Please check your registry details.");
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <div className="loading-screen">Authenticating Transaction Portal...</div>;

    return (
        <div className="checkout-wrapper">
            <SEO title="Secure Checkout | JGM Industries" />
            <div className="checkout-editorial-card reveal">
                <header className="checkout-header">
                    <span className="editorial-eyebrow">Registry Fulfillment</span>
                    <h2>CHECKOUT</h2>
                </header>
                
                <div className="checkout-split">
                    <div className="checkout-summary">
                        <h3>Your Selection</h3>
                        <div className="summary-item">
                            <img src={product.image} alt={product.name} />
                            <div>
                                <h4>{product.name}</h4>
                                <p className="text-gold">₹{product.price}</p>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span>Units</span>
                                <input 
                                    type="number" 
                                    min="1" 
                                    value={quantity} 
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                    style={{ width: '60px', padding: '5px', background: 'none', border: '1px solid var(--border-light)', textAlign: 'center' }}
                                />
                            </div>
                            <p>Total Amount: <span className="text-gold">₹{product.price * quantity}</span></p>
                        </div>
                    </div>

                    <form onSubmit={handleCheckout} className="checkout-form">
                        <h3>Shipping Protocol</h3>
                        <input type="text" placeholder="SHIPPING ADDRESS 1" required value={formData.shippingAddress1} onChange={e => setFormData({...formData, shippingAddress1: e.target.value})} />
                        <input type="text" placeholder="LANDMARK / SUITE (OPTIONAL)" value={formData.shippingAddress2} onChange={e => setFormData({...formData, shippingAddress2: e.target.value})} />
                        <div className="input-row">
                            <input type="text" placeholder="CITY" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                            <input type="text" placeholder="STATE" required value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                        </div>
                        <input type="text" placeholder="PIN CODE" required value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} />
                        <input type="tel" placeholder="MOBILE CONTACT" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                        
                        <button type="submit" disabled={loading} className="pay-btn">
                            {loading ? "AUTHENTICATING..." : "INITIALIZE ACQUISITION"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
