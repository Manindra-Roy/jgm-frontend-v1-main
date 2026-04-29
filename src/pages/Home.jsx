/**
 * @fileoverview Rebuilt Home Page (Silent Authority 3.0)
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// Cinematic Hero Assets
import hero1 from '../assets/hero-cinematic-v1.png';
import hero2 from '../assets/hero-cinematic-v2.png';
import hero3 from '../assets/hero-cinematic-v3.png';
import hero4 from '../assets/hero-cinematic-v4.png';
import hero5 from '../assets/hero-cinematic-v5.png';
import hero6 from '../assets/hero-cinematic-v6.png';

const heroSlides = [hero1, hero2, hero3, hero4, hero5, hero6];

import './Home.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';
import PremiumButton from '../components/PremiumButton';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(Math.floor(Math.random() * heroSlides.length));
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);
    const navigate = useNavigate();
    

    
    useReveal([categories]);

    // Slideshow Logic
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1024);
        window.addEventListener('resize', handleResize);

        if (isMobile) return () => window.removeEventListener('resize', handleResize);

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 8000); // 8 seconds per slide for majestic pacing

        return () => {
            clearInterval(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [heroSlides.length, isMobile]);

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
                <div className="hero-slideshow">
                    {isMobile ? (
                        <div className="hero-slide active">
                            <img src={hero5} alt="JGM Industries Cinematic Mobile" />
                        </div>
                    ) : (
                        heroSlides.map((slide, index) => (
                            <div 
                                key={index} 
                                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
                            >
                                <img src={slide} alt={`JGM Industries Cinematic ${index + 1}`} />
                            </div>
                        ))
                    )}
                    <div className="hero-overlay"></div>
                </div>

                <div className="hero-content-wrapper container-editorial">
                    <div className="hero-text-content reveal">
                        <span className="editorial-eyebrow">Established Excellence</span>
                        <h1 className="hero-title">
                            JGM <br />
                            <span className="italic">INDUSTRIES</span>
                        </h1>
                        <p className="hero-description">
                            We blend ancient Vedic wisdom with modern precision to craft herbal solutions that define natural purity.
                        </p>
                        <div className="hero-actions">
                            <PremiumButton variant="cinematic" onClick={() => navigate('/products')}>
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
                    <div className="brand-editorial-card reveal" onClick={() => navigate('/products?brand=jgm')}>
                        <span className="editorial-eyebrow">Sacred Roots</span>
                        <h3>JAI GOU MATA</h3>
                        <p>Preserving the integrity of ancient formulations for holistic healing and restoration.</p>
                        <PremiumButton 
                            variant="sacred" 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/products?brand=jgm');
                            }}
                        >
                            DISCOVER THE SACRED
                        </PremiumButton>
                    </div>
                    <div className="brand-editorial-card reveal delay-1" onClick={() => navigate('/products?brand=zio')}>
                        <span className="editorial-eyebrow">Scientific Precision</span>
                        <h3>ZIO</h3>
                        <p>Next-generation botanical extraction engineered for absolute potency and performance.</p>
                        <PremiumButton 
                            variant="sacred" 
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate('/products?brand=zio');
                            }}
                        >
                            EXPLORE THE FUTURE
                        </PremiumButton>
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
                            <PremiumButton 
                                variant="outline"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/products?category=${cat.id || cat._id}`);
                                }}
                            >
                                VIEW COLLECTION
                            </PremiumButton>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}