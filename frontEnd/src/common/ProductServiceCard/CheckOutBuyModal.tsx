import React, { Component } from 'react';
import { Row, Col, Container, Form, Modal } from 'react-bootstrap';
import logo from '../../assets/images/logo.png';
import { ResponsePresenter } from '../../utils/responsePresenter';
import { ButtonRounded } from '../ButtonRounded/ButtonRounded';
import Fetcher from '../Fetcher';
import { IProductServiceCardProps } from './ProductServiceCard';
import './ProductServiceCard.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faCheck, faStore, faBan, faBalanceScaleRight, faCoins } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { fade, imageProfile, LineAnim } from '../../animation';

export interface ICheckOutBuyModalProps {
    show: boolean;
    product: IProductServiceCardProps;
    setModalStateCallBack: (boolean) => void;
}

export interface ICheckOutBuyModalState {
    balance: number;
}

export class CheckOutBuyModal extends Component<ICheckOutBuyModalProps, ICheckOutBuyModalState> {
    constructor(props: ICheckOutBuyModalProps, state: ICheckOutBuyModalState) {
        super(props);
        this.state = {
            balance: 0,
        };
        this.getBalance();
    }

    public render(): JSX.Element {
        const product = this.props.product;
        return (
            <motion.div exit="exit" initial="hidden" animate="show">
                <Modal
                    portalClassName="modal"
                    show={this.props.show}
//                    onHide={this.props.setModalStateCallBack}
                    centered
                >
                    <Modal.Header
                        style={{ background: '#292929', margin: '0px', color: 'white', borderBottom: 'none' }}
                        closeButton
                    >
                        <motion.div variants={imageProfile}>
                            <h4>
                                <FontAwesomeIcon icon={faCheck} /> Confirm Transfer
                            </h4>
                            <motion.div variants={LineAnim} className="line" style={{ marginBottom: '0' }}></motion.div>
                        </motion.div>
                    </Modal.Header>

                    <Modal.Body>
                        <motion.h6 variants={fade} style={{ color: 'white', paddingLeft: '0.17rem' }}>
                            <FontAwesomeIcon color={'white'} icon={faBox} />
                            Product:<span>{product.title}</span>
                        </motion.h6>

                        <motion.h6 style={{ color: 'white' }}>
                            <FontAwesomeIcon color={'white'} icon={faStore} />
                            Remaining: <span>{product.quantity}</span>
                        </motion.h6>

                        {this.state.balance - product.price >= 0 ? (
                            <motion.h6 variants={fade} style={{ color: '#dd9f00' }}>
                                <FontAwesomeIcon color={'#dd9f00'} icon={faBalanceScaleRight} /> Your balance after the
                                purchase is{' '}
                                <span>
                                    {this.state.balance - product.price} <FontAwesomeIcon icon={faCoins} />
                                </span>
                            </motion.h6>
                        ) : (
                            <motion.h6 variants={fade} style={{ color: '#dd9f00', paddingLeft: '0.17rem' }}>
                                {' '}
                                <FontAwesomeIcon color={'#dd9f00'} icon={faBan} /> You have not enough money! Recharge
                                your balance
                            </motion.h6>
                        )}
                    </Modal.Body>

                    <Modal.Footer style={{ margin: '0px', borderTop: 'none' }}>
                        <ButtonRounded buttonLabel={'CheckOut'} onClickCallBack={this.checkOut.bind(this)} />
                    </Modal.Footer>
                </Modal>
            </motion.div>
        );
    }

    private checkOut(): void {
        const productId = this.props.product.id.toString();

        Fetcher.post('/products/buy/'.concat(productId))
            .then(() => {
                ResponsePresenter.success('Product bought successfully');
                this.props.setModalStateCallBack(false);
                this.props.product.reloadPropsCallback();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    private async getBalance(): Promise<void> {
        this.setState({ balance: (await Fetcher.get<{ balance: number }>('/profile/balance')).balance });
    }
}
