import React, { Component } from 'react';
import './FeatureItem.css';
import { ButtonRounded, ButtonRoundMockData } from '../common/ButtonRounded/ButtonRounded';

export type FeatureItemImagePosition = 'left' | 'right';

export interface IFeatureItemProps {
    imagePosition: FeatureItemImagePosition;
    title: string;
    text: string;
    image: URL;
}

export class FeatureItem extends Component<IFeatureItemProps> {
    public render() {
        const { imagePosition } = this.props;
        return imagePosition === 'left' ? this.renderLeft() : this.renderRight();
    }

    private renderRight() {
        const { title, text, image } = this.props;
        return (
            <section className="section" id="about2">
                <div className="container">
                    <div className="row">
                        <div className="left-text col-lg-5 col-md-12 col-sm-12 mobile-bottom-fix">
                            <div className="left-heading">
                                <h5>{title}</h5>
                            </div>
                            <p>{text}</p>
                            <ButtonRounded {...ButtonRoundMockData} />
                        </div>
                        <div
                            className="right-image col-lg-7 col-md-12 col-sm-12 mobile-bottom-fix-big"
                            data-scroll-reveal="enter right move 30px over 0.6s after 0.4s"
                        >
                            <img src={image.href} className="rounded img-fluid d-block mx-auto" alt="App" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    private renderLeft() {
        const { title, text, image } = this.props;
        return (
            <section className="section" id="about">
                <div className="container">
                    <div className="row">
                        <div
                            className="col-lg-7 col-md-12 col-sm-12"
                            data-scroll-reveal="enter left move 30px over 0.6s after 0.4s"
                        >
                            <img src={image.href} className="rounded img-fluid d-block mx-auto" alt="App" />
                        </div>
                        <div className="right-text col-lg-5 col-md-12 col-sm-12 mobile-top-fix">
                            <div className="left-heading">
                                <h5>{title}</h5>
                            </div>
                            <div className="left-text">
                                <p>
                                    {text}
                                    <br />
                                    <br />
                                    <ButtonRounded {...ButtonRoundMockData} />
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="hr" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export const FeatureItemMockData = {
    title: 'Sell your products',
    text: 'Here we can add some details for example or something else I dont know. for now this text is enough.',
    image: new URL('https://www.culturafelina.it/wp-content/uploads/2017/08/la-guida-del-gattino1-648x324.jpg'),
} as IFeatureItemProps;
export const FeatureItemMockDataSell = {
    title: 'Sell your products',
    text: 'You can sell what you want, in compliance with the internal regulations of the community.',
    image: new URL('https://i.ibb.co/Dr10Lm3/left-image.png'),
} as IFeatureItemProps;
export const FeatureItemMockDataBuy = {
    title: 'Buy what you want',
    text: 'Inside you will find several products sold by community members.',
    image: new URL('https://i.ibb.co/JCXT41m/right-image.png'),
} as IFeatureItemProps;
