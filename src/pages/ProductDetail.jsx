/**
 * @fileoverview Single Product Detail Component.
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaLock, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import './ProductDetail.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import Magnetic from '../components/Magnetic';
import ScrambleHeading from '../components/ScrambleHeading';
import Skeleton from '../components/Skeleton';

export default function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

    useReveal([product]);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomPos({ x, y });
    };

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

    if (loading) return (
        <div className="product-detail-wrapper">
            <div className="detail-container">
                <div className="detail-card">
                    <div className="detail-image-side">
                        <Skeleton height="500px" borderRadius="30px" />
                    </div>
                    <div className="detail-info-side" style={{ padding: '60px' }}>
                        <Skeleton width="40%" height="20px" />
                        <Skeleton width="80%" height="60px" style={{ margin: '20px 0' }} />
                        <Skeleton width="30%" height="40px" />
                        <Skeleton height="150px" style={{ margin: '40px 0' }} />
                        <Skeleton height="60px" borderRadius="50px" />
                    </div>
                </div>
            </div>
        </div>
    );
    
    if (!product) return <div className="loading-screen">Product not found.</div>;

    const inStock = product.countInStock > 0;

    return (
        <div className="product-detail-wrapper">
            <SEO 
                title={`${product.name} | JGM Industries`} 
                description={product.description || "Crafted from pure, powerful herbs."}
                url={`https://jgm-industries.com/product/${product.id || product._id}`}
                image={product.image || undefined}
            />
            <div className="detail-container">
                <Magnetic>
                    <button className="back-btn reveal" onClick={() => navigate(-1)}>
                        <FaArrowLeft /> BACK TO CATALOG
                    </button>
                </Magnetic>

                <div className="detail-card reveal">
                    <div className="detail-image-side">
                        <div 
                            className="image-box" 
                            onMouseMove={handleMouseMove}
                            onMouseLeave={() => setZoomPos({ x: 50, y: 50 })}
                        >
                            {product.image ? (
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    style={{ 
                                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
                                    }}
                                />
                            ) : (
                                <div className="placeholder">🌿</div>
                            )}
                        </div>
                    </div>

                    <div className="detail-info-side">
                        {product.brand && <span className="detail-brand">{product.brand}</span>}
                        <ScrambleHeading text={product.name} className="detail-title" />
                        <p className="detail-price">₹{product.price}</p>

                        <div className={`stock-status ${inStock ? 'in-stock' : 'out-of-stock'}`}>
                            {inStock ? <FaCheckCircle /> : <FaTimesCircle />}
                            <span>{inStock ? 'Available for Immediate Shipment' : 'Out of Stock'}</span>
                        </div>

                        <div className="wellness-specs reveal delay-1">
                            <div className="spec-item">
                                <FaCheckCircle className="spec-icon" />
                                <span>100% Organic</span>
                            </div>
                            <div className="spec-item">
                                <FaCheckCircle className="spec-icon" />
                                <span>Lab Verified</span>
                            </div>
                            <div className="spec-item">
                                <FaCheckCircle className="spec-icon" />
                                <span>Ethical Sourcing</span>
                            </div>
                        </div>

                        <div className="detail-tabs-container reveal delay-2">
                            <div className="detail-description">
                                <h3>Product Essence</h3>
                                <p>{product.description || "A masterfully crafted herbal solution for your natural wellness journey."}</p>
                                {product.richDescription && (
                                    <div className="rich-content" dangerouslySetInnerHTML={{ __html: product.richDescription }}></div>
                                )}
                            </div>
                        </div>

                        <div className="detail-actions">
                            <Magnetic>
                                <button 
                                    className="order-massive-btn" 
                                    disabled={!inStock}
                                    onClick={() => {
                                        const id = product._id || product.id;
                                        if (id) navigate(`/checkout/${id}`);
                                        else toast.error("Product configuration error.");
                                    }}
                                >
                                    ORDER SECURELY <FaShoppingCart style={{ marginLeft: '12px' }} />
                                </button>
                            </Magnetic>
                            <p className="secure-checkout-text">
                                <FaLock style={{ marginRight: '8px' }} /> 
                                Premium Secure Checkout | Encrypted Processing
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}