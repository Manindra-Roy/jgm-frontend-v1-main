import { useEffect } from 'react';

/**
 * Custom hook to trigger reveal animations on scroll.
 * Finds all elements with the .reveal class and adds the .active class when they enter the viewport.
 * @param {Array} dependencies - Optional list of variables that, when changed, should re-trigger the observer.
 */
export default function useReveal(dependencies = []) {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, observerOptions);

        // Find all revealable elements. We use a slight delay to ensure 
        // that elements rendered via async data are present in the DOM.
        const timer = setTimeout(() => {
            const elements = document.querySelectorAll('.reveal');
            elements.forEach(el => observer.observe(el));
        }, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, dependencies); // Re-run when dependencies (like data arrays) change
}
