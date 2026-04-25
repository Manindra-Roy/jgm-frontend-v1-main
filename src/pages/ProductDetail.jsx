/**
 * @fileoverview Rebuilt Product Detail Page (Silent Authority 3.0)
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './ProductDetail.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import PremiumButton from '../components/PremiumButton';

export default function ProductDetail() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useReveal([product]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${productId}`);
                setProduct(data);
            } catch {
                console.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return <div className="loading-screen">Retrieving Formulation...</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="product-detail-page">
            <SEO title={`${product.name} | JGM Industries`} />
            
            <div className="container-editorial">
                <div className="detail-editorial-grid">
                    <div className="detail-visual-column reveal">
                        <img src={product.image} alt={product.name} />
                    </div>

                    <div className="detail-info-column reveal delay-1">
                        <span className="detail-brand-tag">Registry No. {product._id?.substring(0,8).toUpperCase()}</span>
                        <h1 className="detail-title">{product.name}</h1>
                        <span className="detail-price">₹{product.price}</span>
                        
                        <p className="detail-description">
                            {product.description || "A masterfully crafted formulation utilizing pure botanical extracts to restore balance and promote organic wellness."}
                        </p>

                        <div className="spec-list">
                            <div className="spec-item">
                                <span className="spec-label">Availability</span>
                                <span className="spec-value">{product.countInStock > 0 ? 'Fresh Batch Available' : 'Waitlisted'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Category</span>
                                <span className="spec-value">{product.category?.name || 'Organic Wellness'}</span>
                            </div>
                            <div className="spec-item">
                                <span className="spec-label">Extraction</span>
                                <span className="spec-value">Cold-Pressed Essence</span>
                            </div>
                        </div>

                        <div className="detail-actions">
                            <PremiumButton variant="gold" onClick={() => navigate(`/checkout/${product.id || product._id}`)}>
                                SECURE ACQUISITION
                            </PremiumButton>
                            <PremiumButton variant="outline" onClick={() => navigate('/products')}>
                                RETURN TO COLLECTION
                            </PremiumButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}