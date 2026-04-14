/**
 * @fileoverview Certifications Editorial Page Component.
 * Displays trust badges and quality assurance standards met by the brand.
 */

import { useEffect } from 'react';
import { FaLeaf, FaAward, FaShieldAlt } from 'react-icons/fa';
import './Editorial.css';

export default function Certification() {
    useEffect(() => window.scrollTo(0, 0), []);

    const certs = [
        { title: "FSSAI Registered", desc: "Compliant with the Food Safety and Standards Authority of India, ensuring absolute safety for consumption.", icon: <FaShieldAlt /> },
        { title: "100% Organic", desc: "Sourced from certified organic farms without the use of synthetic pesticides or fertilizers.", icon: <FaLeaf /> },
        { title: "ISO 9001:2015", desc: "Manufactured in a facility adhering to strict international quality management systems.", icon: <FaAward /> }
    ];

    return (
        <div className="editorial-wrapper">
            <div className="editorial-container animate-fade-up">
                <div className="editorial-header">
                    <h1>Our Certifications</h1>
                    <p>Verified purity. We don't just promise quality; we prove it.</p>
                </div>
                
                <div className="cert-grid delay-1 animate-fade-up">
                    {certs.map((cert, idx) => (
                        <div key={idx} className="cert-card">
                            <div className="cert-icon">{cert.icon}</div>
                            <h3 style={{ fontFamily: 'var(--font-secondary)', color: 'var(--primary-red)', marginBottom: '15px' }}>{cert.title}</h3>
                            <p style={{ color: '#555', lineHeight: '1.6' }}>{cert.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}