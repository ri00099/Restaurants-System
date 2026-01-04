import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
    return (
        <div className="privacy-wrapper">

                {/* HERO HEADER */} 
            <header className="privacy-hero">
                {/* Blurred background */}
                <div className="privacy-hero-bg"></div>

                {/* Dark overlay */}
                <div className="privacy-hero-overlay"></div>

                {/* Content */}
                <div className="privacy-hero-content">
                    <h1>Privacy Policy</h1>
                    <p>How Graphura protects and handles your data</p>
                    <span className="privacy-updated">Updated on 4 November 2025</span>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <section className="privacy-content">

                <div className="privacy-block">
                    <h2>Introduction</h2>
                    <p>
                        Graphura India Private Limited (“us”, “we”, or “our”) operates the
                        https://www.graphura.in website (the “Service”). This page explains
                        how we collect, use, and protect your personal data.
                    </p>
                </div>

                <div className="privacy-block">
                    <h2>Information Collection and Use</h2>
                    <p>
                        We prioritize transparency, privacy, and data security. Your
                        information is used only to enhance your experience and is never
                        sold or misused.
                    </p>
                </div>

                <div className="privacy-block">
                    <h2>Why We Process Information</h2>
                    <p>
                        We process data to provide services, improve performance, respond to
                        inquiries, strengthen security, and ensure seamless platform usage.
                    </p>
                </div>

                <div className="privacy-block">
                    <h2>Your Rights</h2>
                    <p>
                        You can request access, correction, or deletion of your information
                        anytime by contacting our support team.
                    </p>
                </div>

                <div className="privacy-block">
                    <h2>Where We Send Data</h2>
                    <p>
                        Your data may be shared with secure third-party providers that help
                        us operate our services. These providers follow strict compliance
                        and privacy standards.
                    </p>
                </div>

                <div className="privacy-block">
                    <h2>Data Retention</h2>
                    <p>
                        We retain your data only for as long as necessary to provide
                        services and comply with legal or operational obligations.
                    </p>
                </div>

            </section>
        </div>
    );
};

export default PrivacyPolicy;