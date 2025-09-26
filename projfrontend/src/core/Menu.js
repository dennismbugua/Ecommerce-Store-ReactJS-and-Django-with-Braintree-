import React, { Fragment, useState, useEffect } from "react";
import { Link, withRouter } from "react-router-dom";
import { signout, isAuthenticated } from "../auth/helper";
import { loadCart } from "./helper/CartHelper";
import "./Menu.css";

const Menu = ({ history }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState(0);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        // Apply theme to document
        const applyTheme = (darkMode) => {
            const root = document.documentElement;
            root.setAttribute('data-theme', darkMode ? 'dark' : 'light');
            
            // Also apply class for backward compatibility
            if (darkMode) {
                root.classList.add('dark-theme');
                root.classList.remove('light-theme');
            } else {
                root.classList.add('light-theme');
                root.classList.remove('dark-theme');
            }
        };

        // Apply initial theme
        applyTheme(isDarkMode);
        
        // Update cart count
        const updateCartCount = () => {
            const cart = loadCart();
            // Ensure cart is always an array before accessing length
            setCartItemCount(Array.isArray(cart) ? cart.length : 0);
        };

        updateCartCount();
        
        // Listen for cart updates
        window.addEventListener('cartUpdated', updateCartCount);
        
        // Scroll handler
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            setIsScrolled(scrollTop > 50);
            setScrollProgress(scrollPercent);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, [isDarkMode]);

    const currentTab = (path) => {
        return history.location.pathname === path;
    };

    const handleSignout = () => {
        signout(() => {
            history.push("/");
            setIsMobileMenuOpen(false);
        });
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        localStorage.setItem('theme', newTheme ? 'dark' : 'light');
        
        // Add switching animation class
        const themeButton = document.querySelector('.theme-toggle');
        if (themeButton) {
            themeButton.classList.add('switching');
            setTimeout(() => {
                themeButton.classList.remove('switching');
            }, 600);
        }
        
        // Optional: Dispatch custom event for other components to listen to theme changes
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDarkMode: newTheme } }));
    };

    const NavLink = ({ to, children, className = "", onClick }) => (
        <Link
            to={to}
            className={`nav-link ${currentTab(to) ? 'active' : ''} ${className}`}
            onClick={onClick}
        >
            {children}
        </Link>
    );

    return (
        <>
            <nav className={`modern-nav ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    {/* Brand/Logo */}
                    <Link to="/" className="nav-brand">
                        <i className="fas fa-store"></i>
                        <span>EcoStore</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <ul className="nav-links">
                        <li className="nav-item">
                            <NavLink to="/" onClick={closeMobileMenu}>
                                <i className="fas fa-home"></i>
                                Home
                            </NavLink>
                        </li>

                        {isAuthenticated() && (
                            <li className="nav-item">
                                <NavLink to="/cart" onClick={closeMobileMenu}>
                                    <div className="cart-icon">
                                        <i className="fas fa-shopping-cart"></i>
                                        {cartItemCount > 0 && (
                                            <span className="cart-badge">{cartItemCount}</span>
                                        )}
                                    </div>
                                    Cart
                                </NavLink>
                            </li>
                        )}

                        {/* {isAuthenticated() && (
                            <li className="nav-item">
                                <NavLink to="/user/dashboard" onClick={closeMobileMenu}>
                                    <i className="fas fa-tachometer-alt"></i>
                                    Dashboard
                                </NavLink>
                            </li>
                        )} */}

                        {!isAuthenticated() && (
                            <Fragment>
                                <li className="nav-item">
                                    <NavLink to="/signup" onClick={closeMobileMenu}>
                                        <i className="fas fa-user-plus"></i>
                                        Sign Up
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/signin" onClick={closeMobileMenu}>
                                        <i className="fas fa-sign-in-alt"></i>
                                        Sign In
                                    </NavLink>
                                </li>
                            </Fragment>
                        )}

                        {isAuthenticated() && (
                            <li className="nav-item">
                                <button
                                    onClick={handleSignout}
                                    className="nav-link signout"
                                    style={{ border: 'none', background: 'transparent' }}
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    Sign Out
                                </button>
                            </li>
                        )}
                    </ul>

                    {/* Theme Toggle Button */}
                    <button
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                        title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
                    >
                        <div className="theme-toggle-inner">
                            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
                        </div>
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label="Toggle mobile menu"
                    >
                        <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                    </button>
                </div>

                {/* Scroll Progress Indicator */}
                <div 
                    className="scroll-progress" 
                    style={{ width: `${scrollProgress}%` }}
                ></div>

                {/* Mobile Navigation */}
                <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                    <ul className="mobile-nav-links">
                        <li className="nav-item">
                            <NavLink to="/" onClick={closeMobileMenu}>
                                <i className="fas fa-home"></i>
                                Home
                            </NavLink>
                        </li>

                        {isAuthenticated() && (
                            <li className="nav-item">
                                <NavLink to="/cart" onClick={closeMobileMenu}>
                                    <i className="fas fa-shopping-cart"></i>
                                    Cart
                                    {cartItemCount > 0 && (
                                        <span className="cart-badge">{cartItemCount}</span>
                                    )}
                                </NavLink>
                            </li>
                        )}

                        {isAuthenticated() && (
                            <li className="nav-item">
                                <NavLink to="/user/dashboard" onClick={closeMobileMenu}>
                                    <i className="fas fa-tachometer-alt"></i>
                                    Dashboard
                                </NavLink>
                            </li>
                        )}

                        {!isAuthenticated() && (
                            <Fragment>
                                <li className="nav-item">
                                    <NavLink to="/signup" onClick={closeMobileMenu}>
                                        <i className="fas fa-user-plus"></i>
                                        Sign Up
                                    </NavLink>
                                </li>
                                <li className="nav-item">
                                    <NavLink to="/signin" onClick={closeMobileMenu}>
                                        <i className="fas fa-sign-in-alt"></i>
                                        Sign In
                                    </NavLink>
                                </li>
                            </Fragment>
                        )}

                        {isAuthenticated() && (
                            <li className="nav-item">
                                <button
                                    onClick={handleSignout}
                                    className="nav-link signout"
                                    style={{ border: 'none', background: 'transparent', width: '100%' }}
                                >
                                    <i className="fas fa-sign-out-alt"></i>
                                    Sign Out
                                </button>
                            </li>
                        )}
                    </ul>
                </div>
            </nav>

            {/* Spacer to prevent content from hiding under fixed nav */}
            <div style={{ height: '70px' }}></div>
        </>
    );
};

export default withRouter(Menu);
