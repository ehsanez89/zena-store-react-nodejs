import React, { Component } from 'react';

import './ContactUs.css';

export interface IContactUsProps {}

export class ContactUs extends Component<IContactUsProps> {
    private static readonly COMPANY_POSITION_GMAPS =
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27117.023467755556!2d8.92991043195321!3d44.40595617089738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12d34152dcd49aad%3A0x236a84f11881620a!2sGenoa%2C%20Metropolitan%20City%20of%20Genoa!5e0!3m2!1sen!2sit!4v1608047172307!5m2!1sen!2sit';

    /* How to change your own map point
   1. Go to Google Maps
   2. Click on your location point
   3. Click "Share" and choose "Embed map" tab
   4. Copy only URL and paste it in var above
  */

    public render() {
        return (
            <section className="section" id="contact-us">
                <div className="container-fluid">
                    <div className="row">
                        {/* ***** Contact Map Start ***** */}
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div id="map">
                                <iframe
                                    src={ContactUs.COMPANY_POSITION_GMAPS}
                                    style={{ border: 0 }}
                                    allowFullScreen
                                    width="100%"
                                    height="500px"
                                    frameBorder={0}
                                />
                            </div>
                        </div>
                        {/* ***** Contact Map End ***** */}
                        {/* ***** Contact Form Start ***** */}
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="contact-form">
                                <form id="contact" method="post">
                                    <div className="row">
                                        <div className="col-md-6 col-sm-12">
                                            <fieldset>
                                                <input
                                                    name="name"
                                                    type="text"
                                                    id="name"
                                                    placeholder="Full Name"
                                                    required
                                                    className="contact-field"
                                                />
                                            </fieldset>
                                        </div>
                                        <div className="col-md-6 col-sm-12">
                                            <fieldset>
                                                <input
                                                    name="email"
                                                    type="text"
                                                    id="email"
                                                    placeholder="E-mail"
                                                    required
                                                    className="contact-field"
                                                />
                                            </fieldset>
                                        </div>
                                        <div className="col-lg-12">
                                            <fieldset>
                                                <textarea
                                                    name="message"
                                                    rows={6}
                                                    id="message"
                                                    placeholder="Your Message"
                                                    required
                                                    className="contact-field"
                                                    defaultValue={''}
                                                />
                                            </fieldset>
                                        </div>
                                        <div className="col-lg-12">
                                            <fieldset>
                                                <button type="submit" id="form-submit" className="main-button">
                                                    Send It
                                                </button>
                                            </fieldset>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        {/* ***** Contact Form End ***** */}
                    </div>
                </div>
            </section>
        );
    }
}
