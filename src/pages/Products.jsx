/**
 * @fileoverview Main Product Catalog Component.
 * Fetches and displays the store's inventory. Supports optional category filtering
 * via URL parameters and includes staggered CSS reveal animations for a premium feel.
 */

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import './Products.css';

/**
 * Products Component
 * @returns {JSX.Element} The rendered product grid.
 */
export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Extract optional category ID from the URL (e.g., ?category=12345)
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get('category');

    /**
     * Effect: Fetches product data on mount or when the category filter changes.
     */
    useEffect(() => {
        window.scrollTo(0, 0); // Ensure the user starts at the top of the catalog
        
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // Dynamically adjust the API endpoint based on the presence of a category filter
                const endpoint = categoryId ? `/products?categories=${categoryId}` : '/products';
                const { data } = await api.get(endpoint);
                setProducts(data);
            } catch (err) {
                console.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        
        fetchProducts();
    }, [categoryId]);

    /**
     * Routes the user directly to the secure checkout flow for a specific product.
     * @param {string} productId - The unique MongoDB ID of the selected product.
     */
    const handleOrderNow = (productId) => {
        navigate(`/checkout/${productId}`);
    };

    return (
        <div className="products-page-wrapper">
            <div className="products-header animate-fade-up">
                <h1 className="section-title"><span>OUR PRODUCTS</span></h1>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', color: 'white', fontSize: '1.5rem', padding: '100px 0' }}>Loading herbal collection...</div>
            ) : (
                <div className="products-grid">
                    {products.map((product, index) => (
                        <div 
                            key={product.id} 
                            className="product-card reveal active" 
                            style={{ animationDelay: `${index * 0.1}s` }} // Staggers the entrance animation
                        >
                            {product.isFeatured && <div className="special-offer-tag">SPECIAL OFFER</div>}
                            
                            <div className="product-image-container" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                                {product.image ? <img src={product.image} alt={product.name} /> : <div className="placeholder">No Image</div>}
                            </div>
                            
                            <div className="product-info">
                                <h3 className="product-title" onClick={() => navigate(`/product/${product.id}`)} style={{cursor: 'pointer'}}>
                                    {product.name}
                                </h3>
                                <p className="product-price">{product.price}/-</p>
                                
                                <button className="order-now-btn" onClick={() => handleOrderNow(product.id)}>
                                    ORDER NOW
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {/* Empty State Handler */}
                    {products.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'white', padding: '50px' }}>
                            <h2>No products found in this category.</h2>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}