/**
 * @fileoverview About Us Editorial Page Component.
 */

import { useEffect } from 'react';
import './Editorial.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';

import Tilt from '../components/Tilt';
import Magnetic from '../components/Magnetic';
import PremiumButton from '../components/PremiumButton';
import { useNavigate } from 'react-router-dom';

export default function About() {
    const navigate = useNavigate();
    useReveal();
    useEffect(() => window.scrollTo(0, 0), []);

    return (
        <div className="editorial-wrapper">
            <SEO 
                title="Our Heritage | JGM Industries" 
                description="Rooted in ancient wisdom, crafted for modern wellness. Discover the legacy of JGM Industries."
                url="https://jgm-industries.com/about"
            />
            <div className="editorial-container">
                <div className="editorial-header reveal">
                    <span className="section-tag">Since Inception</span>
                    <h1 className="section-title">OUR HERITAGE</h1>
                    <p className="section-description">Ancient Wisdom. Modern Precision. A legacy of purity passed down through generations.</p>
                </div>

                <div className="pillars-grid">
                    <Tilt className="pillar-card reveal delay-1">
                        <div className="pillar-content">
                            <span className="pillar-icon">🌿</span>
                            <h3>THE GENESIS</h3>
                            <p>Authentic healing power of nature brought back into everyday life with unadulterated herbal wellness.</p>
                        </div>
                    </Tilt>
                    <Tilt className="pillar-card reveal delay-2">
                        <div className="pillar-content">
                            <span className="pillar-icon">⚖️</span>
                            <h3>DUAL IDENTITY</h3>
                            <p>Dual flagship brands JAI GOU MATA and ZIO, meticulously sourcing the highest quality raw herbs.</p>
                        </div>
                    </Tilt>
                    <Tilt className="pillar-card reveal delay-3">
                        <div className="pillar-content">
                            <span className="pillar-icon">✨</span>
                            <h3>UNCOMPROMISING PURITY</h3>
                            <p>Chemical-free herbal extracts verified for peak potency from our Darjeeling manufacturing hub.</p>
                        </div>
                    </Tilt>
                </div>

                <div className="editorial-story reveal">
                    <div className="story-content">
                        <h2>Crafting a Natural Future</h2>
                        <p>
                            From our manufacturing hub in Siliguri, Darjeeling, we deliver products that honor the sanctity of nature. 
                            When you choose JGM Industries, you are choosing a legacy of absolute care for your well-being.
                        </p>
                        <Magnetic>
                            <PremiumButton variant="gold" onClick={() => navigate('/products')} style={{ marginTop: '40px' }}>
                                VIEW OUR COLLECTION
                            </PremiumButton>
                        </Magnetic>
                    </div>
                </div>
            </div>
        </div>
    );
}