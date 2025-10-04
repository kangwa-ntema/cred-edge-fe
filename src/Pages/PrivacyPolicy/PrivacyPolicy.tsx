// fe/src/Pages/PrivacyPolicy/PrivacyPolicy.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './PrivacyPolicy.scss';

const PrivacyPolicy = () => {
  return (
    <div className="legal-page-container">
      <div className="back-link-wrapper">
        <Link to="/home" className="back-to-home-link">
          <ArrowLeft size={20} className="back-icon" />
          Back to Home
        </Link>
      </div>

      <div className="legal-content-card">
        <h1 className="legal-main-headline">Privacy Policy</h1>
        <p className="legal-last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="legal-section">
          <h2 className="legal-section-headline">1. Introduction</h2>
          <p className="legal-paragraph">
            Credit Edge ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our loan management platform and related services.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">2. Information We Collect</h2>
          
          <h3 className="legal-subsection-headline">2.1 Personal Information</h3>
          <p className="legal-paragraph">
            We may collect personal information that you provide directly to us, including:
          </p>
          <ul className="legal-list">
            <li>Name, email address, phone number, and contact information</li>
            <li>Business information and financial data</li>
            <li>Government-issued identification numbers</li>
            <li>Bank account information and transaction history</li>
            <li>Credit information and loan application details</li>
          </ul>

          <h3 className="legal-subsection-headline">2.2 Automated Information Collection</h3>
          <p className="legal-paragraph">
            We automatically collect certain information when you use our services:
          </p>
          <ul className="legal-list">
            <li>Log data and usage information</li>
            <li>Device information and IP address</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">3. How We Use Your Information</h2>
          <p className="legal-paragraph">
            We use the collected information for various purposes:
          </p>
          <ul className="legal-list">
            <li>To provide and maintain our loan management services</li>
            <li>To process loan applications and manage client accounts</li>
            <li>To communicate with you about our services</li>
            <li>To improve our platform and develop new features</li>
            <li>To comply with legal obligations and prevent fraud</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">4. Data Sharing and Disclosure</h2>
          <p className="legal-paragraph">
            We may share your information in the following circumstances:
          </p>
          <ul className="legal-list">
            <li>With financial institutions and credit bureaus as required for loan processing</li>
            <li>With service providers who assist in our operations</li>
            <li>To comply with legal requirements or protect our rights</li>
            <li>In connection with business transfers or mergers</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">5. Data Security</h2>
          <p className="legal-paragraph">
            We implement appropriate security measures to protect your personal information, including encryption, access controls, and regular security assessments. However, no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">6. Your Rights</h2>
          <p className="legal-paragraph">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="legal-list">
            <li>Access and receive a copy of your personal information</li>
            <li>Correct inaccurate or incomplete data</li>
            <li>Request deletion of your personal information</li>
            <li>Object to or restrict certain processing activities</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">7. Contact Us</h2>
          <p className="legal-paragraph">
            If you have any questions about this Privacy Policy or our data practices, please contact us at:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> privacy@creditedge.com</p>
            <p><strong>Phone:</strong> +260 779 401 971</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;