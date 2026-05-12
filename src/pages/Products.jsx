/**
 * @fileoverview Rebuilt Product Listing (Silent Authority 3.0)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Products.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import PremiumButton from '../components/PremiumButton';

export default function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const [searchParams] = useSearchParams();
    const categoryId = searchParams.get('category');
    const brand = searchParams.get('brand');
    const navigate = useNavigate();
    const observer = useRef();

    useReveal([products]);

    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setLoading(true);
    }, [categoryId, brand]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!hasMore) return;
            
            if (page === 1) setLoading(true);
            else setLoadingMore(true);

            try {
                let endpoint = '/products';
                const params = [`page=${page}`, `limit=12`];
                if (categoryId) params.push(`categories=${categoryId}`);
                if (brand) params.push(`brand=${brand}`);
                
                endpoint += `?${params.join('&')}`;

                const { data } = await api.get(endpoint);
                const newProducts = data.products || data;
                
                setProducts(prev => {
                    if (page === 1) return newProducts;
                    
                    const existingIds = new Set(prev.map(p => p.id || p._id));
                    const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id || p._id));
                    return [...prev, ...uniqueNewProducts];
                });
                
                if (newProducts.length < 12) {
                    setHasMore(false);
                }
            } catch {
                console.error("Failed to load products");
            } finally {
                setLoading(false);
                setLoadingMore(false);
            }
        };

        if (hasMore) {
            fetchProducts();
        }
    }, [categoryId, brand, page]);

    const lastProductElementRef = useCallback(node => {
        if (loading || loadingMore) return;
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        
        if (node) observer.current.observe(node);
    }, [loading, loadingMore, hasMore]);

    if (loading && page === 1) return <div className="loading-screen">Authenticating Collection...</div>;

    return (
        <div className="products-page">
            <SEO 
                title="The Collection | Pure Herbal Formulations" 
                description="Explore our registry of pure botanical formulations. From sacred heritage to scientific precision."
                url="https://www.jgmindustries.in/products"
            />
            
            <div className="container-editorial">
                <header className="products-header reveal">
                    <span className="editorial-eyebrow">Our Formulation Registry</span>
                    <h1>THE COLLECTION</h1>
                </header>

                <div className="product-grid">
                    {products.map((product, index) => {
                        const isLastElement = products.length === index + 1;
                        return (
                            <div 
                                ref={isLastElement ? lastProductElementRef : null}
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
                        );
                    })}
                </div>
                {loadingMore && (
                    <div className="loading-more" style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-primary)' }}>
                        <span style={{ letterSpacing: '0.2em', fontSize: '0.8rem', textTransform: 'uppercase' }}>Loading More Items...</span>
                    </div>
                )}
            </div>
        </div>
    );
}