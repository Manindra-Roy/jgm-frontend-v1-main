/**
 * @fileoverview Rebuilt Product Listing (Silent Authority 3.0)
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Products.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import PremiumButton from '../components/PremiumButton';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('category');
    const navigate = useNavigate();

    useReveal([products]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const endpoint = categoryId ? `/products?categories=${categoryId}` : '/products';
                const { data } = await api.get(endpoint);
                setProducts(data.products || data);
            } catch {
                console.error("Failed to load products");
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryId]);

    if (loading) return <div className="loading-screen">Authenticating Collection...</div>;

    return (
        <div className="products-page">
            <SEO title="The Collection | JGM Industries" />
            
            <div className="container-editorial">
                <header className="products-header reveal">
                    <span className="editorial-eyebrow">Our Formulation Registry</span>
                    <h1>THE COLLECTION</h1>
                </header>

                <div className="product-grid">
                    {products.map((product, index) => (
                        <div 
                            key={product.id || product._id} 
                            className="product-card reveal"
                            style={{ transitionDelay: `${(index % 4) * 0.1}s` }}
                            onClick={() => navigate(`/product/${product.id || product._id}`)}
                        >
                            <div className="product-img-container">
                                <img src={product.image} alt={product.name} />
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <span className="product-price">₹{product.price}</span>
                                <PremiumButton variant="outline">VIEW DETAILS</PremiumButton>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}