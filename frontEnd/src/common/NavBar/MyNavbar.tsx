import React, { Component } from 'react';
import logo from '../../assets/images/logo.png';
import './MyNavbar.scss';
import '../../assets/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { Login } from '../../loginPage/Login';
import { Registration } from '../../RegistrationPage/Registration';
import { Nav, NavDropdown } from 'react-bootstrap';
import Fetcher from '../../common/Fetcher';
import { IUser } from '../../common/BackendTypes';
import { Redirect } from 'react-router-dom';

enum ShowModal {
    LOGIN,
    REGISTRATION,
}

export interface MyNavbarItem {
    name: string;
    link: URL;
    onlyLogged?: boolean;
}

export interface IMyNavbarState {
    showModal: boolean[]; // indexed by ShowModal
    logged: boolean;
    profileInfos: IUser | null;
}

export interface IMyNavbarProps {
    items: MyNavbarItem[];
}

export class MyNavbar extends Component<IMyNavbarProps, IMyNavbarState> {
    public constructor(props: IMyNavbarProps) {
        super(props);
        this.state = {
            showModal: [false, false],
            logged: false,
            profileInfos: null,
        };
        this.toggleShowModalLogin = this.toggleShowModalLogin.bind(this);
        this.toggleShowModalRegistration = this.toggleShowModalRegistration.bind(this);
        this.setIsLoggedCallBack = this.setIsLoggedCallBack.bind(this);
    }

    public async componentDidMount(): Promise<void> {
        this.setState({
            logged: await this.getLogged(),
        });
    }

    public async componentDidUpdate(prevProps: IMyNavbarProps, prevState: IMyNavbarState): Promise<void> {
        if (prevState.logged !== this.state.logged && this.state.logged) {
            this.setState({
                profileInfos: await this.retrieveProfileInfos(),
            });
        }
    }

    private toggleShowModalRegistration(show: boolean) {
        const newShowModalState = this.state.showModal;
        newShowModalState[ShowModal.REGISTRATION] = show;
        this.setState({
            showModal: newShowModalState,
        });
    }

    private toggleShowModalLogin(show: boolean) {
        const newShowModalState = this.state.showModal;
        newShowModalState[ShowModal.LOGIN] = show;
        this.setState({
            showModal: newShowModalState,
        });
    }

    private setIsLoggedCallBack(isLogged: boolean) {
        this.setState({ logged: isLogged });
    }

    public render(): JSX.Element {
        const { items } = this.props;
        return (
            <Navbar collapseOnSelect className="pt-0 pb-1" style={{ background: '#252729' }} expand="md">
                <Container>
                    <Navbar.Brand className="mt-0 py-0 mynavbar" href="/">
                        <img className="logo" src={logo} />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto" />
                        <Nav>
                            {items.map((x: MyNavbarItem) => {
                                if (x.onlyLogged && !this.state.logged) return <></>;
                                else
                                    return (
                                        // eslint-disable-next-line react/jsx-key
                                        <Nav.Link className="mx-3 mynavlink" href={x.link.href}>
                                            {x.name}
                                        </Nav.Link>
                                    );
                            })}
                        </Nav>
                        <Nav>
                            {!this.state.logged ? (
                                <Nav.Link className="mx-3 mynavlink" onClick={() => this.toggleShowModalLogin(true)}>
                                    SignIn
                                </Nav.Link>
                            ) : (
                                this.renderBurger()
                            )}
                            {!this.state.logged && (
                                <Nav.Link
                                    className="mx-3 mynavlink"
                                    onClick={() => this.toggleShowModalRegistration(true)}
                                >
                                    Signup
                                </Nav.Link>
                            )}
                            <Login
                                forgotAccountUrl={new URL('http://forgotten')}
                                show={this.state.showModal[ShowModal.LOGIN]}
                                toggleModalLoginCallBack={this.toggleShowModalLogin}
                                toggleModalRegistrationCallBack={this.toggleShowModalRegistration}
                                setIsLoggedCallBack={this.setIsLoggedCallBack}
                            />
                            <Registration
                                show={this.state.showModal[ShowModal.REGISTRATION]}
                                toggleModalRegistrationCallBack={this.toggleShowModalRegistration}
                            ></Registration>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

    private renderBurger() {
        const { profileInfos } = this.state;
        return (
            <NavDropdown
                className="mx-3 mynavlink"
                title={`${profileInfos?.name} ${profileInfos?.surname}`}
                id="basic-nav-dropdown"
            >
                <NavDropdown.Item href="myProfile">My Profile</NavDropdown.Item>
                <NavDropdown.Item href="/sales">Sales History</NavDropdown.Item>
                <NavDropdown.Item href="/shopping">Shopping History</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.logout.bind(this)}>Logout</NavDropdown.Item>
            </NavDropdown>
        );
    }

    private logout() {
        Fetcher.get('/auth/logout').then(() => {
            this.setState(
                {
                    logged: false,
                },
                () => window.location.replace('/'),
            );
        });
    }

    private async getLogged(): Promise<boolean> {
        try {
            await Fetcher.get('/auth/verify', undefined, {
                displayPopUpErrorMsg: false,
            });
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    private async retrieveProfileInfos(): Promise<IUser | null> {
        try {
            const userInfo = await Fetcher.get<{ user: IUser }>('/profile/info');
            return userInfo.user;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
