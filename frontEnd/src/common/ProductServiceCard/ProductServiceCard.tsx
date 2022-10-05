import React, { Component } from 'react';
import './ProductServiceCard.scss';
import { Row, Col } from 'react-bootstrap';
import { StarFill, StarHalf, Star } from 'react-bootstrap-icons';
import { CheckOutBuyModal } from './CheckOutBuyModal';

export interface IProductServiceCardProps {
    id: number;
    title: string;
    rating: number;
    seller: string;
    categories: string[]; // TODO type?
    start: Date;
    end: Date;
    price: number;
    quantity: number;
    productPhoto: URL; // TODO type?
    description: string;
    address: string;
    reloadPropsCallback: () => void;
}

export interface IProductServiceCardState {
    showCheckOutModal: boolean;
}

export class ProductServiceCard extends Component<IProductServiceCardProps, IProductServiceCardState> {
    private static readonly FORMAT_DATE = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };

    constructor(props: IProductServiceCardProps) {
        super(props);
        this.state = {
            showCheckOutModal: false,
        };
    }

    public render(): JSX.Element {
        const { title, description, rating, seller, categories, start, end, price, productPhoto, address } = this.props;
        return (
            <div className="product-service-card">
                <Row className="p-4">
                    <Col xs={12} xl={6}>
                        <div
                            className="images"
                            style={{
                                backgroundImage: 'url(' + productPhoto.href + ')',
                            }}
                        ></div>
                        <div className="categories my-2">
                            {categories.map((x, i) => {
                                return (
                                    <div className="category" style={{ display: 'inline-block' }} key={i}>
                                        <i className="btn-card card-category">{x}</i>
                                    </div>
                                );
                            })}
                        </div>
                    </Col>
                    <Col xs={12} xl={6}>
                        <div className="product">
                            <h1 className="title">{title}</h1>
                            <p className="seller mb-1 mt-3 mt-md-1">
                                <i>seller:</i> {seller}
                            </p>
                            <h2 className="price">{Number(price).toFixed(2)} t.c.</h2>
                            {address && <p className="desc">{address}</p>}
                            <p className="desc">{description}</p>
                            {[1, 2, 3, 4, 5].map((i, k) => {
                                if (i <= rating) {
                                    return <StarFill className="mb-1" key={k} size={13} />;
                                } else {
                                    if (rating !== i - 1 && i <= Math.floor(rating + 1)) {
                                        return <StarHalf className="mb-1" key={k} size={13} />;
                                    } else {
                                        return <Star className="mb-1" key={k} size={13} />;
                                    }
                                }
                            })}
                            <p className="timeslot">
                                {/* WARN: for an unknown reason the server can't compile this without those 2 cast to any */}
                                From {start.toLocaleDateString(undefined, ProductServiceCard.FORMAT_DATE as any)} - To{' '}
                                {end.toLocaleDateString(undefined, ProductServiceCard.FORMAT_DATE as any)}
                            </p>
                            <div className="buttons text-center">
                                <button className="add" onClick={() => this.changeShowModalState(true)}>
                                    Buy
                                </button>
                                <button className="like">
                                    <svg className="heart" viewBox="0 0 32 29.6">
                                        <path
                                            d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
                                        c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </Col>
                </Row>
                {this.state.showCheckOutModal && (
                    <CheckOutBuyModal
                        show={this.state.showCheckOutModal}
                        product={this.props}
                        setModalStateCallBack={this.changeShowModalState.bind(this)}
                    />
                )}
            </div>
        );
    }

    private changeShowModalState(newState: boolean): void {
        this.setState({
            showCheckOutModal: newState,
        });
    }
}
