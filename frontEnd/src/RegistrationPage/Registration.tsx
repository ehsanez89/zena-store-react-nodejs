import React, { Component } from 'react';
import '../assets/css/bootstrap.min.css';
import '../assets/scss/common.scss';
import logo from '../assets/images/logo.png';
import { Row, Col, Container, Form, Modal } from 'react-bootstrap';
import { ResponsePresenter } from '../utils/responsePresenter';
import Fetcher from '../common/Fetcher';

export interface IRegistrationProps {
    show: boolean;
    toggleModalRegistrationCallBack: (boolean) => void;
}

export interface IRegistrationState {
    firstName: string;
    surname: string;
    birthdate: string;
    fiscalCode: string;
    email: string;
    newPassword: string;
    confirmPassword: string;
    address: string;
    phone: string;
    errors: string[];
    filledForm: boolean;
}

export class Registration extends Component<IRegistrationProps, IRegistrationState> {
    constructor(props: IRegistrationProps) {
        super(props);
        this.state = {
            firstName: '',
            surname: '',
            birthdate: '',
            fiscalCode: '',
            email: '',
            newPassword: '',
            confirmPassword: '',
            address: '',
            phone: '',
            errors: [],
            filledForm: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.checkError = this.checkError.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkPasswordsMatch = this.checkPasswordsMatch.bind(this);
        this.checkFilledForm = this.checkFilledForm.bind(this);
    }

    public render(): JSX.Element {
        return (
            <Modal show={this.props.show} onHide={this.hideModal}>
                <Modal.Header closeButton>
                    <img className="mx-auto d-block" src={logo} />
                </Modal.Header>
                <Form
                    className="my-3"
                    onSubmit={(e) => {
                        e.preventDefault();
                        this.handleSubmit();
                    }}
                >
                    <Container>
                        <Row className="justify-content-center">
                            <Col sm={6} md={5} xl={4}>
                                <Form.Control
                                    value={this.state.firstName}
                                    placeholder="First name"
                                    type="text"
                                    name="firstName"
                                    onChange={(e) => {
                                        this.setState({ firstName: e.target.value });
                                        this.checkFilledForm();
                                    }}
                                />
                            </Col>
                            <Col sm={6} md={5} xl={4}>
                                <Form.Control
                                    value={this.state.surname}
                                    placeholder="Surname"
                                    type="text"
                                    name="surname"
                                    onChange={(e) => {
                                        this.setState({ surname: e.target.value });
                                        this.checkFilledForm();
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={10} xl={8}>
                                <Form.Control
                                    value={this.state.birthdate}
                                    placeholder="Birthdate"
                                    type="text"
                                    name="Birthdate"
                                    onFocus={(e) => {
                                        e.target.type = 'date';
                                    }}
                                    onBlur={(e) => {
                                        if (e.target.value === '') e.target.type = 'text';
                                    }}
                                    onChange={(e) => {
                                        this.setState({ birthdate: e.target.value });
                                        this.checkFilledForm();
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={10} xl={8}>
                                <Form.Control
                                    value={this.state.fiscalCode}
                                    placeholder="Fiscal Code"
                                    type="text"
                                    name="Fiscal Code"
                                    onChange={(e) => {
                                        this.setState({ fiscalCode: e.target.value });
                                        this.checkError(e, 'Fiscal code not valid', this.checkFiscalCode);
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={10} xl={8}>
                                <Form.Control
                                    value={this.state.email}
                                    placeholder="Email"
                                    type="email"
                                    name="email"
                                    onChange={(e) => {
                                        this.setState({ email: e.target.value });
                                        this.checkError(e, 'Email not valid', this.checkEmail);
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={10} xl={8}>
                                <Form.Control
                                    value={this.state.newPassword}
                                    placeholder="Password"
                                    type="password"
                                    name="newPassword"
                                    onChange={(e) => {
                                        this.setState({ newPassword: e.target.value }, () => {
                                            this.checkError(
                                                e,
                                                'Password MUST cointains: lowercase char, uppercase char, numbers and special char!',
                                                this.checkPassword,
                                            ).then(() => {
                                                this.checkError(
                                                    e,
                                                    'Passwords does not match!',
                                                    this.checkPasswordsMatch,
                                                    true,
                                                );
                                            });
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={10} xl={8}>
                                <Form.Control
                                    value={this.state.confirmPassword}
                                    placeholder="Confirm password"
                                    type="password"
                                    name="confirmPassword"
                                    onChange={(e) => {
                                        this.setState({ confirmPassword: e.target.value }, () => {
                                            this.checkError(e, 'Passwords does not match!', this.checkPasswordsMatch);
                                        });
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row className="justify-content-center">
                            <Col md={10} xl={8}>
                                <Form.Control
                                    value={this.state.address}
                                    placeholder="Address"
                                    type="text"
                                    name="address"
                                    onChange={(e) => {
                                        this.setState({ address: e.target.value });
                                        this.checkError(
                                            e,
                                            'Address not valid, es: Via Dodecaneso 35, 16146, Genoa, GE',
                                            this.checkAddress,
                                        );
                                    }}
                                />
                            </Col>
                        </Row>
                        <div className="text-center text-danger mb-3">
                            {this.state.errors.map((error, key) => {
                                return <div key={key}> {error} </div>;
                            })}
                        </div>
                        <div className="text-center">
                            <input
                                className="btn btn-zena rounded-pill px-5 py-2"
                                type="submit"
                                value="Submit"
                                disabled={!!this.state.errors.length || !this.state.filledForm}
                            />
                        </div>
                    </Container>
                </Form>
            </Modal>
        );
    }

    private checkFilledForm() {
        this.setState({
            filledForm:
                !!this.state.address &&
                !!this.state.birthdate &&
                !!this.state.fiscalCode &&
                !!this.state.email &&
                !!this.state.firstName &&
                !!this.state.newPassword &&
                !!this.state.surname,
        });
    }

    private async handleSubmit() {
        const creds = {
            address: this.state.address,
            birthdate: this.state.birthdate,
            fiscalCode: this.state.fiscalCode,
            email: this.state.email,
            name: this.state.firstName,
            password: this.state.newPassword,
            surname: this.state.surname,
        };
        Fetcher.post('/auth/signup', creds)
            .then(() => {
                ResponsePresenter.success('User registered with success!');
            })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                this.hideModal();
            });
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    private async checkError(e: React.ChangeEvent<any>, errorMsg: string, checkFun: Function, notModifyColor = false) {
        this.checkFilledForm();
        const idx = this.state.errors.indexOf(errorMsg);
        if (checkFun(e.target.value)) {
            e.target.className = notModifyColor ? e.target.className : 'border-white';
            if (idx >= 0) {
                this.setState({ errors: this.state.errors.filter((elem) => elem !== errorMsg) });
            }
        } else {
            e.target.className = notModifyColor ? e.target.className : 'border-danger';
            if (idx < 0) {
                this.setState({ errors: this.state.errors.concat(errorMsg) });
            }
        }
    }

    private checkFiscalCode(cf: string) {
        return /^[a-zA-Z]{6}[0-9]{2}[a-zA-Z][0-9]{2}[a-zA-Z][0-9]{3}[a-zA-Z]$/.test(cf);
    }

    private checkPassword(pwd: string) {
        return (
            pwd.length <= 100 &&
            pwd.length >= 8 &&
            /[a-z]/.test(pwd) &&
            /[A-Z]/.test(pwd) &&
            /[0-9]/.test(pwd) &&
            /[^a-zA-Z0-9]/.test(pwd)
        );
    }

    private checkEmail(email: string) {
        return (
            email &&
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                email,
            )
        );
    }

    private checkPasswordsMatch() {
        const pass1 = this.state.newPassword;
        const pass2 = this.state.confirmPassword;

        return pass1 && pass2 && pass1 === pass2;
    }

    private checkAddress(address: string) {
        return address && address.length <= 100 && /^[a-zA-Z0-9' ]+, [0-9]{5}, [a-zA-Z]+, [A-Z]{2}$/.test(address);
    }

    public showModal(): void {
        this.props.toggleModalRegistrationCallBack(true);
    }

    public hideModal(): void {
        this.props.toggleModalRegistrationCallBack(false);
    }
}
