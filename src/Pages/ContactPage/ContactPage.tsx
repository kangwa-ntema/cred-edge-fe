// src/Pages/ContactPage/ContactPage.tsx

import React from 'react';
import './ContactPage.scss'; // You will create this CSS file

const ContactPage = () => {
    return (
        <section className="contactPageContainer">
            <div className="contactPageContent">
                <h1 className="contactPageHeadline">Get in Touch with Credit Edge</h1>
                <p className="contactPageSubheadline">
                    We'd love to hear from you! Whether you have questions about our platform, want to schedule a demo,
                    or need support, our team is ready to assist.
                </p>

                <div className="contactInfoGrid">
                    {/* <div className="contactInfoCard">
                        <i className="fas fa-envelope contactIcon"></i>
                        <h3>Email Us</h3>
                        <p>For general inquiries or support.</p>
                        <a href="mailto:info@creditedge.com" className="contactLink">info@creditedge.com</a>
                    </div> */}
                    <div className="contactInfoCard">
                        <i className="fas fa-phone-alt contactIcon"></i>
                        <h3>Call Us</h3>
                        <p>Speak directly with our sales or support team.</p>
                        <a href="tel:+260779401971" className="contactLink">+260 779 401 971</a>
                    </div>
                    {/* <div className="contactInfoCard">
                        <i className="fas fa-calendar-alt contactIcon"></i>
                        <h3>Request a Demo</h3>
                        <p>See Credit Edge in action with a personalized walkthrough.</p>
                        <a href="mailto:sales@creditedge.com?subject=Demo%20Request%20for%20Credit%20Edge" className="contactLink">Schedule a Demo</a>
                    </div> */}
                </div>

                {/* <div className="contactFormSection">
                    <h2>Send Us a Message</h2>
                    <form className="contactForm">
                        <div className="formGroup">
                            <label htmlFor="name">Your Name</label>
                            <input type="text" id="name" name="name" required />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="email">Your Email</label>
                            <input type="email" id="email" name="email" required />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="company">Company Name (Optional)</label>
                            <input type="text" id="company" name="company" />
                        </div>
                        <div className="formGroup">
                            <label htmlFor="message">Your Message</label>
                            <textarea id="message" name="message" rows="5" required></textarea>
                        </div>
                        <button type="submit" className="submitBtn">Send Message</button>
                    </form>
                </div> */}
            </div>
        </section>
    );
};

export default ContactPage;
