import * as React from 'react';
import { Component } from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap';
import Table from 'react-bootstrap/Table';
import './ListStyling.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import coinIcon from '../assets/images/coin.png';
import {
    faClock,
    faPrint,
    faCoins,
    faShare,
    faStore,
    faHistory,
    faLevelUpAlt,
} from '@fortawesome/free-solid-svg-icons';
import Fetcher from '../common/Fetcher';
import { ResponsePresenter } from '../utils/responsePresenter';
import { motion } from 'framer-motion';
import { pageAnimation, fade, titleAnim, slider, sliderContainer } from '../animation';

export interface ISalesHistoryProps {}

export interface ISalesHistoryState {
    loadingData: boolean;
    historyDataSales: ISalesHistoryProps[];
}

export class SalesHistory extends Component<ISalesHistoryProps, ISalesHistoryState> {
    constructor(props: ISalesHistoryProps) {
        super(props);
        this.state = {
            loadingData: true,
            historyDataSales: [],
        };
    }

    private async retrieveSalesHistory(): Promise<ISalesHistoryProps[]> {
        try {
            const result = (await Fetcher.get('/history/sales_history')) as any[];
            return result.map((item) => {
                console.log(item);
                return {
                    id: item.id,
                    uuid: item.uuid,
                    buyer_id: item.buyer_id,
                    seller_id: item.seller_id,
                    card_id: item.card_id,
                    amount: item.amount,
                    title: item.title,
                    name: item.name,
                    timestamp: item.timestamp,
                } as ISalesHistoryProps;
            });
        } catch (e) {
            console.error(e);
            if (e === 'Problem during the fetch of the profile! Please, try again later')
                ResponsePresenter.error('Error in retrieving history');
            return [];
        }
    }

    public async componentDidMount(): Promise<void> {
        this.setState({
            loadingData: false,
            historyDataSales: await this.retrieveSalesHistory(),
        });
    }

    public render(): JSX.Element {
        const date = new Date();
        const n = date.toDateString();
        const time = date.toLocaleTimeString();

        return (
            <motion.div exit="exit" id="listStyling" initial="hidden" animate="show">
                <motion.div variants={sliderContainer}>
                    <motion.div id="frame1" variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#222222' }} variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#1c929c' }} variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#222222' }} variants={slider}></motion.div>
                </motion.div>
                <motion.div className="form-fields">
                    <motion.div className="wrapper fadeInDown">
                        <motion.div variants={pageAnimation} style={{ marginBottom: '60vh' }} id="formContent">
                            <div>
                                <motion.div variants={fade} className="right-panel">
                                    <span className="date-span">
                                        {' '}
                                        <FontAwesomeIcon icon={faClock} />
                                        {' ' + n + ' ' + time}
                                    </span>
                                    <button className="button-print" onClick={() => window.print()}>
                                        {' '}
                                        <FontAwesomeIcon icon={faPrint} /> Print{' '}
                                    </button>
                                </motion.div>

                                <motion.h3 variants={fade} className="heading-title">
                                    {' '}
                                    <FontAwesomeIcon color="#fff" icon={faStore} /> Sales History
                                </motion.h3>
                                <div>
                                    <motion.h6 variants={fade} className="total-result">
                                        Total sales records:{' '}
                                        <span className="total-result-span">{this.state.historyDataSales.length}</span>
                                    </motion.h6>
                                    <br />

                                    {this.state.loadingData ? (
                                        <h3>Loading...</h3>
                                    ) : (
                                        <div id="printable">
                                            <table cellPadding="0" cellSpacing="0">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: '8%' }}>No</th>
                                                        <th>Product</th>
                                                        <th>Buyer</th>
                                                        <th>Date</th>
                                                        <th>Cost</th>
                                                    </tr>
                                                </thead>
                                                {this.state.historyDataSales.map((item: any, i: any) => {
                                                    return (
                                                        <>
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ width: '8%' }}>{i + 1}</td>
                                                                    <td>{item.title}</td>
                                                                    <td>{item.name}</td>
                                                                    <td>{item.timestamp.split('T')[0]}</td>
                                                                    {item.amount != null ? (
                                                                        <td className="total-result-span">
                                                                            {item.amount}
                                                                            <FontAwesomeIcon icon={faCoins} />
                                                                            <FontAwesomeIcon icon={faLevelUpAlt} />
                                                                        </td>
                                                                    ) : (
                                                                        <td className="total-result-span">Free</td>
                                                                    )}
                                                                </tr>
                                                            </tbody>
                                                        </>
                                                    );
                                                })}
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }
}
