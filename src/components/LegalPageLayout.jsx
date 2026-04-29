/**
 * @fileoverview Reusable layout wrapper for all legal and compliance pages.
 * Enforces the "Silent Authority" editorial design language for text-heavy documents.
 */

import './LegalPageLayout.css';
import SEO from './SEO';
import useReveal from '../hooks/useReveal';

function LegalPageLayout({ title, lastUpdated, children }) {
    useReveal();
    
    return (
        <div className="legal-page-container">
            <SEO 
                title={`${title} | JGM Industries`} 
                description={`Read the ${title.toLowerCase()} for JGM Industries.`} 
            />
            
            <header className="legal-header reveal">
                <span className="editorial-eyebrow">Legal & Compliance</span>
                <h1 className="legal-title">{title}</h1>
                <p className="legal-updated">Last Updated: {lastUpdated}</p>
            </header>

            <article className="legal-content reveal delay-1">
                {children}
            </article>
        </div>
    );
}

export default LegalPageLayout;
