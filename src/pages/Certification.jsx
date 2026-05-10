import { useEffect, useState } from 'react';
import { FaAward, FaIndustry, FaFileContract } from 'react-icons/fa';
import './Editorial.css';
import SEO from '../components/SEO';
import useReveal from '../hooks/useReveal';

import Tilt from '../components/Tilt';
import CertificateModal from '../components/CertificateModal';

export default function Certification() {
    const [selectedCert, setSelectedCert] = useState(null);
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
                description="Verified purity. JGM Industries is ISO 9001:2015 certified and registered under Udyam MSME."
                url="https://www.jgmindustries.in/certification"
                jsonLd={{
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Quality Certifications - JGM Industries",
                    "description": "ISO and Government of India registrations for JGM Industries."
                }}
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
                            <div 
                                className="cert-card" 
                                style={{ cursor: 'pointer' }}
                                title={`View ${cert.title} Certificate`}
                                onClick={() => setSelectedCert(cert)}
                            >
                                <div className="cert-icon">{cert.icon}</div>
                                <h3>{cert.title}</h3>
                                <p>{cert.desc}</p>
                            </div>
                        </Tilt>
                    ))}
                </div>
            </div>

            <CertificateModal 
                isOpen={!!selectedCert}
                onClose={() => setSelectedCert(null)}
                pdfUrl={selectedCert?.pdfUrl}
                title={selectedCert?.title}
            />
        </div>
    );
}