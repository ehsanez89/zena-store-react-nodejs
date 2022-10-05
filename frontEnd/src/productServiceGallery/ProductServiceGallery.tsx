import React, { Component } from 'react';
import { IProductServiceCardProps, ProductServiceCard } from '../common/ProductServiceCard/ProductServiceCard';
import './ProductServiceGallery.scss';
import { Col, Container, Row } from 'react-bootstrap';
import Fetcher from '../common/Fetcher';
import { IProducts } from '../common/BackendTypes';
import { ResponsePresenter } from '../utils/responsePresenter';
import { ENV } from '../env';

export interface IProductServiceGalleryProps {}

export interface IProductServiceGalleryState {
    products: IProductServiceCardProps[];
}

export class ProductServiceGallery extends Component<IProductServiceGalleryProps, IProductServiceGalleryState> {
    constructor(props: IProductServiceGalleryProps) {
        super(props);
        this.state = {
            products: [],
        };
    }

    // todo 4 now mockdata <
    private async retrieveProducts(): Promise<IProductServiceCardProps[]> {
        try {
            return (await Fetcher.get<IProducts[]>('/products/list')).map((o) => {
                console.log(o);
                return {
                    id: o.id,
                    title: o.title,
                    rating: 4, // todo
                    seller: o.seller_name.concat(' ').concat(o.seller_surname),
                    categories: o.categories ? o.categories.split(',') : [],
                    start: new Date(o.start),
                    end: new Date(o.end),
                    price: o.price,
                    quantity: o.quantity,
                    productPhoto: new URL(
                        ENV.SERVER_URL +
                            '/images/products/' +
                            (o.picture ? o.id + '/' + o.picture : 'default_image.png'),
                    ),
                    description: o.description,
                    address: o.address,
                } as IProductServiceCardProps;
            });
        } catch (e) {
            console.error(e);
            ResponsePresenter.error('Error while retrieving products data');
            return [];
        }
    }

    public async componentDidMount(): Promise<void> {
        this.setState({
            products: await this.retrieveProducts(),
        });
    }

    public render(): JSX.Element {
        return (
            <Container fluid>
                <Row>
                    {this.state.products.map((p, i) => {
                        return (
                            <Col lg={6} md={6} key={i}>
                                <ProductServiceCard {...p} reloadPropsCallback={this.reloadProps.bind(this)} />
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        );
    }

    public async reloadProps(): Promise<void> {
        this.setState({
            products: await this.retrieveProducts(),
        });
    }
}
