/**
 * @fileoverview Certifications Editorial Page Component.
 */

import { useEffect } from 'react';
import { FaLeaf, FaAward, FaShieldAlt } from 'react-icons/fa';
import './Editorial.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';

import Tilt from '../components/Tilt';

export default function Certification() {
    useReveal();
    useEffect(() => window.scrollTo(0, 0), []);

    const certs = [
        { 
            title: "FSSAI Registered", 
            desc: "Compliant with the Food Safety and Standards Authority of India, ensuring absolute safety for consumption.", 
            icon: <FaShieldAlt /> 
        },
        { 
            title: "100% Organic", 
            desc: "Sourced from certified organic farms without the use of synthetic pesticides or fertilizers.", 
            icon: <FaLeaf /> 
        },
        { 
            title: "ISO 9001:2015", 
            desc: "Manufactured in a facility adhering to strict international quality management systems.", 
            icon: <FaAward /> 
        }
    ];

    return (
        <div className="editorial-wrapper">
            <SEO 
                title="Our Certifications | JGM Industries" 
                description="Verified purity. We don't just promise quality; we prove it through rigorous certifications."
                url="https://jgm-industries.com/certification"
            />
            <div className="editorial-container">
                <div className="editorial-header reveal">
                    <span className="section-tag">Quality Guaranteed</span>
                    <h1 className="section-title">PURELY CERTIFIED</h1>
                    <p className="section-description">Verified Excellence. Unmatched Purity. We don't just promise quality; we prove it.</p>
                </div>
                
                <div className="cert-grid">
                    {certs.map((cert, idx) => (
                        <Tilt key={idx} className="cert-card-tilt reveal" style={{ transitionDelay: `${idx * 0.1}s` }}>
                            <div className="cert-card">
                                <div className="cert-icon">{cert.icon}</div>
                                <h3>{cert.title}</h3>
                                <p>{cert.desc}</p>
                            </div>
                        </Tilt>
                    ))}
                </div>
            </div>
        </div>
    );
}