/**
 * @fileoverview Main Landing Page Component.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import homeBg from '../assets/home-bg.jpg';
import './Home.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import Magnetic from '../components/Magnetic';
import Tilt from '../components/Tilt';
import ScrambleHeading from '../components/ScrambleHeading';
import PremiumButton from '../components/PremiumButton';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    
    // Trigger global scroll reveal when categories are loaded
    useReveal([categories]);

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

    return (
        <div className="home-container">
            <SEO 
                title="JGM Industries | Awakening Pure Wellness" 
                description="Crafted from pure, powerful herbs. Premium herbal wellness solutions for a natural lifestyle." 
                url="https://jgm-industries.com/"
            />

            <section 
                className="hero-section" 
                style={{ 
                    backgroundImage: `url(${homeBg})`
                }}
            >
                <div className="hero-content">
                    <div className="hero-text-block">
                        <h2 className="reveal text-reveal">Awakening Pure Wellness</h2>
                        <h1 className="reveal delay-1 text-reveal">JGM INDUSTRIES</h1>
                        <p className="reveal delay-2">
                            Crafted from pure, powerful herbs. <br/>
                            We blend ancient wisdom with modern precision to care for you the natural way.
                        </p>
                        <div className="hero-cta-group reveal delay-3">
                            <Magnetic>
                                <PremiumButton variant="gold" onClick={() => navigate('/products')}>
                                    EXPLORE COLLECTION
                                </PremiumButton>
                            </Magnetic>
                            <Magnetic>
                                <PremiumButton variant="outline" onClick={() => navigate('/about')}>
                                    OUR STORY
                                </PremiumButton>
                            </Magnetic>
                        </div>
                    </div>

                    <div className="hero-stats-panel reveal delay-3">
                        <div className="hero-stat-item">
                            <h4>100%</h4>
                            <p>Herbal <br/> Purity</p>
                        </div>
                        <div className="hero-stat-item">
                            <h4>02</h4>
                            <p>Premium <br/> Brands</p>
                        </div>
                        <div className="hero-stat-item">
                            <h4>50+</h4>
                            <p>Natural <br/> Remedies</p>
                        </div>
                        <div className="hero-stat-item">
                            <h4>ISO</h4>
                            <p>Certified <br/> Quality</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="brands-cinematic">
                <div className="brand-portal jgm-portal reveal" onClick={() => navigate('/products?category=jgm')}>
                    <div className="portal-overlay"></div>
                    <div className="portal-content">
                        <span className="portal-tag">Rooted in Tradition</span>
                        <h3 className="portal-title">JAI GOU MATA</h3>
                        <p className="portal-desc">Ancient Vedic wisdom preserved for modern healing. Pure, sacred, and powerful.</p>
                        <button className="btn-premium btn-outline-premium">DISCOVER THE SACRED</button>
                    </div>
                </div>
                <div className="brand-portal zio-portal reveal delay-1" onClick={() => navigate('/products?category=zio')}>
                    <div className="portal-overlay"></div>
                    <div className="portal-content">
                        <span className="portal-tag">The Essence of Science</span>
                        <h3 className="portal-title">ZIO</h3>
                        <p className="portal-desc">Next-generation herbal extraction. Precision-engineered for absolute potency.</p>
                        <button className="btn-premium btn-outline-premium">EXPLORE THE FUTURE</button>
                    </div>
                </div>
            </section>

            <section className="categories-section">
                <div className="kinetic-text">PURE ORGANIC WELLNESS PURE ORGANIC WELLNESS</div>
                <div style={{ textAlign: 'center', marginBottom: '60px', position: 'relative', zIndex: 1 }}>
                    <span className="section-tag reveal">Explore Nature</span>
                    <ScrambleHeading text="THE WELLNESS GARDEN" className="section-title-large" />
                </div>

                <div className="category-grid">
                    {categories.map((cat, index) => (
                        <Tilt key={cat.id || cat._id}>
                            <div 
                                className="category-card reveal" 
                                style={{ transitionDelay: `${(index % 3) * 0.1}s` }} 
                                onClick={() => navigate(`/products?category=${cat.id || cat._id}`)}
                            >
                                <div className="category-img-wrapper">
                                    {cat.image ? (
                                        <img src={cat.image} alt={cat.name} />
                                    ) : (
                                        <div className="placeholder">🌿</div>
                                    )}
                                </div>
                                <div className="category-info">
                                    <h4>{cat.name}</h4>
                                    <button className="view-products-btn">
                                        DISCOVER <FaArrowRight style={{ marginLeft: '10px' }} />
                                    </button>
                                </div>
                            </div>
                        </Tilt>
                    ))}
                </div>
            </section>

            <section className="newsletter-section reveal">
                <div className="newsletter-card">
                    <span className="section-tag">Stay Connected</span>
                    <h3 className="section-title-large">JOIN THE INNER CIRCLE</h3>
                    <p>Subscribing to our narrative gives you exclusive access to fresh batch releases and ancient wellness insights.</p>
                    <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); toast.success("Welcome to the Inner Circle."); }}>
                        <input type="email" placeholder="Enter your digital correspondence" required />
                        <button type="submit" className="btn-premium">SUBSCRIBE</button>
                    </form>
                </div>
            </section>
        </div>
    );
}