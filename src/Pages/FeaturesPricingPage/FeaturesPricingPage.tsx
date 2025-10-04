// fe/src/FeaturesPricingPage/FeaturesPricingPage.tsx

import React, { useState, useEffect } from "react";
import { getPackages } from "../../services/api/platform/packageApi";
import { CheckCircle, Users, Laptop, Database, Star } from "lucide-react";
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
        <div className="featuresPricingPage">
            <div className="pricingHero">
                <div className="pricingHeaderContainer">
                    <h1 className="pricingHeader">Simple, Transparent Pricing</h1>
                    <p className="pricingSubtitle">
                        Choose a plan that fits your business needs. All packages are designed to grow with you.
                    </p>
                </div>
            </div>
            
            {error && (
                <div className="errorMessage">
                    <p>{error}</p>
                    <button onClick={fetchPackaging} className="retryBtn">
                        Try Again
                    </button>
                </div>
            )}
            
            {loading ? (
                <div className="loadingMessage">Loading pricing packages...</div>
            ) : !Array.isArray(packagingList) ? (
                <div className="errorMessage">
                    <p>Invalid data format received from server.</p>
                </div>
            ) : packagingList.length === 0 ? (
                <div className="infoMessage">No packages found.</div>
            ) : (
                <div className="pricingCardsContainer">
                    {packagingList.map((pkg) => (
                        <div key={pkg._id} className={`pricingCard ${pkg.bestFor ? 'featured' : ''}`}>
                            <h2 className="packageName">{pkg.name}</h2>
                            <p className="packageDescription">{pkg.description}</p>
                            {pkg.bestFor && (
                                <div className="bestForBadge">
                                    <Star size={24} />
                                    <span>{pkg.bestFor}</span>
                                </div>
                            )}
                            {renderPrice(pkg.monthlyPrice, pkg.annualPrice)}
                            <ul className="featuresList">
                                {safeFeatures(pkg).map((feature, index) => (
                                    <li key={index} className="featureItem">
                                        <CheckCircle size={20} className="featureIcon" />
                                        <span className="featureName">{feature.name}</span>
                                    </li>
                                ))}
                                <li className="featureItem">
                                    <Users size={20} className="featureIcon" />
                                    <span className="featureName">
                                        {pkg.limits?.maxClients === -1 ? 'Unlimited' : `${pkg.limits?.maxClients || 0}`} Clients
                                    </span>
                                </li>
                                <li className="featureItem">
                                    <Laptop size={20} className="featureIcon" />
                                    <span className="featureName">
                                        {pkg.limits?.maxLoans === -1 ? 'Unlimited' : `${pkg.limits?.maxLoans || 0}`} Loans
                                    </span>
                                </li>
                                <li className="featureItem">
                                    <Database size={20} className="featureIcon" />
                                    <span className="featureName">{pkg.limits?.storageGB || 0} GB Storage</span>
                                </li>
                            </ul>
                            <button className="getStartedBtn">Get Started</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FeaturesPricingPage;