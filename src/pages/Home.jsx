/**
 * @fileoverview Main Landing Page Component.
 * Features a luxury editorial hero section, dynamic category fetching,
 * and a custom IntersectionObserver for staggered scroll-reveal animations.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import api from '../services/api';
import homeBg from '../assets/home-bg.jpg';
import brandLogo from '../assets/brand-logo.png';
import './Home.css';

/**
 * Home Component
 * @returns {JSX.Element} The rendered landing page.
 */
export default function Home() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    /**
     * Effect 1: Fetches available product categories for the grid display.
     */
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data } = await api.get('/categories');
                setCategories(data);
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCategories();
    }, []);

    /**
     * Effect 2: Configures an IntersectionObserver for scroll-based reveal animations.
     * Elements with the class '.reveal' will fade in as they enter the viewport.
     */
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1, // Trigger when 10% of the element is visible
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Ensures animation only runs once per load
                }
            });
        }, observerOptions);

        const elements = document.querySelectorAll('.reveal');
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect(); // Cleanup observer on unmount
    }, [categories]); // Re-attach observer if categories are dynamically loaded

    return (
        <div className="home-container">
            {/* --- HERO SECTION --- */}
            <section className="hero-section" style={{ backgroundImage: `url(${homeBg})` }}>
                <div className="hero-content">
                    <div className="hero-text-block">
                        <h1 className="animate-fade-up">JGM INDUSTRIES</h1>
                        <h2 className="animate-fade-up delay-1">WE HAVE HERBAL CONCEPT</h2>
                        <p className="animate-fade-up delay-2">Crafted from pure, powerful herbs.<br/>Made to care for you the natural way.</p>
                        <div className="animate-fade-up delay-3">
                            <button className="hero-cta-btn" onClick={() => navigate('/products')}>
                                EXPLORE COLLECTION
                            </button>
                        </div>
                    </div>

                    <div className="hero-visuals animate-fade-up delay-3">
                        <div className="rotating-stamp">
                            <svg viewBox="0 0 100 100" width="180" height="180">
                                <defs>
                                    <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                                </defs>
                                <text>
                                    <textPath href="#circlePath" fill="white" fontSize="10.5" letterSpacing="3.5px" fontWeight="bold">
                                        •PURE•HERBAL•NATURAL
                                    </textPath>
                                </text>
                            </svg>
                            <div className="stamp-center">🌿</div>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-box">
                                <h3>02</h3>
                                <p>Premium<br/>Brands</p>
                            </div>
                            <div className="stat-divider"></div>
                            <div className="stat-box">
                                <h3>100%</h3>
                                <p>Herbal<br/>Pure</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- WAVE DIVIDER --- */}
            <div className="wave-divider">
                <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
                    <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,60 L0,60 Z" fill="var(--bg-yellow)" />
                </svg>
            </div>

            {/* --- BRANDS SECTION --- */}
            <section className="brands-section">
                <h3 className="reveal">We Have Two Brands</h3>
                <div className="brands-circles">
                    <div className="brand-circle reveal delay-1" onClick={() => navigate('/products')}>JAI GOU<br/>MATA</div>
                    <div className="brand-circle reveal delay-2" onClick={() => navigate('/products')}>ZIO</div>
                </div>
            </section>

            {/* --- CATEGORIES SECTION --- */}
            <section className="categories-section">
                <h3 className="section-title reveal"><span>CATEGORIES WE OFFER</span></h3>
                <div className="category-grid">
                    {categories.map((cat, index) => (
                        <div 
                            key={cat.id} 
                            className="category-card reveal" 
                            style={{ transitionDelay: `${index * 0.15}s` }} 
                            onClick={() => navigate(`/products?category=${cat.id}`)}
                        >
                            <div className="img-container">
                                {cat.image ? <img src={cat.image} alt={cat.name} /> : <div className="placeholder">No Image</div>}
                                <img src={brandLogo} alt="logo" className="card-badge" />
                            </div>
                            <div className="category-info">
                                <h4 className="category-name">{cat.name}</h4>
                                <button className="view-products-btn">
                                    EXPLORE <FaArrowRight style={{ marginLeft: '8px' }} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}