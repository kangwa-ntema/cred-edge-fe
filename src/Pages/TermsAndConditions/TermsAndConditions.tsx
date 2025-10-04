// fe/src/Pages/TermsAndConditions/TermsAndConditions.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './TermsAndConditions.scss';

const TermsAndConditions = () => {
  return (
    <div className="legal-page-container">
      <div className="back-link-wrapper">
        <Link to="/home" className="back-to-home-link">
          <ArrowLeft size={20} className="back-icon" />
          Back to Home
        </Link>
      </div>

      <div className="legal-content-card">
        <h1 className="legal-main-headline">Terms and Conditions</h1>
        <p className="legal-last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

        <section className="legal-section">
          <h2 className="legal-section-headline">1. Acceptance of Terms</h2>
          <p className="legal-paragraph">
            By accessing and using the Credit Edge loan management platform ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">2. Services Description</h2>
          <p className="legal-paragraph">
            Credit Edge provides a comprehensive loan management platform that enables financial institutions and lenders to manage their lending operations, including client management, loan processing, repayment tracking, and financial reporting.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">3. User Accounts</h2>
          
          <h3 className="legal-subsection-headline">3.1 Account Registration</h3>
          <p className="legal-paragraph">
            To access certain features of the Platform, you must register for an account. You agree to provide accurate and complete information during registration and to keep this information updated.
          </p>

          <h3 className="legal-subsection-headline">3.2 Account Security</h3>
          <p className="legal-paragraph">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">4. Acceptable Use</h2>
          <p className="legal-paragraph">
            You agree not to use the Platform for any unlawful purpose or in any way that could damage, disable, overburden, or impair the Platform. Prohibited activities include:
          </p>
          <ul className="legal-list">
            <li>Attempting to gain unauthorized access to any part of the Platform</li>
            <li>Using the Platform to transmit any viruses or malicious code</li>
            <li>Engaging in any fraudulent or illegal lending activities</li>
            <li>Violating any applicable laws or regulations</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">5. Intellectual Property</h2>
          <p className="legal-paragraph">
            The Platform and its original content, features, and functionality are owned by Credit Edge and are protected by international copyright, trademark, and other intellectual property laws.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">6. Data Privacy</h2>
          <p className="legal-paragraph">
            Your use of the Platform is subject to our Privacy Policy, which explains how we collect, use, and protect your personal information. By using the Platform, you consent to our data practices as described in the Privacy Policy.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">7. Limitation of Liability</h2>
          <p className="legal-paragraph">
            Credit Edge shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Platform. Our total liability shall not exceed the amount paid by you for the services in the past six months.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">8. Termination</h2>
          <p className="legal-paragraph">
            We may terminate or suspend your account and access to the Platform immediately, without prior notice, for conduct that we believe violates these Terms and Conditions or is harmful to other users, us, or third parties.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">9. Governing Law</h2>
          <p className="legal-paragraph">
            These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of Zambia, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">10. Changes to Terms</h2>
          <p className="legal-paragraph">
            We reserve the right to modify these Terms and Conditions at any time. We will notify users of any material changes by posting the new Terms and Conditions on the Platform. Your continued use of the Platform after such changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-headline">11. Contact Information</h2>
          <p className="legal-paragraph">
            For questions about these Terms and Conditions, please contact us:
          </p>
          <div className="contact-info">
            <p><strong>Email:</strong> legal@creditedge.com</p>
            <p><strong>Phone:</strong> +260 779 401 971</p>
            <p><strong>Address:</strong> Lusaka, Zambia</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;