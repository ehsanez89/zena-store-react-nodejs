import React, { Component } from 'react';
import './ButtonRoundes.scss';
import '../../assets/css/bootstrap.min.css';

export interface IButtonRoundedProps {
    buttonLabel: string;
    buttonUrl?: URL;
    onClickCallBack?: () => void;
}

export class ButtonRounded extends Component<IButtonRoundedProps> {
    public render(): JSX.Element {
        const { buttonUrl, buttonLabel, onClickCallBack } = this.props;
        return (
            <a
                href={buttonUrl ? buttonUrl.href : undefined}
                className="main-button"
                onClick={() => {
                    if (onClickCallBack) onClickCallBack();
                }}
            >
                {buttonLabel}
            </a>
        );
    }
}

export const ButtonRoundMockData = {
    buttonLabel: 'Discover More',
    buttonUrl: new URL('https://youtu.be/dQw4w9WgXcQ?t=1'),
} as IButtonRoundedProps;
