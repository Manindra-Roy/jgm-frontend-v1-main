/**
 * @fileoverview About Us Editorial Page Component.
 * Presents the brand's history, mission statement, and commitment to organic purity.
 */

import { useEffect } from 'react';
import './Editorial.css';
import SEO from '../components/SEO';

export default function About() {
    useEffect(() => window.scrollTo(0, 0), []);

    return (
        <div className="editorial-wrapper">
            <SEO 
                title="About Us | JGM Industries" 
                description="Rooted in ancient wisdom, crafted for modern wellness. Learn about our authentic healing power of nature."
                url="https://jgm-industries.com/about"
            />
            <div className="editorial-container animate-fade-up">
                <div className="editorial-header">
                    <h1>Our Heritage</h1>
                    <p>Rooted in ancient wisdom, crafted for modern wellness.</p>
                </div>
                <div className="about-content delay-1 animate-fade-up">
                    <p>Welcome to <strong>JGM Industries</strong>, the home of pure, unadulterated herbal wellness. Our journey began with a simple but profound mission: to bring the authentic healing power of nature back into everyday life.</p>
                    <p>Under our two flagship brands, <strong>JAI GOU MATA</strong> and <strong>ZIO</strong>, we meticulously source the highest quality raw herbs. We believe that nature provides the best remedies, which is why our manufacturing processes honor traditional Ayurvedic methods while adhering to strict modern hygiene and quality standards.</p>
                    <p>From our manufacturing hub in Siliguri, Darjeeling, we deliver products free from harmful chemicals, synthetic additives, and artificial preservatives. When you choose JGM Industries, you are choosing a legacy of purity, sustainability, and absolute care for your well-being.</p>
                </div>
            </div>
        </div>
    );
}