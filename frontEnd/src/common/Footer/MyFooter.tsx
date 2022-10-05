import React, { Component } from 'react';
import logo from '../../assets/images/logo.png';
import './MyFooter.css';
import '../../assets/css/bootstrap.min.css';

export interface MyFooterItem {
    name: string;
    link: URL;
}

export interface IMyFooterProps {
    items?: MyFooterItem[]; // if undefined ITEMS_DEFAULT will be used
}

export class MyFooter extends Component<IMyFooterProps> {
    public render() {
        return (
            <footer style={{ background: 'rgb(37, 39, 41)' }} className="container-fluid py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-md-6 ">
                                    <div className="logo-part" style={{ borderRight: '1px solid #383838' }}>
                                        <img src={logo} className="w-50 logo-footer" />
                                        <p>Genova, 16136</p>
                                        <p>Tell: 03986448898</p>
                                        <p>Address: Corso Europa</p>
                                    </div>
                                </div>
                                <div className="col-md-6 px-4" style={{ borderRight: '1px solid #383838' }}>
                                    <h6> About Raynholm It Dep</h6>
                                    <p>Here is just a placeholder to add a little text about the company.</p>
                                    <a href="#" className="btn-footer">
                                        {' '}
                                        More Info{' '}
                                    </a>
                                    <br />
                                    <a href="#" className="btn-footer">
                                        {' '}
                                        Contact Us
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="row">
                                <div className="col-md-2 px-4">
                                    <h6> Pages </h6>
                                    <div className="row ">
                                        <div className="col-md-6">
                                            <ul>
                                                <li>
                                                    {' '}
                                                    <a href="#responsive-navbar-nav"> Home</a>{' '}
                                                </li>
                                                <li>
                                                    {' '}
                                                    <a href="#about"> About</a>{' '}
                                                </li>
                                                <li>
                                                    {' '}
                                                    <a href="#about"> Service</a>{' '}
                                                </li>
                                                <li>
                                                    {' '}
                                                    <a href="#frequently-question"> FAQ</a>{' '}
                                                </li>
                                                <li>
                                                    {' '}
                                                    <a href="#contact"> Contact</a>{' '}
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
