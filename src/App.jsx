/**
 * @fileoverview Main Application Router & Entry Point.
 * Handles the global Preloader, WebSocket connections for live analytics,
 * and standard/protected routing for all React pages.
 */

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from 'react'; 
import { io } from 'socket.io-client'; 

// --- COMPONENTS & PAGES ---
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Preloader from "./components/Preloader";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from './pages/Register';
import DirectCheckout from "./pages/DirectCheckout";
import PaymentSuccess from "./pages/PaymentSuccess";
import ProductDetail from "./pages/ProductDetail";
import Profile from "./pages/Profile";

// --- EDITORIAL PAGES ---
import About from "./pages/About";
import Contact from "./pages/Contact";
import Certification from "./pages/Certification";

/**
 * Higher-Order Component to protect private routes.
 * Checks local storage for the authentication flag. If false, redirects to login.
 * @param {Object} props - Contains the child components to render if authenticated.
 */
const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('is_customer_authenticated') === 'true';
    const location = useLocation();
    
    if (!isAuthenticated) {
        // Redirect to login, but remember where they were trying to go
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

function App() {
    // Global state to control the initial branding preloader
    const [isAppLoading, setIsAppLoading] = useState(true);

    /**
     * Effect: Controls the Preloader display duration.
     * Hides the preloader after exactly 2 seconds to allow CSS animations to finish.
     */
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsAppLoading(false);
        }, 2000); 
        
        return () => clearTimeout(timer);
    }, []);

    /**
     * Effect: Establishes a WebSocket connection for real-time live user tracking.
     * Connects to the base URL (stripping the /api/v1 suffix).
     */
    useEffect(() => {
        const baseUrl = import.meta.env.VITE_API_URL 
            ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
            : 'http://localhost:3000';
            
        const socket = io(baseUrl);

        return () => {
            socket.disconnect(); // Cleanup connection on unmount
        };
    }, []);

    // Block rendering of the main app until the preloader finishes
    if (isAppLoading) {
        return <Preloader />;
    }

    return (
        <Router>
            {/* Global toast notification container */}
            <Toaster position="top-center" />
            <Navbar />
            
            <div className="main-content">
                <Routes>
                    {/* --- PUBLIC CATALOG ROUTES --- */}
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:productId" element={<ProductDetail />} />
                    
                    {/* --- PUBLIC EDITORIAL ROUTES --- */}
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/certification" element={<Certification />} />

                    {/* --- AUTHENTICATION ROUTES --- */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />

                    {/* --- PROTECTED CUSTOMER ROUTES --- */}
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
            </div>
            <Footer />
        </Router>
    );
}

export default App;