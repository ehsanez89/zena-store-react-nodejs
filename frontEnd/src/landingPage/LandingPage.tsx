import React, { Component } from 'react';
import '../assets/css/style.css';
import '../assets/css/owl-carousel.css';
import '../assets/css/bootstrap.min.css';
import '../assets/css/flex-slider.css';
import { ContactUs } from './ContactUs';
import './LandingPage.css';
import { Faq, FaqMockData } from './Faq';
import { FeatureItem, FeatureItemMockDataSell, FeatureItemMockDataBuy } from './FeatureItem';
import { motion } from 'framer-motion';
import { pageAnimation, fade, titleAnim, slider, sliderContainer } from '../animation';

export class LandingPage extends Component {
    public render() {
        return (
            <motion.div>
                {/* ***** Welcome Area Start ***** */}
                <motion.div className="welcome-area" id="welcome">
                    {/* ***** Header Text Start ***** */}
                    <motion.div variants={fade} className="header-text">
                        <motion.div className="container">
                            <div className="row">
                                <div
                                    className="left-text col-lg-6 col-md-6 col-sm-12 col-xs-12"
                                    data-scroll-reveal="enter left move 30px over 0.6s after 0.4s"
                                >
                                    <h1>
                                        Sign up and start <strong>your journey</strong>
                                    </h1>
                                    <p>You can buy, you can sell, and more....... </p>
                                    <a href="#about" className="main-button-slider">
                                        Read More
                                    </a>
                                </div>
                                {/* <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12" data-scroll-reveal="enter right move 30px over 0.6s after 0.4s">
                            <img src="assets/images/slider-icon.png" class="rounded img-fluid d-block mx-auto" alt="First Vector Graphic">
                        </div> */}
                            </div>
                        </motion.div>
                    </motion.div>
                    {/* ***** Header Text End ***** */}
                </motion.div>
                {/* ***** Welcome Area End ***** */}
                {/* ***** Features Small Start ***** */}
                <section className="section" id="services">
                    <div className="container">
                        <div className="row">
                            <div className="owl-carousel owl-theme">
                                <div className="item service-item">
                                    <div className="icon">
                                        <i>
                                            <img src="assets/images/service-icon-01.png" alt="" />
                                        </i>
                                    </div>
                                    <h5 className="service-title">Latest Products</h5>
                                    <p>View the list of our latest products.</p>
                                    <a href="#" className="main-button">
                                        View Products
                                    </a>
                                </div>
                                <div className="item service-item">
                                    <div className="icon">
                                        <i>
                                            <img src="assets/images/service-icon-02.png" alt="" />
                                        </i>
                                    </div>
                                    <h5 className="service-title">Special Items</h5>
                                    <p>View the list of our special items. </p>
                                    <a href="#" className="main-button">
                                        Discover More
                                    </a>
                                </div>
                                <div className="item service-item">
                                    <div className="icon">
                                        <i>
                                            <img src="assets/images/service-icon-03.png" alt="" />
                                        </i>
                                    </div>
                                    <h5 className="service-title">Our Services</h5>
                                    <p>Find out more about our services</p>
                                    <a href="#" className="main-button">
                                        More Detail
                                    </a>
                                </div>
                                <div className="item service-item">
                                    <div className="icon">
                                        <i>
                                            <img src="assets/images/service-icon-02.png" alt="" />
                                        </i>
                                    </div>
                                    <h5 className="service-title">Fourth Service Box</h5>
                                    <p>We can put something else here</p>
                                    <a href="#" className="main-button">
                                        Read More
                                    </a>
                                </div>
                                <div className="item service-item">
                                    <div className="icon">
                                        <i>
                                            <img src="assets/images/service-icon-01.png" alt="" />
                                        </i>
                                    </div>
                                    <h5 className="service-title">Fifth Service Title</h5>
                                    <p>another thing that we can add here.......</p>
                                    <a href="#" className="main-button">
                                        Discover
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {/* ***** Features Small End ***** */}
                {/* ***** Features Big Item Start ***** */}
                <section className="section" id="about">
                    <div className="container">
                        <h3>Why us?</h3>
                        <p>
                            Because in our app you will find a community of users who offer both products and services
                            for those who are part of it.
                        </p>
                    </div>
                </section>
                {/* ***** Features Big Item End ***** */}
                <FeatureItem
                    imagePosition={'left'}
                    image={FeatureItemMockDataSell.image}
                    title={FeatureItemMockDataSell.title}
                    text={FeatureItemMockDataSell.text}
                />{' '}
                {/* todo remove mockdata */}
                <FeatureItem
                    imagePosition={'right'}
                    image={FeatureItemMockDataBuy.image}
                    title={FeatureItemMockDataBuy.title}
                    text={FeatureItemMockDataBuy.text}
                />{' '}
                {/* todo remove mockdata */}
                <Faq faqItems={FaqMockData} /> {/* todo remove mockdata */}
                <ContactUs />
            </motion.div>
        );
    }
}
