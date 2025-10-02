// fe/src/pages/LandingPage/LandingPage.tsx

// src/Pages/LandingPage/LandingPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authContext"; // Import useAuth to check auth status
import "./LandingPage.scss"; // Ensure you have this SCSS file

const LandingPage = () => {
  const { isAuthenticated } = useAuth(); // Get authentication status

  return (
    <section className="landingPageContainer">
      <div className="landingPageHero">
        <div className="landingPageContent">
          <h1 className="landingPageHeadline">
            Intelligent Empowerment in Lending.
          </h1>
          <p className="landingPageSubheadline">
            Streamline your operations, gain deep insights, and drive growth
            with our all-in-one loan management platform.
          </p>

          <div className="landingPageCallToAction">
            {/* Conditional rendering for authenticated vs. unauthenticated users */}
            {isAuthenticated ? (
              // If already logged in, show a link to the dashboard
              <Link to="/mainDashboard">
                <button className="landingPageBtn primaryBtn">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              // If not logged in, show options to Login or Sign Up/Start Trial
              <>
                <p className="ctaText">Already managing with Cred Edge?</p>
                <Link to="/login">
                  <button className="landingPageBtn primaryBtn">
                    Login to Your Account
                  </button>
                </Link>
                <p className="ctaText mt-4">New to Cred Edge?</p>
                <Link to="/features-pricing">
                  <button className="landingPageBtn secondaryBtn">
                    Explore Features & Pricing
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Why Choose Cred Edge? */}
      <div className="landingPageSection whyChooseUs">
        <div className="sectionContent">
          <h2 className="sectionHeadline">
            Why Choose Cred Edge
          </h2>
          <div className="featureGrid">
            <div className="featureItem">
              <h3>
                <i className="fas fa-arrows-alt-h"></i> Unify & Simplify
              </h3>
              <p>
                Bring all your loan operations, client management, and
                accounting into one intuitive platform. Eliminate silos and
                manual overhead.
              </p>
            </div>
            <div className="featureItem">
              <h3>
                <i className="fas fa-chart-line"></i> Drive Financial Growth
              </h3>
              <p>
                Gain real-time insights with comprehensive reporting. Make
                smarter, data-driven decisions to improve portfolio performance
                and profitability.
              </p>
            </div>
            {/* <div className="featureItem">
              <h3>
                <i className="fas fa-cogs"></i> Flexible & Adaptive
              </h3>
              <p>
                Designed to handle diverse lending products – from
                collateralized and payslip-backed to auto loans – all within a
                single, powerful application.
              </p>
            </div> */}
            <div className="featureItem">
              <h3>
                <i className="fas fa-shield-alt"></i> Built for Trust
              </h3>
              <p>
                Benefit from robust activity logging and a secure multi-tenant
                architecture ensuring strict data isolation and accountability.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* NEW Section: Technology & Security */}
      <div className="landingPageSection technologySecuritySection">
        <div className="sectionContent">
          <h2 className="sectionHeadline">
            Cutting-Edge Technology & Unwavering Security
          </h2>
          <p className="sectionSubheadline">
            Cred Edge is built on a foundation of modern, secure, and scalable
            technologies, ensuring your data is always protected and your
            operations run smoothly.
          </p>
          <div className="techFeatureGrid">
            <div className="techFeatureItem">
              <i className="fas fa-server techIcon"></i>
              <h3>Robust Cloud Infrastructure</h3>
              <p>
                Powered by leading cloud providers for unparalleled reliability,
                speed, and global accessibility.
              </p>
            </div>
            <div className="techFeatureItem">
              <i className="fas fa-lock techIcon"></i>
              <h3>Bank-Grade Security</h3>
              <p>
                Data encryption in transit and at rest, regular security audits,
                and strict access controls protect your sensitive financial
                information.
              </p>
            </div>
            <div className="techFeatureItem">
              <i className="fas fa-shield-alt techIcon"></i>
              <h3>Multi-Tenant Data Isolation</h3>
              <p>
                Our architecture ensures complete separation of your company's
                data from others, guaranteeing privacy and integrity.
              </p>
            </div>
            <div className="techFeatureItem">
              <i className="fas fa-code techIcon"></i>
              <h3>Modern Development Stack</h3>
              <p>
                Built with React, Node.js, and MongoDB for a responsive,
                high-performance, and future-proof platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Call to Action for Different Loan Types (Conceptual) */}
     {/*  <div className="landingPageSection loanTypeSection">
        <div className="sectionContent">
          <h2 className="sectionHeadline">Tailored for Your Loan Products</h2>
          <p className="sectionSubheadline">
            Whether you specialize in specific financing or offer a diverse
            portfolio, Cred Edge adapts to your needs.
          </p>
          <div className="loanTypeGrid">
            <div className="loanTypeCard">
              <i className="fas fa-hands-helping loanTypeIcon"></i>
              <h3>Personal & Micro Loans</h3>
              <p>
                Efficiently manage standard personal lending with automated
                repayments and clear tracking.
              </p>
            </div>
            <div className="loanTypeCard">
              <i className="fas fa-car loanTypeIcon"></i>
              <h3>Vehicle-Backed Loans</h3>
              <p>
                Dedicated tools for managing auto loans, including vehicle
                details and related collateral.
              </p>
            </div>
            <div className="loanTypeCard">
              <i className="fas fa-money-check-alt loanTypeIcon"></i>
              <h3>Collateralized Lending</h3>
              <p>
                Robust features for tracking and managing assets used as loan
                collateral.
              </p>
            </div>
            <div className="loanTypeCard">
              <i className="fas fa-file-invoice-dollar loanTypeIcon"></i>
              <h3>Payslip-Backed Loans</h3>
              <p>
                Streamline the verification and management of loans secured by
                payslip deductions.
              </p>
            </div>
            <div className="text-center mt-8">
              <Link to="/features-pricing">
                <button className="landingPageBtn primaryBtn">
                  Discover All Features
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div> */}

      {/* Section 4: Final Call to Action */}
      <div className="landingPageSection finalCtaSection">
        <div className="sectionContent">
          <h2 className="sectionHeadline">Ready to Get Started?</h2>
          <p className="sectionSubheadline">
            Join the growing number of financial institutions transforming their
            operations with Cred Edge.
          </p>
          <Link to="/contact">
            {" "}
            {/* Changed from /signup to /contact for manual onboarding */}
            <button className="landingPageBtn primaryBtn largeBtn">
              Request a Demo Today
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
