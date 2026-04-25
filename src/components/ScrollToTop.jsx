import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Utility component that resets scroll position to the top of the page
 * every time the application's route changes.
 */
export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}
