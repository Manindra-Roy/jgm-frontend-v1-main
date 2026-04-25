/**
 * @fileoverview Direct Checkout & Payment Initiation Component.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FaLock, FaShieldAlt, FaAward, FaShoppingCart } from 'react-icons/fa';
import api from '../services/api';
import './DirectCheckout.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import Magnetic from '../components/Magnetic';

export default function DirectCheckout() {
    const { productId } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [userId, setUserId] = useState(null); 
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useReveal([product]);
    
    const [savedProfileAddress, setSavedProfileAddress] = useState(null);
    const [useSavedAddress, setUseSavedAddress] = useState(false);

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
                    setSavedProfileAddress(userRes.data);
                    setUseSavedAddress(true);
                    setFormData({
                        shippingAddress1: userRes.data.street,
                        shippingAddress2: userRes.data.apartment || '',
                        city: userRes.data.city,
                        state: userRes.data.state || '',
                        zip: userRes.data.zip,
                        country: userRes.data.country || 'India',
                        phone: userRes.data.phone
                    });
                } else {
                    setFormData(prev => ({...prev, phone: userRes.data.phone || ''}));
                } 
                
            } catch (err) {
                console.error("Checkout init error:", err);
                setError(err.response?.data?.message || "Failed to initialize secure checkout session.");
                toast.error("Session expired or product not found.");
                setTimeout(() => navigate('/products'), 2000);
            }
        };
        fetchInitData();
    }, [productId, navigate]);

    const handleAddressToggle = (useSaved) => {
        setUseSavedAddress(useSaved);
        if (useSaved && savedProfileAddress) {
            setFormData({
                shippingAddress1: savedProfileAddress.street,
                shippingAddress2: savedProfileAddress.apartment || '',
                city: savedProfileAddress.city,
                state: savedProfileAddress.state || '',
                zip: savedProfileAddress.zip,
                country: savedProfileAddress.country || 'India',
                phone: savedProfileAddress.phone
            });
        } else {
            setFormData({
                shippingAddress1: '', shippingAddress2: '', city: '', state: '', zip: '', country: 'India', phone: savedProfileAddress?.phone || ''
            });
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userId) {
            toast.error("User session missing.");
            setLoading(false);
            return;
        }

        try {
            const orderPayload = {
                ...formData,
                orderItems: [{ product: productId, quantity: quantity }],
                status: 'Pending',
                user: userId 
            };

            // Support both id and _id from backend response
            const orderRes = await api.post('/orders', orderPayload);
            const orderId = orderRes.data.id || orderRes.data._id;

            if (!orderId) {
                throw new Error("Unable to identify created order.");
            }

            const paymentRes = await api.post(`/payments/checkout/${orderId}`);
            
            if (paymentRes.data.success && paymentRes.data.paymentUrl) {
                window.location.href = paymentRes.data.paymentUrl;
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message 
                || (typeof err.response?.data === 'string' ? err.response.data : "Checkout failed.");
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!product) return <div className="loading-screen">Securing Checkout Portal...</div>;

    return (
        <div className="checkout-wrapper">
            <SEO title="Secure Checkout | JGM Industries" />
            <div className="checkout-card">
                <h2 className="checkout-title reveal">PREMIUM CHECKOUT</h2>
                
                <div className="checkout-split">
                    <div className="product-summary reveal delay-1">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">₹{product.price}</p>
                        <div className="qty-control">
                            <label>Units</label>
                            <input 
                                type="number" 
                                min="1" 
                                max={product.countInStock} 
                                value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))} 
                            />
                        </div>
                        <div className="detail-divider"></div>
                        <h4 className="total">Total Commitment: ₹{product.price * quantity}</h4>
                        <p className="secure-checkout-text">
                            <FaShieldAlt style={{ marginRight: '8px' }} /> Fresh batch available
                        </p>
                    </div>

                    <form onSubmit={handleCheckout} className="shipping-form reveal delay-2">
                        <h3>Shipping Protocol</h3>

                        {savedProfileAddress && (
                            <div className="address-toggle-box">
                                <label className="address-option">
                                    <input type="radio" name="addressSource" checked={useSavedAddress} onChange={() => handleAddressToggle(true)} />
                                    Utilize Primary Profile Address
                                </label>
                                <label className="address-option">
                                    <input type="radio" name="addressSource" checked={!useSavedAddress} onChange={() => handleAddressToggle(false)} />
                                    Designate Alternative Location
                                </label>
                            </div>
                        )}

                        <input type="text" placeholder="Address Line 1" required={!useSavedAddress} disabled={useSavedAddress} value={formData.shippingAddress1} onChange={e => setFormData({...formData, shippingAddress1: e.target.value})} />
                        <input type="text" placeholder="Landmark / Suite (Optional)" disabled={useSavedAddress} value={formData.shippingAddress2} onChange={e => setFormData({...formData, shippingAddress2: e.target.value})} />
                        <div className="input-row">
                            <input type="text" placeholder="City" required={!useSavedAddress} disabled={useSavedAddress} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} style={{ flex: 1 }} />
                            <input type="text" placeholder="State" required={!useSavedAddress} disabled={useSavedAddress} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} style={{ flex: 1 }} />
                        </div>
                        <input type="text" placeholder="PIN Code" required={!useSavedAddress} disabled={useSavedAddress} value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value.replace(/\D/g, '')})} />
                        <input type="tel" placeholder="Mobile Correspondence (10 digits)" minLength="10" maxLength="10" required disabled={useSavedAddress} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} />
                        
                        <button type="submit" disabled={loading} className="pay-btn">
                            {loading ? "ENCRYPTING TRANSACTION..." : (
                                <><FaLock style={{ marginRight: '12px' }} /> FINALIZE & PAY ₹{product.price * quantity}</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="wellness-guarantee reveal delay-3">
                    <div className="guarantee-item">
                        <FaAward className="guarantee-icon" />
                        <div className="guarantee-text">
                            <h4>Direct from Source</h4>
                            <p>Straight from our Darjeeling manufacturing hub to your doorstep.</p>
                        </div>
                    </div>
                    <div className="guarantee-item">
                        <FaShieldAlt className="guarantee-icon" />
                        <div className="guarantee-text">
                            <h4>Secure Acquisition</h4>
                            <p>End-to-end encrypted transactions for your absolute peace of mind.</p>
                        </div>
                    </div>
                    <div className="guarantee-item">
                        <FaLock className="guarantee-icon" />
                        <div className="guarantee-text">
                            <h4>Pure Formulation</h4>
                            <p>100% chemical-free herbal extracts, verified for peak potency.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
