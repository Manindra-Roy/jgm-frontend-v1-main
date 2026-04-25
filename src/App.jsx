/**
 * @fileoverview Main Application Router & Entry Point.
 * Handles the global Preloader, WebSocket connections for live analytics,
 * and standard/protected routing for all React pages.
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState, lazy, Suspense } from 'react'; 
import { io } from 'socket.io-client'; 

// --- COMPONENTS ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import { SOCKET_URL } from "./services/api";

// --- STATIC PAGES (Critical for FCP) ---
import Home from "./pages/Home";

// --- LAZY LOADED PAGES ---
const Products = lazy(() => import("./pages/Products"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const DirectCheckout = lazy(() => import("./pages/DirectCheckout"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Certification = lazy(() => import("./pages/Certification"));

/**
 * Higher-Order Component to protect private routes.
 */
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('is_customer_authenticated') === 'true';
    const location = useLocation();
    
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

/**
 * Simple Loading Fallback for Suspense
 */
const PageLoader = () => (
    <div style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="loader-dots" style={{ opacity: 0.5 }}></div>
    </div>
);

/**
 * Layout wrapper that conditionally hides the Footer on auth pages.
 */
function AppLayout() {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            <Navbar />
            <div className="main-content">
                <Suspense fallback={<PageLoader />}>
                    <PageTransition>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/products" element={<Products />} />
                            <Route path="/product/:productId" element={<ProductDetail />} />
                            <Route path="/about" element={<About />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/certification" element={<Certification />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />

                            <Route path="/profile" element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } />
                            
                            <Route path="/checkout/:productId" element={
                                <ProtectedRoute>
                                    <DirectCheckout />
                                </ProtectedRoute>
                            } />
                        </Routes>
                    </PageTransition>
                </Suspense>
            </div>
            {!isAuthPage && <Footer />}
        </>
    );
}

function App() {
    const [isAppLoading, setIsAppLoading] = useState(true);

    /**
     * Effect: Controls the Preloader.
     * We wait for the window to fully load and then clear the preloader.
     */
    useEffect(() => {
        const handleLoad = () => {
            // Give a tiny buffer for CSS animations to settle
            setTimeout(() => setIsAppLoading(false), 500);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            // Fallback timeout: on extremely slow connections, hide preloader after 8s 
            // so the user isn't stuck forever, but give assets a real chance to load.
            const fallback = setTimeout(handleLoad, 8000);
            return () => {
                window.removeEventListener('load', handleLoad);
                clearTimeout(fallback);
            };
        }
    }, []);

    useEffect(() => {
        const socket = io(SOCKET_URL);
        return () => socket.disconnect();
    }, []);

    return (
        <Router>
            <div className="blob-container">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>
            <CustomCursor />
            <ScrollToTop />
            <Toaster position="top-center" />
            <Preloader isAppLoading={isAppLoading} />
            <AppLayout />
        </Router>
    );
}

export default App;