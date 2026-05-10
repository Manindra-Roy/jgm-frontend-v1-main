/**
 * @fileoverview Certifications Editorial Page Component.
 */

import { useEffect } from 'react';
import { FaAward, FaIndustry, FaFileContract } from 'react-icons/fa';
import './Editorial.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';

import Tilt from '../components/Tilt';

export default function Certification() {
    useReveal();
    useEffect(() => window.scrollTo(0, 0), []);

    const certs = [
        { 
            title: "ISO Certificate", 
            desc: "Adhering to strict international quality management systems to ensure premium product standards.", 
            icon: <FaAward />,
            pdfUrl: "/certificates/Iso.pdf"
        },
        { 
            title: "Udyam Registration", 
            desc: "Officially registered under the Ministry of Micro, Small and Medium Enterprises, Government of India.", 
            icon: <FaIndustry />,
            pdfUrl: "/certificates/udyam.pdf"
        },
        { 
            title: "Trade Licence", 
            desc: "Authorized by local municipal authorities to conduct business operations legally and transparently.", 
            icon: <FaFileContract />,
            pdfUrl: "/certificates/trade-licence.pdf"
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
                            <a 
                                href={cert.pdfUrl} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <div 
                                    className="cert-card" 
                                    style={{ cursor: 'pointer' }}
                                    title={`View ${cert.title} Certificate`}
                                >
                                    <div className="cert-icon">{cert.icon}</div>
                                    <h3>{cert.title}</h3>
                                    <p>{cert.desc}</p>
                                </div>
                            </a>
                        </Tilt>
                    ))}
                </div>
            </div>
        </div>
    );
}