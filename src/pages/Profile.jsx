/**
 * @fileoverview User Profile & Order Dashboard Component.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBoxOpen, FaSignOutAlt, FaMapMarkerAlt, FaEdit, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import './Profile.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useReveal([orders]);

    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [savingAddress, setSavingAddress] = useState(false);
    const [addressForm, setAddressForm] = useState({
        street: '', apartment: '', city: '', state: '', zip: '', country: 'India', phone: ''
    });

    const getLogisticsMessage = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'Protocol initiated. Awaiting confirmation.';
            case 'processing': return 'Batch formulation in progress.';
            case 'shipped': return 'Dispatched via premium logistics.';
            case 'out for delivery': return 'Final transit. Arriving today.';
            case 'delivered': return 'Wellness kit securely delivered.';
            case 'cancelled': return 'Acquisition revoked.';
            default: return 'Synchronizing status...';
        }
    };

    const renderTimeline = (status) => {
        const steps = ['Pending', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
        const currentIdx = steps.findIndex(s => s.toLowerCase() === status?.toLowerCase());
        
        return (
            <div className="order-timeline">
                {steps.map((step, i) => (
                    <div key={step} className={`timeline-step ${i <= currentIdx ? 'active' : ''}`}>
                        <div className="step-dot"></div>
                        <span className="step-label">{step}</span>
                    </div>
                ))}
            </div>
        );
    };

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
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

                const ordersRes = await api.get(`/orders/get/userorders/${userRes.data.id || userRes.data._id}`);
                setOrders(ordersRes.data);
            } catch {
                toast.error("Profile retrieval failed.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleAddressSave = async (e) => {
        e.preventDefault();
        setSavingAddress(true);
        try {
            const res = await api.put('/users/me/address', addressForm);
            setUser(res.data.user);
            setIsEditingAddress(false);
            toast.success("Address Book Synchronized");
        } catch (err) {
            toast.error("Failed to update registry");
        } finally {
            setSavingAddress(false);
        }
    };

    const handleLogout = async () => {
        try {
            await api.post('/users/logout');
            localStorage.removeItem('is_customer_authenticated');
            navigate('/');
        } catch (err) {
            console.error("Session termination failed");
        }
    };

    if (loading) return <div className="loading-screen">Synchronizing Repository...</div>;
    if (!user) return <div className="loading-screen">Registry not found.</div>;

    return (
        <div className="profile-wrapper">
            <SEO title="My Dashboard | JGM Industries" />
            <div className="profile-container reveal">
                
                <aside className="profile-sidebar">
                    <div className="profile-details-section">
                        <div className="profile-avatar"><FaUserCircle /></div>
                        <h2 className="profile-name">{user.name}</h2>
                        <p className="profile-email">{user.email}</p>
                        <p className="profile-phone">{user.phone}</p>
                    </div>

                    <div className="profile-address-section">
                        <div className="address-header">
                            <h3><FaMapMarkerAlt /> ADDRESS BOOK</h3>
                            {!isEditingAddress && (
                                <button className="edit-icon-btn" onClick={() => setIsEditingAddress(true)}>
                                    <FaEdit />
                                </button>
                            )}
                        </div>
                        
                        {isEditingAddress ? (
                            <form className="address-form" onSubmit={handleAddressSave}>
                                <input type="tel" placeholder="Primary Phone" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value.replace(/\D/g, '')})} required />
                                <input type="text" placeholder="Street Address" value={addressForm.street} onChange={e => setAddressForm({...addressForm, street: e.target.value})} required />
                                <input type="text" placeholder="Apartment / Suite" value={addressForm.apartment} onChange={e => setAddressForm({...addressForm, apartment: e.target.value})} />
                                <div className="form-row">
                                    <input type="text" placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} required />
                                    <input type="text" placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} required />
                                </div>
                                <input type="text" placeholder="PIN Code" value={addressForm.zip} onChange={e => setAddressForm({...addressForm, zip: e.target.value.replace(/\D/g, '')})} required />
                                
                                <div className="address-form-actions">
                                    <button type="button" className="cancel-btn" onClick={() => setIsEditingAddress(false)}>CANCEL</button>
                                    <button type="submit" className="save-btn" disabled={savingAddress}>
                                        {savingAddress ? 'SAVING...' : 'UPDATE REGISTRY'}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="address-display">
                                {user.street ? (
                                    <>
                                        <p style={{ color: 'var(--text-dark)', fontWeight: '600' }}>{user.street}</p>
                                        <p>{user.apartment}</p>
                                        <p>{user.city}, {user.state} - {user.zip}</p>
                                        <p>{user.country}</p>
                                    </>
                                ) : (
                                    <p className="no-address">No saved configuration found.</p>
                                )}
                            </div>
                        )}
                    </div>
                    
                    <button className="logout-btn" onClick={handleLogout}>
                        <FaSignOutAlt /> TERMINATE SESSION
                    </button>
                </aside>

                <main className="profile-main">
                    <div className="profile-section-header">
                        <FaBoxOpen className="section-header-icon" />
                        <h2 className="section-title">ORDER REPOSITORY</h2>
                    </div>

                    {orders.length === 0 ? (
                        <div className="no-orders reveal delay-1">
                            <p>Your acquisition history is currently empty.</p>
                            <button className="hero-cta-btn" onClick={() => navigate('/products')}>
                                BEGIN EXPLORATION <FaChevronRight style={{ marginLeft: '10px' }} />
                            </button>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order, idx) => (
                                <div key={order.id || order._id} className="order-card reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
                                    <div className="order-header">
                                        <div className="order-id-block">
                                            <span className="order-date">{new Date(order.dateOrdered).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                            <span className="order-id-label">ORDER ID: <span className="order-id-value">#{(order.id || order._id).slice(-8).toUpperCase()}</span></span>
                                        </div>
                                        <div className="status-group">
                                            <span className={`status-badge payment-${order.paymentStatus?.toLowerCase()}`}>
                                                {order.paymentStatus}
                                            </span>
                                            <span className={`status-badge shipping-${order.status?.toLowerCase().replace(' ', '-')}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="order-items">
                                        {order.orderItems.map((item, i) => (
                                            <div key={i} className="order-item">
                                                <img src={item.product?.image} alt={item.product?.name} className="item-image" />
                                                <div className="item-details">
                                                    <h4>{item.product?.name}</h4>
                                                    <p className="item-meta">Unit Quantity: {item.quantity}</p>
                                                </div>
                                                <div className="item-price">
                                                    ₹{ (item.product?.price * item.quantity).toLocaleString() }
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {order.status?.toLowerCase() !== 'cancelled' && renderTimeline(order.status)}

                                    <div className="order-footer">
                                        <div className="logistics">
                                            {order.trackingNumber ? (
                                                <p className="tracking-info">
                                                    Courier: {order.courierName || 'The Courier'} | Tracking: {order.trackingNumber}
                                                </p>
                                            ) : (
                                                <p className="logistics-msg">
                                                    {getLogisticsMessage(order.status)}
                                                </p>
                                            )}
                                        </div>
                                        <div className="order-total-summary">
                                            <span className="total-label">Total Consideration</span>
                                            <span className="total-value">₹{order.totalPrice?.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}