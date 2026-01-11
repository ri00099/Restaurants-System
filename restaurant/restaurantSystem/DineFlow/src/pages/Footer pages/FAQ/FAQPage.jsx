import React, { useState } from "react";
import "./faq.css";

// 1. Move the state logic out of FAQItem. 
// It now receives 'open' and 'onClick' as props from the parent.
const FAQItem = ({ question, answer, open, onClick }) => {
    return (
        <div className={`faq-item ${open ? "open" : ""}`}>
            <button className="faq-question" onClick={onClick}>
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
    // 2. Control which item is open using an index state
    // Initializing with null so all are closed by default
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
        // If the clicked item is already open, close it. Otherwise, open the new one.
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="faq-wrapper">
            {/* HERO SECTION - Unchanged */}
            <div className="faq-hero">
                <div className="faq-hero-bg"></div>
                <div className="faq-hero-overlay"></div>
                <div className="faq-hero-content">
                    <h1>Frequently Asked Questions</h1>
                    <p>Everything you need to know about the Graphura Restaurant Automation System</p>
                    <span className="faq-update">Updated on 4 November 2025</span>
                </div>
            </div>

            {/* FAQ LIST - Now passes state control down */}
            <div className="faq-list">
                <FAQItem
                    question="What is the Restaurant Automation System?"
                    answer="Graphura's automation suite helps restaurants manage orders, billing, inventory, kitchen operations, table tracking, and customer service — all in one place."
                    open={activeIndex === 0}
                    onClick={() => handleToggle(0)}
                />

                <FAQItem
                    question="How does online ordering work?"
                    answer="Customers can order through a website, QR menu, or mobile app. Orders instantly reach the kitchen display system (KDS) for faster preparation."
                    open={activeIndex === 1}
                    onClick={() => handleToggle(1)}
                />

                <FAQItem
                    question="Does it support multiple branches?"
                    answer="Absolutely! You can manage menus, staff, reports, and analytics across multiple branches from a single dashboard."
                    open={activeIndex === 2}
                    onClick={() => handleToggle(2)}
                />

                <FAQItem
                    question="How does inventory automation help?"
                    answer="The system tracks real-time stock levels, auto-deductions, low-stock alerts, wastage reports, and purchase projections."
                    open={activeIndex === 3}
                    onClick={() => handleToggle(3)}
                />

                <FAQItem
                    question="Can staff track table orders easily?"
                    answer="Yes. Live order status, ongoing bills, and waiter assignments are displayed clearly on a centralized screen."
                    open={activeIndex === 4}
                    onClick={() => handleToggle(4)}
                />

                <FAQItem
                    question="Is GST billing supported?"
                    answer="Yes. Graphura includes GST billing, discounts, split billing, and digital receipts."
                    open={activeIndex === 5}
                    onClick={() => handleToggle(5)}
                />

                <FAQItem
                    question="How secure is my restaurant data?"
                    answer="All your data is encrypted, stored securely on cloud servers, and backed up daily."
                    open={activeIndex === 6}
                    onClick={() => handleToggle(6)}
                />

                <FAQItem
                    question="Can I integrate Swiggy, Zomato, etc.?"
                    answer="Yes, Graphura supports Swiggy, Zomato, Dunzo, and other delivery platform integrations."
                    open={activeIndex === 7}
                    onClick={() => handleToggle(7)}
                />

                <FAQItem
                    question="Do you provide customer support?"
                    answer="Our experts are available 24/7 via chat, call, and email for any assistance."
                    open={activeIndex === 8}
                    onClick={() => handleToggle(8)}
                />
            </div>
        </div>
    );
};

export default FAQPage;