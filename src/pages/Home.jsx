/**
 * @fileoverview Rebuilt Home Page (Silent Authority 3.0)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import heroCinematic from '../assets/hero-cinematic.png';
import './Home.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import PremiumButton from '../components/PremiumButton';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    
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
                title="JGM Industries | The Authority in Pure Wellness" 
                description="Ancient wisdom meets modern precision. Experience herbal purity at its finest." 
            />

            <section className="hero-section">
                <div className="hero-cinematic-bg">
                    <img src={heroCinematic} alt="Botanical Diorama" />
                    <div className="hero-overlay"></div>
                </div>

                <div className="hero-content-wrapper container-editorial">
                    <div className="hero-text-content reveal">
                        <span className="editorial-eyebrow">Established Excellence</span>
                        <h1 className="hero-title">
                            Awakening <br />
                            <span className="italic">Pure Wellness</span>
                        </h1>
                        <p className="hero-description">
                            We blend ancient Vedic wisdom with modern precision to craft herbal solutions that define natural purity.
                        </p>
                        <div className="hero-actions">
                            <PremiumButton variant="gold" onClick={() => navigate('/products')}>
                                EXPLORE THE COLLECTION
                            </PremiumButton>
                        </div>
                    </div>
                </div>

                <div className="scroll-indicator">
                    <div className="scroll-line"></div>
                    <span>SCROLL</span>
                </div>
            </section>

            <section className="heritage-pillars container-editorial">
                <div className="pillars-grid-v2">
                    <div className="pillar-item-v2 reveal">
                        <span className="pillar-number">01</span>
                        <h3 className="pillar-title">PURITY</h3>
                        <p className="pillar-text">Sourced from the heart of the Himalayas, our botanicals remain untouched by modern contaminants.</p>
                    </div>
                    <div className="pillar-item-v2 reveal delay-1">
                        <span className="pillar-number">02</span>
                        <h3 className="pillar-title">PRECISION</h3>
                        <p className="pillar-text">We utilize proprietary extraction protocols that preserve the molecular integrity of every herb.</p>
                    </div>
                    <div className="pillar-item-v2 reveal delay-2">
                        <span className="pillar-number">03</span>
                        <h3 className="pillar-title">PRESERVATION</h3>
                        <p className="pillar-text">Ancient Vedic methodologies meet modern vacuum-sealing to ensure timeless potency.</p>
                    </div>
                </div>
            </section>

            <section className="brand-split-section container-editorial">
                <div className="split-grid">
                    <div className="brand-editorial-card reveal" onClick={() => navigate('/products?category=jgm')}>
                        <span className="editorial-eyebrow">Sacred Roots</span>
                        <h3>JAI GOU MATA</h3>
                        <p>Preserving the integrity of ancient formulations for holistic healing and restoration.</p>
                        <PremiumButton variant="outline">DISCOVER THE SACRED</PremiumButton>
                    </div>
                    <div className="brand-editorial-card reveal delay-1" onClick={() => navigate('/products?category=zio')}>
                        <span className="editorial-eyebrow">Scientific Precision</span>
                        <h3>ZIO</h3>
                        <p>Next-generation botanical extraction engineered for absolute potency and performance.</p>
                        <PremiumButton variant="outline">EXPLORE THE FUTURE</PremiumButton>
                    </div>
                </div>
            </section>

            <section className="category-section container-editorial">
                <div className="section-header reveal">
                    <span className="editorial-eyebrow">Our Botanical Range</span>
                    <h2 className="section-title">THE WELLNESS GARDEN</h2>
                </div>

                <div className="category-grid">
                    {categories.map((cat, index) => (
                        <div 
                            key={cat.id || cat._id}
                            className="category-card reveal" 
                            style={{ transitionDelay: `${(index % 3) * 0.1}s` }} 
                            onClick={() => navigate(`/products?category=${cat.id || cat._id}`)}
                        >
                            <div className="cat-img-wrapper">
                                {cat.image ? (
                                    <img src={cat.image} alt={cat.name} />
                                ) : (
                                    <div className="placeholder">🌿</div>
                                )}
                            </div>
                            <h4>{cat.name}</h4>
                            <PremiumButton variant="outline">VIEW COLLECTION</PremiumButton>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}