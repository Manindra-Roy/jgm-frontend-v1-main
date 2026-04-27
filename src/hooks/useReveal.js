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

        // Find all revealable elements. We wait until the initial load is complete
        // and no page transition is active to ensure the animations are visible.
        const initObserver = () => {
            const isTransitioning = document.querySelector('.page-transition-wrapper.wiping');
            const isInitialLoading = !window.JGM_INITIAL_LOAD_COMPLETE;

            if (isInitialLoading || isTransitioning) {
                // Check again shortly
                const retryTimer = setTimeout(initObserver, 100);
                return retryTimer;
            }

            const elements = document.querySelectorAll('.reveal');
            elements.forEach(el => observer.observe(el));
        };

        const timer = setTimeout(initObserver, 100);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, dependencies); // Re-run when dependencies (like data arrays) change
}
