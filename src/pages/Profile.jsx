/**
 * @fileoverview User Profile & Order Dashboard Component.
 * Displays the authenticated user's account details and their complete order history,
 * including dynamic logistics tracking based on backend order status.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBoxOpen, FaSignOutAlt, FaMapMarkerAlt, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import './Profile.css';

/**
 * Profile Component
 * @returns {JSX.Element} The rendered user dashboard.
 */
export default function Profile() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Address Management State
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        street: '', apartment: '', city: '', state: '', zip: '', country: 'India', phone: ''
    });

    /**
     * Translates administrative backend order statuses into customer-friendly tracking messages.
     * @param {string} status - The current status of the order (e.g., 'processing', 'shipped').
     * @returns {string} A human-readable logistics update.
     */
    const getLogisticsMessage = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Awaiting order confirmation...';
            case 'processing': return 'Preparing for shipment...';
            case 'shipped': return 'Your package is on the way!';
            case 'out for delivery': return 'Arriving today!';
            case 'delivered': return 'Package delivered successfully.';
            case 'cancelled': return 'This order was cancelled.';
            default: return 'Updating status...';
        }
    };

    /**
     * Effect: Fetches the authenticated user's profile and their associated order history.
     */
    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // 1. Identify the currently authenticated user
                const userRes = await api.get('/users/me/profile');
                setUser(userRes.data);
                setAddressForm({
                    street: userRes.data.street || '',
                    apartment: userRes.data.apartment || '',
                    city: userRes.data.city || '',
                    state: userRes.data.state || '',
                    zip: userRes.data.zip || '',
                    country: userRes.data.country || 'India',
                    phone: userRes.data.phone || ''
                });

                // 2. Fetch the specific order history for this user ID
                const ordersRes = await api.get(`/orders/get/userorders/${userRes.data.id}`);
                setOrders(ordersRes.data);
            } catch (err) {
                console.error("Failed to load profile", err);
                // Note: The api.js interceptor handles automatic redirection if unauthorized
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    /**
     * Submits updated address to secure backend endpoint
     */
    const handleAddressSave = async (e) => {
        e.preventDefault();
        setSavingAddress(true);
        try {
            const res = await api.put('/users/me/address', addressForm);
            setUser(res.data.user); // Update local profile state
            setIsEditingAddress(false);
            toast.success("Address saved successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data || "Failed to save address");
        } finally {
            setSavingAddress(false);
        }
    };

    /**
     * Destroys the user session on the backend, clears local storage, and redirects to home.
     */
    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
            localStorage.removeItem('is_customer_authenticated');
            navigate('/');
        } catch (err) {
            console.error("Logout failed");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '100px', color: 'white', fontSize: '1.5rem' }}>Loading pure herbal profile...</div>;
    if (!user) return <div style={{ textAlign: 'center', padding: '100px', color: 'white' }}>Profile not found.</div>;

    return (
        <div className="profile-wrapper">
            <div className="profile-container animate-fade-up">
                
                {/* --- Left Sidebar: User Details --- */}
                <div className="profile-sidebar">
                    <div className="profile-details-section">
                        <div className="profile-avatar"><FaUserCircle /></div>
                        <h2 className="profile-name">{user.name}</h2>
                        <p className="profile-email">{user.email}</p>
                        <p className="profile-phone">{user.phone}</p>
                    </div>

                    {/* --- Address Book Section --- */}
                    <div className="profile-address-section">
                        <div className="address-header">
                            <h3><FaMapMarkerAlt /> Saved Address</h3>
                            {!isEditingAddress && (
                                <button className="edit-icon-btn" onClick={() => setIsEditingAddress(true)} title="Edit Address">
                                    <FaEdit />
                                </button>
                            )}
                        </div>
                        
                        {isEditingAddress ? (
                            <form className="address-form" onSubmit={handleAddressSave}>
                                <input type="tel" placeholder="Phone Number (10 digits)" minLength="10" maxLength="10" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value.replace(/\D/g, '')})} required />
                                <input type="text" placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} required maxLength="200" />
                                <input type="text" placeholder="Apartment/Suite (Optional)" value={addressForm.apartment} onChange={e => setAddressForm({...addressForm, apartment: e.target.value})} maxLength="200" />
                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                    <input type="text" placeholder="City" style={{ flex: '1 1 calc(50% - 5px)' }} value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required maxLength="50" />
                                    <input type="text" placeholder="State" style={{ flex: '1 1 calc(50% - 5px)' }} value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required maxLength="50" />
                                    <input type="text" placeholder="PIN Code" style={{ flex: '1 1 100%' }} value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value.replace(/\D/g, '')})} required />
                                </div>
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <button type="button" className="cancel-btn" onClick={() => setIsEditingAddress(false)} disabled={savingAddress}>Cancel</button>
                                    <button type="submit" className="save-btn" disabled={savingAddress}>
                                        {savingAddress ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="address-display">
                                {user.street ? (
                                    <>
                                        <p>{user.street}{user.apartment ? `, ${user.apartment}` : ''}</p>
                                        <p>{user.city}, {user.state ? `${user.state} - ` : ''}{user.zip}</p>
                                        <p>{user.country}</p>
                                    </>
                                ) : (
                                    <p className="no-address">No address saved yet.</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> SECURE LOGOUT
                    </button>
                </div>

                {/* --- Right Main Content: Order History --- */}
                <div className="profile-main">
                    <h2 className="section-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FaBoxOpen /> <span>MY ORDERS</span>
                    </h2>

                    {orders.length === 0 ? (
                        <div className="no-orders">
                            <p>You haven't placed any herbal orders yet.</p>
                            <button className="hero-cta-btn" onClick={() => navigate('/products')} style={{ borderColor: 'var(--primary-green)', color: 'var(--primary-green)' }}>
                                EXPLORE COLLECTION
                            </button>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => (
                                <div key={order.id} className="order-card">
                                    <div className="order-header">
                                        <div>
                                            <span className="order-id">Order #{order.id.slice(-6).toUpperCase()}</span>
                                            <span className="order-date">{new Date(order.dateOrdered).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            {/* Payment Status Badge */}
                                            <span style={{
                                                padding: '4px 10px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold',
                                                backgroundColor: order.paymentStatus === 'Paid' ? '#e8f5e9' 
                                                    : order.paymentStatus === 'Failed' ? '#fce4ec' 
                                                    : '#fff8e1',
                                                color: order.paymentStatus === 'Paid' ? '#2e7d32' 
                                                    : order.paymentStatus === 'Failed' ? '#c62828' 
                                                    : '#f57f17',
                                                border: `1px solid ${order.paymentStatus === 'Paid' ? '#a5d6a7' 
                                                    : order.paymentStatus === 'Failed' ? '#ef9a9a' 
                                                    : '#ffe082'}`
                                            }}>
                                                {order.paymentStatus === 'Paid' ? '💳 Paid' 
                                                    : order.paymentStatus === 'Failed' ? '❌ Payment Failed' 
                                                    : '⏳ Payment Pending'}
                                            </span>
                                            {/* Shipping Status Badge */}
                                            <span className={`order-status status-${order.status.toLowerCase().replace(/ /g, '-')}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="order-items">
                                        {order.orderItems.map((item, index) => (
                                            <div key={index} className="order-item">
                                                <img src={item.product?.image} alt={item.product?.name} className="item-image" />
                                                <div className="item-details">
                                                    <h4>{item.product?.name || 'Product Unavailable'}</h4>
                                                    <p>Qty: {item.quantity}</p>
                                                </div>
                                                <div className="item-price">
                                                    ₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}/-
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="order-footer">
                                        <div className="logistics">
                                            {order.paymentStatus === 'Failed' ? (
                                                <p style={{ fontStyle: 'italic', color: '#c62828' }}>
                                                    Payment was not completed. Please place a new order to try again.
                                                </p>
                                            ) : (
                                                <>
                                                    {order.courierName && <p><strong>Courier:</strong> {order.courierName}</p>}
                                                    {order.trackingNumber && <p><strong>Tracking:</strong> {order.trackingNumber}</p>}
                                                    {!order.courierName && <p style={{ fontStyle: 'italic', color: '#888' }}>
                                                        {order.paymentStatus === 'Pending' 
                                                            ? 'Waiting for payment confirmation...' 
                                                            : getLogisticsMessage(order.status)}
                                                    </p>}
                                                </>
                                            )}
                                        </div>
                                        <div className="order-total">
                                            Total: <span>₹{order.totalPrice.toLocaleString('en-IN')}/-</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}