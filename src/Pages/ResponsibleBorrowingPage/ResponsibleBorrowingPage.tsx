// fe/src/Pages/ResponsibleBorrowingPage/ResponsibleBorrowingPage.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import './ResponsibleBorrowingPage.scss'; // Import the SCSS file

const ResponsibleBorrowingPage = () => {
  return (
    <div className="responsible-borrowing-container">
      {/* Back to Dashboard Link */}
      <div className="back-link-wrapper">
        <Link
          to="/mainDashboard" // Adjust this path if your main dashboard is different
          className="back-to-dashboard-link"
        >
          <svg className="back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Dashboard
        </Link>
      </div>

      <div className="content-card">
        <h1 className="main-headline">
          Responsible Borrowing: Understanding Loans for Growth
        </h1>

        <p className="intro-paragraph">
          Debt often carries a negative connotation, frequently associated with financial distress and loss of assets.
          However, when approached strategically and responsibly, borrowing can be a powerful tool for personal and
          business growth, enabling opportunities that might otherwise be out of reach.
        </p>

        <section className="benefits-section">
          <h2 className="section-headline">
            The Benefits of Responsible Borrowing
          </h2>
          <p className="section-intro">
            Borrowing, when managed effectively, offers several significant advantages:
          </p>

          <ol className="ordered-list">
            <li>
              <strong className="list-strong">Access to Capital for Investment:</strong>
              <ul className="unordered-list">
                <li>
                  <strong className="sub-list-strong">Business Expansion:</strong> Loans can provide the necessary capital to start a new business,
                  expand an existing one, purchase essential equipment, or invest in new technologies.
                </li>
                <li>
                  <strong className="sub-list-strong">Education:</strong> Student loans can open doors to higher education, leading to increased
                  earning potential and career opportunities.
                </li>
                <li>
                  <strong className="sub-list-strong">Real Estate:</strong> Mortgages make homeownership accessible, allowing individuals to build
                  equity and long-term wealth.
                </li>
              </ul>
            </li>
            <li>
              <strong className="list-strong">Building Credit History:</strong>
              <p className="list-paragraph">
                Responsible borrowing and timely repayments contribute to a strong credit score. A good credit score
                is crucial for securing future loans at favorable interest rates, obtaining rental agreements, and
                even for some employment opportunities.
              </p>
            </li>
            <li>
              <strong className="list-strong">Emergency Funds:</strong>
              <p className="list-paragraph">
                Lines of credit or personal loans can serve as a safety net for unexpected emergencies, preventing
                the need to deplete savings or sell assets during difficult times.
              </p>
            </li>
            <li>
              <strong className="list-strong">Leverage and Growth:</strong>
              <p className="list-paragraph">
                For businesses, borrowing allows for leveraging existing assets to generate greater returns than the
                cost of the loan, leading to accelerated growth.
              </p>
            </li>
            <li>
              <strong className="list-strong">Convenience and Flexibility:</strong>
              <p className="list-paragraph">
                Credit cards offer convenience for daily transactions and can provide short-term liquidity, often
                with rewards programs. When paid off promptly, they are a valuable financial tool.
              </p>
            </li>
          </ol>
        </section>

        <section className="best-practices-section">
          <h2 className="section-headline">
            Best Practices for Using Your Loans Wisely
          </h2>
          <p className="section-intro">
            To harness the power of borrowing without falling into common pitfalls, consider these best practices:
          </p>

          <ol className="ordered-list">
            <li>
              <strong className="list-strong">Borrow Only What You Need:</strong>
              <p className="list-paragraph">
                Resist the temptation to borrow the maximum amount offered. Calculate your exact needs and borrow
                only that amount to minimize interest payments and repayment burden.
              </p>
            </li>
            <li>
              <strong className="list-strong">Understand the Terms and Conditions:</strong>
              <p className="list-paragraph">
                Before signing any loan agreement, thoroughly understand the interest rate (APR), repayment schedule,
                fees (origination fees, late payment fees), and any penalties for early repayment or default.
              </p>
            </li>
            <li>
              <strong className="list-strong">Assess Your Repayment Capacity:</strong>
              <p className="list-paragraph">
                Be realistic about your ability to repay the loan. Create a detailed budget that includes all your
                income and expenses, ensuring you can comfortably meet the monthly loan payments without compromising
                other financial obligations. A good rule of thumb is that your total debt payments (excluding mortgage)
                should not exceed 36% of your gross monthly income.
              </p>
            </li>
            <li>
              <strong className="list-strong">Prioritize Productive Debt:</strong>
              <ul className="unordered-list">
                <li>
                  <strong className="sub-list-strong">Productive Debt</strong> is typically used to acquire assets that appreciate in value or
                  generate income (e.g., mortgages, business loans, student loans).
                </li>
                <li>
                  <strong className="sub-list-strong">Non-Productive Debt</strong> is used for depreciating assets or consumption (e.g., credit card
                  debt for impulse purchases). Prioritize productive debt and minimize non-productive debt.
                </li>
              </ul>
            </li>
            <li>
              <strong className="list-strong">Have a Clear Repayment Strategy:</strong>
              <p className="list-paragraph">
                Don't just borrow; have a plan for how you will repay the loan. This might involve setting up
                automatic payments, allocating a specific portion of your income, or using a debt repayment strategy
                like the "snowball" or "avalanche" method.
              </p>
            </li>
            <li>
              <strong className="list-strong">Maintain a Good Credit Score:</strong>
              <p className="list-paragraph">
                Pay all your bills on time, keep credit utilization low, and regularly check your credit report for
                errors. A good credit score ensures you qualify for better loan terms in the future.
              </p>
            </li>
            <li>
              <strong className="list-strong">Build an Emergency Fund:</strong>
              <p className="list-paragraph">
                Before taking on significant debt, ensure you have an adequate emergency fund (typically 3-6 months
                of living expenses). This prevents you from needing to borrow for unexpected costs.
              </p>
            </li>
            <li>
              <strong className="list-strong">Seek Professional Advice:</strong>
              <p className="list-paragraph">
                If you're unsure about the best borrowing options for your situation, consult with a financial advisor.
                They can help you assess your financial health and make informed decisions.
              </p>
            </li>
          </ol>
        </section>

        <p className="conclusion-paragraph">
          By adhering to these principles, you can transform borrowing from a potential burden into a strategic
          financial tool that supports your aspirations and contributes to your long-term financial well-being.
        </p>
      </div>
    </div>
  );
};

export default ResponsibleBorrowingPage;
