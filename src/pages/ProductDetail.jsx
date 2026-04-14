/**
 * @fileoverview Single Product Detail Component.
 * Fetches and displays comprehensive information for a specific product,
 * including dynamic stock status and rich HTML descriptions.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import api from '../services/api';
import './ProductDetail.css';

/**
 * ProductDetail Component
 * @returns {JSX.Element} The rendered product detail view.
 */
export default function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    /**
     * Effect: Fetches the specific product data based on the URL parameter.
     */
    useEffect(() => {
        window.scrollTo(0, 0); 
        
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${productId}`);
                setProduct(data);
            } catch (err) {
                console.error("Failed to fetch product details");
            } finally {
                setLoading(false);
            }
        };
        
        fetchProduct();
    }, [productId]);

    if (loading) return <div className="loading-screen">Loading pure herbal details...</div>;
    if (!product) return <div className="loading-screen">Product not found.</div>;

    // Derived state for inventory management UI
    const inStock = product.countInStock > 0;

    return (
        <div className="product-detail-wrapper">
            <div className="detail-container">
                
                <button className="back-btn animate-fade-up" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> BACK TO CATALOG
                </button>

                <div className="detail-card">
                    {/* Left: Product Image */}
                    <div className="detail-image-side animate-fade-up delay-1">
                        <div className="image-box">
                            {product.image ? (
                                <img src={product.image} alt={product.name} />
                            ) : (
                                <div className="placeholder">No Image Available</div>
                            )}
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="detail-info-side animate-fade-up delay-2">
                        {product.brand && <span className="detail-brand">{product.brand}</span>}
                        
                        <h1 className="detail-title">{product.name}</h1>
                        <p className="detail-price">₹{product.price}/-</p>

                        {/* Dynamic Stock UI Indicator */}
                        <div className={`stock-status ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {inStock ? <FaCheckCircle /> : <FaTimesCircle />}
                            <span>{inStock ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}</span>
                        </div>

                        <div className="detail-divider"></div>

                        <div className="detail-description">
                            <h3>About this product</h3>
                            <p>{product.description || "Crafted from pure, powerful herbs. Made to care for you the natural way."}</p>
                            
                            {/* Safely injects HTML content created by the Admin rich-text editor */}
                            {product.richDescription && (
                                <div dangerouslySetInnerHTML={{ __html: product.richDescription }}></div>
                            )}
                        </div>

                        {/* Checkout Action */}
                        <div className="detail-actions">
                            <button 
                                className="hero-cta-btn order-massive-btn" 
                                disabled={!inStock}
                                onClick={() => navigate(`/checkout/${product.id}`)}
                            >
                                {inStock ? 'ORDER SECURELY NOW' : 'CURRENTLY UNAVAILABLE'}
                            </button>
                            <p className="secure-checkout-text">🔒 Secure Checkout via PhonePe</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}