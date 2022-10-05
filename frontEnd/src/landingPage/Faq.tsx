import React, { Component } from 'react';
import './Faq.css';

export interface IFaqItem {
    question: string;
    answer: string;
    detailedAnswer: string;
}

export interface IFaqProps {
    faqItems: IFaqItem[];
}

export class Faq extends Component<IFaqProps> {
    public render() {
        const { faqItems } = this.props;
        return (
            <section className="section" id="frequently-question">
                <div className="container">
                    {/* ***** Section Title Start ***** */}
                    <div className="row" style={{ paddingBottom: '100dp' }}>
                        <div className="col-lg-12">
                            <div className="section-heading">
                                <h2>Frequently Asked Questions</h2>
                            </div>
                        </div>
                        <div className="offset-lg-3 col-lg-6">
                            <div className="section-heading">
                                <p>Here you can find the most FAQ.</p>
                            </div>
                        </div>
                    </div>
                    {/* ***** Section Title End ***** */}
                    <div className="row">
                        <div className="left-text col-lg-6 col-md-6 col-sm-12">
                            <h5>Our dream:</h5>
                            <div className="accordion-text">
                                <p>
                                    A network of users who offer not only products (used or not, and of their own
                                    production) but also their skills/experiences for the whole community in order to
                                    increase the interactions and skills of each member.
                                </p>
                                <p>here is the link to send email</p>
                                <span>
                                    Email: <a href="#">zena@reynhomlitdep.com</a>
                                    <br />
                                </span>
                                <a href="#contact-us" className="main-button">
                                    Contact Us
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="accordions is-first-expanded">
                                {faqItems.map((faqItem) => {
                                    return Faq.createFaqItem(faqItem);
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    private static createFaqItem(faqItem: IFaqItem) {
        return (
            <article className="accordion">
                <b>
                    <span>{faqItem.question}</span>
                </b>

                <div>
                    <div className="content">
                        <p>
                            {faqItem.answer} {faqItem.detailedAnswer}
                        </p>
                    </div>
                </div>
            </article>
        );
    }
}

export const FaqMockData = [
    {
        question: 'How can I buy?',
        answer: 'You need to register and then you will enter the product gallery.',
        detailedAnswer: 'Inside you will find numerous products belonging to different categories.',
    },
    {
        question: 'How can I sell?',
        answer: "Register, verify your identity and that's it!",
        detailedAnswer: 'You can sell all the products that belong to you.',
    },
    {
        question: "I don't have a shop, can I sell?",
        answer: 'Of course, the important thing is to be registered and verify your identity.',
        detailedAnswer: "You don't need to own a shop. Anyone who belongs to the community can sell.",
    },
    {
        question: 'Can i use my card?',
        answer: 'Once registered, you can register your card and exchange real money for time coins.',
        detailedAnswer: 'With our exchange service it is easy, fast and safe to make the change.',
    },
    {
        question: 'I would like to register my shop, is it possible?',
        answer: 'Of course, your business will be part of the community just like a user who sells products.',
        detailedAnswer: 'It is an integral part of the community and is a precious resource for its development.',
    },
] as IFaqItem[];
