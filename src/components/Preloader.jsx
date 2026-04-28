/**
 * @fileoverview God-Level Premium Preloader 6.0
 * Ultimate Authority Edition: Physics-based particles & Scramble Reveal.
 */

import { useState, useEffect } from 'react';
import './Preloader.css';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default function Preloader({ isAppLoading }) {
    const [progress, setProgress] = useState(0);
    const [shouldRender, setShouldRender] = useState(true);
    const [scrambledText, setScrambledText] = useState('JGM INDUSTRIES');
    const targetText = 'JGM INDUSTRIES';

    useEffect(() => {
        if (!isAppLoading) {
            setProgress(100);
            setScrambledText(targetText);
            return;
        }
        
        const timer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 98) return prev;
                return Math.min(prev + (Math.random() * 10), 98);
            });
        }, 150);

        // Text Scramble Effect
        let iteration = 0;
        const scrambleTimer = setInterval(() => {
            setScrambledText(prev => 
                targetText.split('').map((char, index) => {
                    if (index < iteration) return targetText[index];
                    return characters[Math.floor(Math.random() * 26)];
                }).join('')
            );
            
            if (iteration >= targetText.length) {
                clearInterval(scrambleTimer);
            }
            iteration += 1/3;
        }, 30);

        return () => {
            clearInterval(timer);
            clearInterval(scrambleTimer);
        };
    }, [isAppLoading]);

    useEffect(() => {
        if (!isAppLoading) {
            const unmountTimer = setTimeout(() => setShouldRender(false), 2000);
            return () => clearTimeout(unmountTimer);
        }
    }, [isAppLoading]);

    if (!shouldRender) return null;

    return (
        <div className={`preloader-wrapper ${!isAppLoading ? 'closing' : ''}`}>
            <div className="preloader-panel-top"></div>
            <div className="preloader-panel-bottom"></div>
            <div className="mesh-gradient-bg"></div>
            
            {/* Custom SVG Botanical Particles */}
            <div className="botanical-field">
                {[...Array(6)].map((_, i) => (
                    <svg key={i} className={`botanical-svg p${i+1}`} viewBox="0 0 50 50">
                        <path d="M25 5C25 5 40 20 40 35C40 43.2843 33.2843 50 25 50C16.7157 50 10 43.2843 10 35C10 20 25 5 25 5Z" fill="white" fillOpacity="0.05" />
                    </svg>
                ))}
            </div>
            
            <div className="preloader-content">
                <div className="logo-svg-container">
                    <svg viewBox="0 0 200 200" className="brand-svg-animated">
                        <circle cx="100" cy="100" r="90" className="circle-trace" />
                        <path d="M100 40C100 40 140 80 140 120C140 142.091 122.091 160 100 160C77.9086 160 60 142.091 60 120C60 80 100 40 100 40Z" className="leaf-body" />
                        <path d="M100 40V160" className="center-vein" />
                    </svg>
                </div>
                
                <div className="editorial-title-reveal">
                    <span className="brand-eyebrow">Silent Authority</span>
                    <h2 className="brand-name-scramble">{scrambledText}</h2>
                </div>

                <div className="loading-state-container">
                    <div className="progress-display">
                        <span className="current-val">{Math.round(progress)}</span>
                        <span className="total-val">/100</span>
                    </div>
                    <div className="premium-progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="loading-status">Distilling Nature's Essence</p>
                </div>
            </div>
        </div>
    );
}