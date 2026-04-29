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
import CustomCursor from "./components/CustomCursor";
import PageTransition from "./components/PageTransition";
import ConsentManager from "./components/ConsentManager";
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

// --- LEGAL PAGES ---
const ShippingPolicy = lazy(() => import("./pages/legal/ShippingPolicy"));
const ReturnsPolicy = lazy(() => import("./pages/legal/ReturnsPolicy"));
const TermsOfService = lazy(() => import("./pages/legal/TermsOfService"));
const SafetyCompliance = lazy(() => import("./pages/legal/SafetyCompliance"));

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
/**
 * Minimal Premium Loading Fallback for Suspense
 * Designed to feel like the "Silent Authority" Preloader but lightweight.
 */
const PageLoader = () => (
    <div className="minimal-premium-loader" style={{ 
        height: '90vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '40px' 
    }}>
        <div className="minimal-loader-icon" style={{ position: 'relative', width: '80px', height: '80px' }}>
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="var(--accent-gold)" strokeWidth="0.5" opacity="0.1" />
                <path d="M50 20C50 20 70 40 70 60C70 71.0457 61.0457 80 50 80C38.9543 80 30 71.0457 30 60C30 40 50 20 50 20Z" 
                    fill="none" 
                    stroke="var(--accent-gold)" 
                    strokeWidth="1.5"
                    strokeDasharray="10 190"
                >
                    <animateTransform 
                        attributeName="transform" 
                        type="rotate" 
                        from="0 50 50" 
                        to="360 50 50" 
                        dur="1.5s" 
                        repeatCount="indefinite" 
                    />
                </path>
            </svg>
        </div>
        <div style={{ textAlign: 'center' }}>
            <span style={{ 
                fontFamily: 'var(--font-ui)', 
                fontSize: '0.65rem', 
                letterSpacing: '6px', 
                color: 'var(--accent-gold)', 
                opacity: 0.5, 
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '10px'
            }}>
                Refining
            </span>
            <div style={{ 
                width: '100px', 
                height: '1px', 
                background: 'linear-gradient(90deg, transparent, var(--accent-gold), transparent)',
                margin: '0 auto'
            }}></div>
        </div>
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
                <PageTransition>
                    {(stableLocation) => (
                        <>
                            <Suspense fallback={<PageLoader />}>
                                <Routes location={stableLocation}>
                                    <Route path="/" element={<Home />} />
                                    <Route path="/products" element={<Products />} />
                                    <Route path="/product/:productId" element={<ProductDetail />} />
                                    <Route path="/about" element={<About />} />
                                    <Route path="/contact" element={<Contact />} />
                                    <Route path="/certification" element={<Certification />} />
                                    <Route path="/login" element={<Login />} />
                                    <Route path="/register" element={<Register />} />
                                    <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
                                    
                                    {/* Legal Routes */}
                                    <Route path="/shipping" element={<ShippingPolicy />} />
                                    <Route path="/returns" element={<ReturnsPolicy />} />
                                    <Route path="/terms" element={<TermsOfService />} />
                                    <Route path="/privacy" element={<SafetyCompliance />} />

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
                            </Suspense>
                            {!isAuthPage && <Footer />}
                        </>
                    )}
                </PageTransition>
            </div>
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
            // Hold the 100% state briefly for a more deliberate transition
            setTimeout(() => {
                setIsAppLoading(false);
                window.JGM_INITIAL_LOAD_COMPLETE = true;
            }, 500);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
            // Faster fallback for better UX
            const fallback = setTimeout(handleLoad, 3000);
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
            <CustomCursor />
            <Toaster position="top-center" />
            <Preloader isAppLoading={isAppLoading} />
            <ConsentManager />
            <AppLayout />
        </Router>
    );
}

export default App;