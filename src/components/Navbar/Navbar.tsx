// fe/src/components/Navbar/Navbar.tsx

import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/authContext'; // Make sure this path is correct
import { Menu, X, ChevronDown, ChevronUp } from 'lucide-react';
import './Navbar.scss';
import PrimaryLogo from "../../assets/logo-images/cred-edge-nav-logo.svg";

const Navbar: React.FC = () => {
    const {
        user,
        loading,
        isAuthenticated, // Now this comes from the context
        hasRole,
        logout,
        isPlatformSuperadmin,
        isTenantAdminOrSuperadmin
    } = useAuth();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLLIElement>(null);

    console.log('Navbar Debug:', { 
        isAuthenticated, // Use the one from context
        userExists: !!user, 
        user: user,
        loading 
    });

    const handleLogout = async () => {
        try {
            await logout();
            setIsMenuOpen(false);
            setIsUserDropdownOpen(false);
        } catch (error) {
            console.error("Failed to logout:", error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setIsUserDropdownOpen(false);
    };

    const closeAllMenus = () => {
        setIsMenuOpen(false);
        setIsUserDropdownOpen(false);
    };

    const toggleUserDropdown = (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const userRole = user?.role?.replace(/_/g, ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()) || 'Guest';

    if (loading) {
        return (
            <header className="navbarContainer">
                <div className="navbarContent">
                    <Link to="/home" className="navbarLogoLink">
                        <img src={PrimaryLogo} className="navbarLogo" alt="Credit Edge Logo" />
                    </Link>
                    <div style={{ color: 'white' }}>Loading...</div>
                </div>
            </header>
        );
    }

    return (
        <header className="navbarContainer">
            <div className="navbarContent">
                <Link to="/home" className="navbarLogoLink" onClick={closeAllMenus}>
                    <img src={PrimaryLogo} className="navbarLogo" alt="Credit Edge Logo" />
                </Link>

                <button className="menuToggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <nav className={`navbarNav ${isMenuOpen ? 'open' : ''}`}>
                    <ul className="navbarNavList">
                        {/* Always visible public links */}
                       
                        <li className="navbarNavItem">
                            <Link to="/features-pricing" onClick={closeAllMenus}>Features & Pricing</Link>
                        </li>
                        <li className="navbarNavItem">
                            <Link to="/contact" onClick={closeAllMenus}>Contact Us</Link>
                        </li>
                        <li className="navbarNavItem">
                            <Link to="/responsibleBorrowingPage" onClick={closeAllMenus}>Responsible Borrowing</Link>
                        </li>

                        {/* Use isAuthenticated from context */}
                        {isAuthenticated ? (
                            // USER IS LOGGED IN - Show dropdown
                            <li className="navbarNavItem userDropdownContainer" ref={dropdownRef}>
                                <button className="userDropdownToggle" onClick={toggleUserDropdown}>
                                    <span className="user-info">
                                        Hello, {user?.firstName || 'User'}
                                        <span className="user-role">{userRole}</span>
                                    </span>
                                    {isUserDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <ul className={`userDropdownMenu ${isUserDropdownOpen ? 'open' : ''}`}>
                                    {/* Use the helper functions from context */}
                                    {isPlatformSuperadmin() ? (
                                        <li className="dropdownNavItem">
                                            <Link to="/platform/dashboard" onClick={closeAllMenus}>Platform Dashboard</Link>
                                        </li>
                                    ) : (
                                        <li className="dropdownNavItem">
                                            <Link to="/tenant/dashboard" onClick={closeAllMenus}>Dashboard</Link>
                                        </li>
                                    )}
                                    
                                    <li className="dropdownNavItem">
                                        <Link to="/settings" onClick={closeAllMenus}>Settings</Link>
                                    </li>
                                    
                                    {/* Add role-based links using the helper functions */}
                                    {isTenantAdminOrSuperadmin() && (
                                        <>
                                            <li className="dropdownNavItem">
                                                <Link to="/tenant/user-management" onClick={closeAllMenus}>User Management</Link>
                                            </li>
                                            <li className="dropdownNavItem">
                                                <Link to="/tenant/client-management" onClick={closeAllMenus}>Clients</Link>
                                            </li>
                                            <li className="dropdownNavItem">
                                                <Link to="/tenant/loans" onClick={closeAllMenus}>Loans</Link>
                                            </li>
                                        </>
                                    )}
                                    
                                    <li className="dropdownNavItem">
                                        <button onClick={handleLogout} className="logoutButton">Logout</button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            // USER IS NOT LOGGED IN - Show Login/Signup
                            <>
                                <li className="navbarNavItem">
                                    <Link to="/login" onClick={closeAllMenus}>Login</Link>
                                </li>
                                <li className="navbarNavItem">
                                    <Link to="/signup" onClick={closeAllMenus}>Sign Up</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;