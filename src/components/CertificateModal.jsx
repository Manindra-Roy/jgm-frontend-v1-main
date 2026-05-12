import { useEffect } from 'react';
import './CertificateModal.css';

export default function CertificateModal({ isOpen, onClose, pdfUrl, title }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Block Ctrl+S (Save) and Ctrl+P (Print)
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
                e.preventDefault();
                // toast.error("Download and Print are disabled for security.");
            }
        };

        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    if (!isOpen) return null;

    // Prevent right-click to discourage downloading
    const handleContextMenu = (e) => {
        e.preventDefault();
    };

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const absolutePdfUrl = `${window.location.origin}${pdfUrl}`;
    const iframeSrc = isMobile && window.location.hostname !== 'localhost'
        ? `https://docs.google.com/gview?url=${encodeURIComponent(absolutePdfUrl)}&embedded=true`
        : `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;

    return (
        <div className="cert-modal-overlay" onClick={onClose} onContextMenu={handleContextMenu}>
            <div className="cert-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="cert-modal-header">
                    <div className="header-info">
                        <span className="protected-tag">PROTECTED VIEW</span>
                        <h3>{title}</h3>
                    </div>
                    <button className="cert-close-btn" onClick={onClose}>
                        <span>CLOSE</span>
                        <div className="close-icon-line"></div>
                    </button>
                </div>

                <div className="cert-viewer-content">
                    <div className="viewer-wrapper">
                        <iframe 
                            src={iframeSrc} 
                            title={title}
                            className="cert-iframe"
                            frameBorder="0"
                            style={isMobile ? { height: '80vh', width: '100%' } : { height: '6000px', width: '100%' }}
                        ></iframe>
                        {/* Transparent overlay covers the entire scrollable area */}
                        <div 
                            className="viewer-protection-overlay" 
                            onContextMenu={(e) => e.preventDefault()}
                        ></div>
                    </div>
                </div>

                <div className="cert-modal-footer">
                    <p>This document is for viewing purposes only. JGM Industries Official Certification.</p>
                </div>
            </div>
        </div>
    );
}
