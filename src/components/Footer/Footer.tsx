// fe/src/components/Footer/Footer.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from 'lucide-react';
import './Footer.scss';

import PrimaryLogo from "../../assets/logo-images/cred-edge-icon-logo-2.svg";

const Footer: React.FC = () => {
    return (
        <footer className="footerContainer">
            <div className="footerContent">
                {/* Top Section: Logo and Company Info */}
                <div className="footerSection footerAbout">
                    <Link to="/" className="footerLogoLink">
                        <img src={PrimaryLogo} className="footerLogo" alt="Credit Edge Logo" />
                    </Link>
                    <p className="footerDescription">
                        Credit Edge empowers financial businesses with intelligent, integrated tools
                        to efficiently manage loans, foster client relationships, and ensure robust financial health.
                    </p>
                    <div className="socialLinks">
                        <a href="https://linkedin.com/company/creditedge" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <Linkedin size={20} />
                        </a>
                        <a href="https://twitter.com/creditedge" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <Twitter size={20} />
                        </a>
                        <a href="https://facebook.com/creditedge" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Facebook size={20} />
                        </a>
                    </div>
                </div>

                {/* Middle Section: Navigation Links */}
                <div className="footerSection footerNav">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/features-pricing">Features & Pricing</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                        <li><Link to="/responsibleBorrowingPage">Responsible Borrowing</Link></li>
                        <li><Link to="/login">Login</Link></li>
                    </ul>
                </div>

                {/* Middle Section: Contact Information */}
                <div className="footerSection footerContact">
                    <h3>Contact Info</h3>
                    <ul>
                        <li><Phone size={16} /> +260 779 401 971</li>
                    </ul>
                </div>
            </div>

            {/* Bottom Section: Copyright and Powered By */}
            <div className="footerBottom">
                <p className="appFooterCopyright">Credit Edge &copy; 2025</p>
                <p className="sponsor">
                    POWERED BY
                    <a href="https://www.druzycanvas.com" className="developerLink" target="_blank" rel="noopener noreferrer">
                        {" "}DRUZY CANVAS
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;