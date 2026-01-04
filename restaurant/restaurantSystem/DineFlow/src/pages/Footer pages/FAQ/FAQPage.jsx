import React, { useState } from "react";
import "./faq.css";

const FAQItem = ({ question, answer }) => {
    const [open, setOpen] = useState(false);

    return (
        <div className={`faq-item ${open ? "open" : ""}`}>
            <button className="faq-question" onClick={() => setOpen(!open)}>
                <span>{question}</span>
                <span className="faq-icon">{open ? "−" : "+"}</span>
            </button>

            <div className="faq-answer">
                <p>{answer}</p>
            </div>
        </div>
    );
};

const FAQPage = () => {
    return (
        <div className="faq-wrapper">

            {/* HERO */}
            {/* HERO */}
            <div className="faq-hero">
                {/* Blurred background */}
                <div className="faq-hero-bg"></div>

                {/* Overlay */}
                <div className="faq-hero-overlay"></div>

                {/* Content */}
                <div className="faq-hero-content">
                    <h1>Frequently Asked Questions</h1>
                    <p>
                        Everything you need to know about the Graphura Restaurant Automation System
                    </p>
                    <span className="faq-update">Updated on 4 November 2025</span>
                </div>
            </div>

            {/* FAQ LIST */}
            <div className="faq-list">
                <FAQItem
                    question="What is the Restaurant Automation System?"
                    answer="Graphura's automation suite helps restaurants manage orders, billing, inventory, kitchen operations, table tracking, and customer service — all in one place."
                />

                <FAQItem
                    question="How does online ordering work?"
                    answer="Customers can order through a website, QR menu, or mobile app. Orders instantly reach the kitchen display system (KDS) for faster preparation."
                />

                <FAQItem
                    question="Does it support multiple branches?"
                    answer="Absolutely! You can manage menus, staff, reports, and analytics across multiple branches from a single dashboard."
                />

                <FAQItem
                    question="How does inventory automation help?"
                    answer="The system tracks real-time stock levels, auto-deductions, low-stock alerts, wastage reports, and purchase projections."
                />

                <FAQItem
                    question="Can staff track table orders easily?"
                    answer="Yes. Live order status, ongoing bills, and waiter assignments are displayed clearly on a centralized screen."
                />

                <FAQItem
                    question="Is GST billing supported?"
                    answer="Yes. Graphura includes GST billing, discounts, split billing, and digital receipts."
                />

                <FAQItem
                    question="How secure is my restaurant data?"
                    answer="All your data is encrypted, stored securely on cloud servers, and backed up daily."
                />

                <FAQItem
                    question="Can I integrate Swiggy, Zomato, etc.?"
                    answer="Yes, Graphura supports Swiggy, Zomato, Dunzo, and other delivery platform integrations."
                />

                <FAQItem
                    question="Do you provide customer support?"
                    answer="Our experts are available 24/7 via chat, call, and email for any assistance."
                />
            </div>

        </div>
    );
};

export default FAQPage;
