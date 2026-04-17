/**
 * @fileoverview Direct Checkout & Payment Initiation Component.
 * Collects shipping data, constructs the order payload, creates the order in the database,
 * and redirects the user to the secure PhonePe gateway.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import './DirectCheckout.css';

/**
 * DirectCheckout Component
 * @returns {JSX.Element} The rendered checkout and shipping form interface.
 */
export default function DirectCheckout() {
    const { productId } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [userId, setUserId] = useState(null); 
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Address Selection State
    const [savedProfileAddress, setSavedProfileAddress] = useState(null);
    const [useSavedAddress, setUseSavedAddress] = useState(false);

    // Initial state for the shipping details form
    const [formData, setFormData] = useState({
        shippingAddress1: '', shippingAddress2: '', city: '', state: '', zip: '', country: 'India', phone: ''
    });

    /**
     * Effect: Fetches the required checkout data concurrently.
     * Requires BOTH the product data and the authenticated user's ID to proceed.
     */
    useEffect(() => {
        const fetchInitData = async () => {
            try {
                // Execute both API calls simultaneously for faster loading
                const [productRes, userRes] = await Promise.all([
                    api.get(`/products/${productId}`),
                    api.get('/users/me/profile')
                ]);
                
                setProduct(productRes.data);
                setUserId(userRes.data.id); 

                // Check if user has a configured address profile
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
                    // Even without a full address, pre-fill their phone number
                    setFormData(prev => ({...prev, phone: userRes.data.phone || ''}));
                } 
                
            } catch (err) {
                toast.error("Session expired or product not found. Please log in again.");
                navigate('/products');
            }
        };
        fetchInitData();
    }, [productId, navigate]);

    /**
     * Toggles between the saved address and a blank custom address form.
     */
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

    /**
     * Handles the form submission, creates the order, and initiates the PhonePe session.
     */
    const handleCheckout = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!userId) {
            toast.error("User session missing. Please refresh the page.");
            setLoading(false);
            return;
        }

        try {
            // 1. Construct the complete order payload required by the backend Joi schema
            const orderPayload = {
                ...formData,
                orderItems: [{ product: productId, quantity: quantity }],
                status: 'Pending',
                user: userId 
            };

            // 2. Create the order in the database (this also deducts the stock)
            const orderRes = await api.post('/orders', orderPayload);
            const orderId = orderRes.data.id;

            // 3. Request a secure PhonePe payment URL for this specific order
            const paymentRes = await api.post(`/payments/checkout/${orderId}`);
            
            // 4. Redirect the user's browser to the external PhonePe gateway
            if (paymentRes.data.success && paymentRes.data.paymentUrl) {
                window.location.href = paymentRes.data.paymentUrl;
            }
        // } catch (err) {
        //     toast.error(err.response?.data || "Checkout failed. Please try again.");
        //     setLoading(false);
        // }
        } catch (err) {
            // Safely extract the string message, or fallback to a default string
            const errorMessage = err.response?.data?.message 
                || (typeof err.response?.data === 'string' ? err.response.data : "Checkout failed. Please try again.");
                
            toast.error(errorMessage);
            setLoading(false);
        }
    };

    if (!product) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Secure Checkout...</div>;

    return (
        <div className="checkout-wrapper">
            <div className="checkout-card">
                <h2 className="checkout-title">Instant Checkout</h2>
                
                <div className="checkout-split">
                    {/* Order Summary Column */}
                    <div className="product-summary">
                        <img src={product.image} alt={product.name} />
                        <h3>{product.name}</h3>
                        <p className="price">₹{product.price}</p>
                        <div className="qty-control">
                            <label>Quantity:</label>
                            <input 
                                type="number" 
                                min="1" 
                                max={product.countInStock} 
                                value={quantity} 
                                onChange={(e) => setQuantity(Number(e.target.value))} 
                            />
                        </div>
                        <h4 className="total">Total to Pay: ₹{product.price * quantity}</h4>
                        <p className="stock-info">({product.countInStock} available in stock)</p>
                    </div>

                    {/* Shipping Form Column */}
                    <form onSubmit={handleCheckout} className="shipping-form">
                        <h3>Shipping Details</h3>

                        {savedProfileAddress && (
                            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'rgba(52, 152, 219, 0.05)', borderRadius: '10px', border: '1px solid rgba(52, 152, 219, 0.2)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '12px', fontSize: '0.95rem', fontWeight: 'bold' }}>
                                    <input type="radio" name="addressSource" checked={useSavedAddress} onChange={() => handleAddressToggle(true)} style={{ width: '18px', height: '18px', accentColor: '#3498db' }} />
                                    Use Saved Profile Address
                                </label>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 'bold' }}>
                                    <input type="radio" name="addressSource" checked={!useSavedAddress} onChange={() => handleAddressToggle(false)} style={{ width: '18px', height: '18px', accentColor: '#3498db' }} />
                                    Ship to a Different Address
                                </label>
                            </div>
                        )}

                        <input type="text" placeholder="Address Line 1" required={!useSavedAddress} disabled={useSavedAddress} value={formData.shippingAddress1} onChange={e => setFormData({...formData, shippingAddress1: e.target.value})} maxLength="200" style={{ opacity: useSavedAddress ? 0.7 : 1 }} />
                        <input type="text" placeholder="Landmark / Line 2 (Optional)" disabled={useSavedAddress} value={formData.shippingAddress2} onChange={e => setFormData({...formData, shippingAddress2: e.target.value})} maxLength="200" style={{ opacity: useSavedAddress ? 0.7 : 1 }} />
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <input type="text" placeholder="City" required={!useSavedAddress} disabled={useSavedAddress} value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} maxLength="50" style={{ flex: '1 1 calc(50% - 5px)', opacity: useSavedAddress ? 0.7 : 1 }} />
                            <input type="text" placeholder="State" required={!useSavedAddress} disabled={useSavedAddress} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} maxLength="50" style={{ flex: '1 1 calc(50% - 5px)', opacity: useSavedAddress ? 0.7 : 1 }} />
                            <input type="text" placeholder="PIN Code" required={!useSavedAddress} disabled={useSavedAddress} value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value.replace(/\D/g, '')})} style={{ flex: '1 1 100%', opacity: useSavedAddress ? 0.7 : 1 }} />
                        </div>
                        <input type="tel" placeholder="Phone Number (10 digits)" minLength="10" maxLength="10" required disabled={useSavedAddress} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value.replace(/\D/g, '')})} style={{ opacity: useSavedAddress ? 0.7 : 1 }} />
                        
                        <button type="submit" disabled={loading} className="pay-btn" style={{ marginTop: '10px' }}>
                            {loading ? "Processing Securely..." : `Pay ₹${product.price * quantity} Securely`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
