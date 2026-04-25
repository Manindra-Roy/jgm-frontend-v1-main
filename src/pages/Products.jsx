/**
 * @fileoverview Main Product Catalog Component.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaLeaf } from 'react-icons/fa';
import api from '../services/api';
import './Products.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import Magnetic from '../components/Magnetic';
import Tilt from '../components/Tilt';
import ScrambleHeading from '../components/ScrambleHeading';

import Skeleton from '../components/Skeleton';
import PremiumButton from '../components/PremiumButton';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    useReveal([products, loading]);

    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

    useEffect(() => {
        window.scrollTo(0, 0); 
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const endpoint = categoryId ? `/products?categories=${categoryId}` : '/products';
                const { data } = await api.get(endpoint);
                setProducts(data.products || data);
            } catch (err) {
                console.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    return (
        <div className="products-page-wrapper">
            <SEO 
                title="Premium Collection | JGM Industries" 
                description="Explore our curated collection of pure herbal solutions. Crafted for natural wellness." 
                url="https://jgm-industries.com/products"
            />

            <div className="products-header reveal">
                <span className="section-tag">Purely Natural</span>
                <ScrambleHeading text="THE HERBAL COLLECTION" className="section-title" />
                <p className="section-description">
                    Every product is a testament to our commitment to purity and natural wellness.
                </p>
            </div>

            <div className="products-grid">
                {loading ? (
                    // God Level Skeleton Grid
                    Array(8).fill(0).map((_, i) => (
                        <div key={`skeleton-${i}`} className="product-card">
                            <Skeleton height="350px" borderRadius="30px" />
                            <div className="product-info" style={{ padding: '30px 0' }}>
                                <Skeleton width="70%" height="25px" />
                                <Skeleton width="30%" height="20px" style={{ margin: '15px 0' }} />
                                <Skeleton height="50px" borderRadius="50px" />
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        {products.map((product, index) => (
                            <Tilt key={product.id || product._id}>
                                <div 
                                    className="product-card reveal" 
                                    style={{ transitionDelay: `${(index % 4) * 0.1}s` }}
                                >
                                    {product.isFeatured && <div className="special-offer-tag">BESTSELLER</div>}
                                    
                                    <div className="product-image-container" onClick={() => navigate(`/product/${product.id || product._id}`)}>
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} />
                                        ) : (
                                            <div className="placeholder">🌿</div>
                                        )}
                                    </div>
                                    
                                    <div className="product-info">
                                        <h3 className="product-title" onClick={() => navigate(`/product/${product.id || product._id}`)}>
                                            {product.name}
                                        </h3>
                                        <p className="product-price">₹{product.price}</p>
                                        
                                        <Magnetic>
                                            <PremiumButton 
                                                variant="gold"
                                                className="order-now-btn" 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const id = product._id || product.id;
                                                    if (id) navigate(`/checkout/${id}`);
                                                    else console.error("Product ID missing", product);
                                                }}
                                            >
                                                ORDER SECURELY <FaShoppingCart style={{ marginLeft: '10px' }} />
                                            </PremiumButton>
                                        </Magnetic>
                                    </div>
                                </div>
                            </Tilt>
                        ))}
                        
                        {products.length === 0 && (
                            <div className="empty-state reveal" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 0' }}>
                                <div className="empty-icon" style={{ fontSize: '4rem', marginBottom: '20px' }}>🌿</div>
                                <h2 style={{ color: 'var(--text-dark)' }}>Collection coming soon.</h2>
                                <p style={{ color: 'var(--text-muted)' }}>We are currently updating this category with fresh batches.</p>
                                <Magnetic>
                                    <PremiumButton 
                                        variant="outline" 
                                        onClick={() => navigate('/products')}
                                        style={{ marginTop: '30px' }}
                                    >
                                        EXPLORE ALL PRODUCTS
                                    </PremiumButton>
                                </Magnetic>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}