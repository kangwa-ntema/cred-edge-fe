// fe/src/FeaturesPricingPage/FeaturesPricingPage.tsx

import React, { useState, useEffect } from "react";
import { getPackages } from "../../services/api/platform/packageApi";
import { FaCheckCircle, FaUsers, FaLaptop, FaDatabase } from 'react-icons/fa';
import './FeaturesPricingPage.scss';

const FeaturesPricingPage = () => {
    const [packagingList, setPackagingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPackaging = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getPackages();
            console.log("Packages API Response:", response); // Debug log
            
            if (response.success && response.data) {
                setPackagingList(response.data); // Use response.data, not response
            } else {
                const errorMsg = response.error || "Failed to load packaging data.";
                setError(errorMsg);
                setPackagingList([]);
            }
        } catch (err) {
            console.error("Error fetching packages:", err);
            setError("Failed to load packaging data. Please try again later.");
            setPackagingList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackaging();
    }, []);

    const renderPrice = (monthlyPrice, annualPrice) => {
        if (monthlyPrice === 0 && annualPrice === 0) {
            return (
                <div className="price-container">
                    <span className="price">Free</span>
                </div>
            );
        }
        return (
            <div className="price-container">
                <span className="price">ZMW{monthlyPrice}</span>
                <span className="price-period">/mo</span>
                {annualPrice > 0 && <span className="price-period">or ZMW{annualPrice} /yr</span>}
            </div>
        );
    };

    // Add safety check for features array
    const safeFeatures = (pkg) => {
        return Array.isArray(pkg.features) ? pkg.features : [];
    };

    return (
        <div className="pricing-page">
            <div className="pricing-header-container">
                <h1 className="pricing-header">Simple, Transparent Pricing</h1>
                <p className="pricing-subtitle">
                    Choose a plan that fits your business needs. All packages are designed to grow with you.
                </p>
            </div>
            
            {error && (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchPackaging} className="retry-btn">
                        Try Again
                    </button>
                </div>
            )}
            
            {loading ? (
                <div className="loading-message">Loading pricing packages...</div>
            ) : !Array.isArray(packagingList) ? (
                <div className="error-message">
                    <p>Invalid data format received from server.</p>
                </div>
            ) : packagingList.length === 0 ? (
                <div className="info-message">No packages found.</div>
            ) : (
                <div className="pricing-cards-container">
                    {packagingList.map((pkg) => (
                        <div key={pkg._id} className="pricing-card">
                            {pkg.bestFor && <span className="best-for-badge">{pkg.bestFor}</span>}
                            <h2 className="package-name">{pkg.name}</h2>
                            <p className="package-description">{pkg.description}</p>
                            {renderPrice(pkg.monthlyPrice, pkg.annualPrice)}
                            <ul className="features-list">
                                {safeFeatures(pkg).map((feature, index) => (
                                    <li key={index} className="feature-item">
                                        <FaCheckCircle className="feature-icon" />
                                        <span className="feature-name">{feature.name}</span>
                                    </li>
                                ))}
                                <li className="feature-item">
                                    <FaUsers className="feature-icon" />
                                    <span className="feature-name">
                                        {pkg.limits?.maxClients === -1 ? 'Unlimited' : `${pkg.limits?.maxClients || 0}`} Clients
                                    </span>
                                </li>
                                <li className="feature-item">
                                    <FaLaptop className="feature-icon" />
                                    <span className="feature-name">
                                        {pkg.limits?.maxLoans === -1 ? 'Unlimited' : `${pkg.limits?.maxLoans || 0}`} Loans
                                    </span>
                                </li>
                                <li className="feature-item">
                                    <FaDatabase className="feature-icon" />
                                    <span className="feature-name">{pkg.limits?.storageGB || 0} GB Storage</span>
                                </li>
                            </ul>
                            <button className="get-started-btn">Get Started</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeaturesPricingPage;