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

    // Initial state for the shipping details form
    const [formData, setFormData] = useState({
        shippingAddress1: '', shippingAddress2: '', city: '', zip: '', country: 'India', phone: ''
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
                
            } catch (err) {
                toast.error("Session expired or product not found. Please log in again.");
                navigate('/products');
            }
        };
        fetchInitData();
    }, [productId, navigate]);

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
                        <input type="text" placeholder="Address Line 1" required onChange={e => setFormData({...formData, shippingAddress1: e.target.value})} />
                        <input type="text" placeholder="Landmark / Line 2 (Optional)" onChange={e => setFormData({...formData, shippingAddress2: e.target.value})} />
                        <input type="text" placeholder="City" required onChange={e => setFormData({...formData, city: e.target.value})} />
                        <input type="text" placeholder="PIN Code" required onChange={e => setFormData({...formData, zip: e.target.value})} />
                        <input type="tel" placeholder="Phone Number" required onChange={e => setFormData({...formData, phone: e.target.value})} />
                        
                        <button type="submit" disabled={loading} className="pay-btn">
                            {loading ? "Processing Securely..." : `Pay ₹${product.price * quantity} Securely`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
