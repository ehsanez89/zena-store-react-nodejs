import React, { Component } from 'react';
import { Row, Col, Container, Form, Modal } from 'react-bootstrap';
import { ResponsePresenter } from '../utils/responsePresenter';
import '../assets/css/bootstrap.min.css';
import '../assets/scss/common.scss';
import '../assets/scss/FormFields.scss';
import '../loginPage/Login.scss';
import logo from '../assets/images/logo.png';
import Fetcher from '../common/Fetcher';
import GoogleLogin from 'react-google-login'

export interface ILoginProps {
    forgotAccountUrl: URL;
    show: boolean;
    toggleModalLoginCallBack: (boolean) => void;
    toggleModalRegistrationCallBack: (boolean) => void;
    setIsLoggedCallBack: (boolean) => void;
}

export interface ILoginState {
    email: string;
    password: string;
}

export class Login extends Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.hideModal = this.hideModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    public render(): JSX.Element {
        const { forgotAccountUrl } = this.props;
        return (
            <div>
                <Modal portalClassName="modal" show={this.props.show} onHide={this.hideModal}>
                    <Modal.Header closeButton>
                        <img className="mx-auto d-block" src={logo} />
                    </Modal.Header>
                    <Form className="my-3" onSubmit={this.handleSubmit}>
                        <Container>
                            <Row className="justify-content-center row mt-3">
                                <Col md={10} xl={8}>
                                    <Form.Control
                                        value={this.state.email}
                                        placeholder="Email"
                                        type="email"
                                        name="email"
                                        onChange={(e) => this.setState({ email: e.target.value })}
                                    />
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col md={10} xl={8}>
                                    <Form.Control
                                        value={this.state.password}
                                        placeholder="Password"
                                        type="password"
                                        name="password"
                                        onChange={(e) => this.setState({ password: e.target.value })}
                                    />
                                </Col>
                            </Row>
                        
                            {/* todo */}
                            <div className="text-center">
                                <input className="btn btn-zena px-5 py-2 row mt-1" type="submit" value="Submit" />
                            </div>

                            <Row className="justify-content-center row mt-3">
                                <a href={forgotAccountUrl.href}>Forgotten account?</a>
                            </Row>

                            <Row className="justify-content-center row mt-1">
                                <a
                                    href="javascript:void(0);"
                                    onClick={() => {
                                        this.hideModal();
                                        this.props.toggleModalRegistrationCallBack(true);
                                    }}
                                >
                                    Sign up for Zena Sharing
                                </a>
                            </Row>
                        </Container>
                        
                    </Form>
                </Modal>
            </div>
        );
    }

    private hideModal() {
        this.props.toggleModalLoginCallBack(false);
    }

    private async handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const creds = {
            email: this.state.email,
            password: this.state.password,
        };
        Fetcher.post('/auth/signin', creds)
            .then(() => {
                ResponsePresenter.success('Logged in with success!');
                this.props.setIsLoggedCallBack(true);
                this.hideModal();
            })
            .catch((err) => {
                console.error(err);
            });
    }
}
