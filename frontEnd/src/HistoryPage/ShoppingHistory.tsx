import * as React from 'react';
import { Component } from 'react';
import './ListStyling.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faPrint, faCoins, faShoppingCart, faLevelDownAlt } from '@fortawesome/free-solid-svg-icons';
import Fetcher from '../common/Fetcher';
import { ResponsePresenter } from '../utils/responsePresenter';
import { motion } from 'framer-motion';
import { pageAnimation, fade, titleAnim, slider, sliderContainer } from '../animation';

export interface IHistoryProps {}

export interface IHistoryState {
    loadingData: boolean;
    historyDataShopping: IHistoryProps[];
}

export class ShoppingHistory extends Component<IHistoryProps, IHistoryState> {
    constructor(props: IHistoryProps) {
        super(props);
        this.state = {
            loadingData: true,
            historyDataShopping: [],
        };
    }

    private async retrieveBuyerHistory(): Promise<IHistoryProps[]> {
        try {
            const result = (await Fetcher.get('/history/buyer_history')) as any[];
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
                } as IHistoryProps;
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
            historyDataShopping: await this.retrieveBuyerHistory(),
        });
    }

    public render(): JSX.Element {
        const date = new Date();
        const n = date.toDateString();
        const time = date.toLocaleTimeString();

        return (
            <motion.div id="listStyling" initial="hidden" animate="show" exit="exit">
                <motion.div variants={sliderContainer}>
                    <motion.div id="frame1" variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#222222' }} variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#1c929c' }} variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#222222' }} variants={slider}></motion.div>
                </motion.div>
                <motion.div className="form-fields">
                    <motion.div className="wrapper fadeInDown">
                        <motion.div variants={pageAnimation} style={{ marginBottom: '60vh' }} id="formContent">
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

                            <motion.h3 variants={fade} style={{ color: '#dd9f00' }} className="heading-title">
                                {' '}
                                <FontAwesomeIcon color="#fff" icon={faShoppingCart} /> Shopping History
                            </motion.h3>
                            <div>
                                <motion.h6 variants={fade} className="total-result">
                                    Total shopping records:{' '}
                                    <span className="total-result-span" style={{ color: '#dd9f00' }}>
                                        {this.state.historyDataShopping.length}
                                    </span>
                                </motion.h6>
                                <br />
                                {this.state.loadingData ? (
                                    <h3>Loading...</h3>
                                ) : (
                                    <div id="printable" style={{ overflow: 'overlay', maxHeight: '500px' }}>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '8%', background: '#dd9f00', color: '#fff' }}>
                                                        No
                                                    </th>
                                                    <th style={{ background: '#dd9f00', color: '#fff' }}>Product</th>
                                                    <th style={{ background: '#dd9f00', color: '#fff' }}>Seller</th>
                                                    <th style={{ background: '#dd9f00', color: '#fff' }}>Date</th>
                                                    <th style={{ background: '#dd9f00', color: '#fff' }}>Cost</th>
                                                </tr>
                                            </thead>
                                            {this.state.historyDataShopping.map((item: any, i: any) => {
                                                return (
                                                    <>
                                                        <tbody>
                                                            <tr>
                                                                <td style={{ width: '8%' }}>{i + 1}</td>
                                                                <td>{item.title}</td>
                                                                <td>{item.name}</td>
                                                                <td>{item.timestamp.split('T')[0]}</td>
                                                                {item.amount != null ? (
                                                                    <td
                                                                        className="total-result-span"
                                                                        style={{ color: '#dd9f00' }}
                                                                    >
                                                                        {item.amount}
                                                                        <FontAwesomeIcon icon={faCoins} />
                                                                        <FontAwesomeIcon icon={faLevelDownAlt} />
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
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }
}
