/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { Component } from 'react';
import '../profilePage/Profile.scss';
import { Row, Col, Container, Form, Card, Dropdown, Image, Overlay } from 'react-bootstrap';
import { ResponsePresenter } from '../utils/responsePresenter';
import Fetcher from '../common/Fetcher';
import ImageUploader from 'react-images-upload';
import { loadFileBase64 } from '../utils/FileReader';
import { ENV } from '../env';
import { IUser } from '../common/BackendTypes';
import { Flower1 } from 'react-bootstrap-icons';
import './Profile2.scss';
import { motion } from 'framer-motion';

import { pageAnimation, fade, titleAnim, slider, sliderContainer, imageProfile, LineAnim } from '../animation';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCoins,
    faUser,
    faBirthdayCake,
    faIdCard,
    faEnvelope,
    faKey,
    faMapMarker,
} from '@fortawesome/free-solid-svg-icons';

export interface IProfileProps {}

export interface IProfileState {
    currentProfile?: IUser;
    newAddress?: string;
    oldPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    errors: string[];
    isEditing: boolean; // probably to remove
    newPictures?: File;
    dropDownChoice: 'current image' | 'remove image' | 'upload image';
}

export class Profile extends Component<IProfileProps, IProfileState> {
    private static readonly IMAGE_MAX_SIZE_DEFAULT = 5242880;
    private static readonly DEFAULT_IMAGE = new URL(ENV.SERVER_URL + '/images/profiles/default_image.png');
    private imageRef = React.createRef<HTMLDivElement>();
    private newPassRef = React.createRef<HTMLInputElement>();
    private oldPasswRef = React.createRef<HTMLInputElement>();
    private confirmPasswRef = React.createRef<HTMLInputElement>();
    private addressRef = React.createRef<HTMLInputElement>();
    private static readonly PASSWORD_PLACEHOLDER = '******';

    constructor(props: IProfileProps) {
        super(props);
        this.state = {
            dropDownChoice: 'current image',
            currentProfile: undefined,
            newAddress: undefined,
            newPictures: undefined,
            newPassword: undefined,
            confirmPassword: undefined,
            oldPassword: undefined,
            errors: [],
            isEditing: false,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setError = this.setError.bind(this);
        this.checkPassword = this.checkPassword.bind(this);
        this.checkPasswordsMatch = this.checkPasswordsMatch.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.checkErrors = this.checkErrors.bind(this);
        this.reloadProfileInformation = this.reloadProfileInformation.bind(this);
    }

    private async retrieveProfileInformation(): Promise<IUser | undefined> {
        try {
            // eslint-disable-next-line prefer-const
            let res: IUser = (await Fetcher.get<{ user: IUser }>('/profile/info')).user;
            res.picture = ENV.SERVER_URL + res.picture.replace('public', '');
            return res;
        } catch (e) {
            console.error(e);
            return undefined;
        }
    }

    private async reloadProfileInformation(): Promise<void> {
        const currentProfile = await this.retrieveProfileInformation();
        this.setState({
            currentProfile: currentProfile,
            newPassword: Profile.PASSWORD_PLACEHOLDER,
            newAddress: currentProfile?.address,
        });
    }

    public async componentDidMount(): Promise<void> {
        await this.reloadProfileInformation();
    }

    private onDrop(pictureFiles: File[]) {
        console.log('dbg', pictureFiles);
        console.log(this.state);
        this.setState({
            newPictures: pictureFiles[0],
        });
    }

    public render(): JSX.Element {
        return (
            <motion.div exit="exit" initial="hidden" animate="show" id="profileStyling">
                <motion.div variants={sliderContainer}>
                    <motion.div id="frame1" variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#222222' }} variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#1c929c' }} variants={slider}></motion.div>
                    <motion.div id="frame1" style={{ background: '#222222' }} variants={slider}></motion.div>
                </motion.div>
                <motion.div className="form-fields">
                    <motion.div className="wrapper fadeInDown">
                        <motion.div
                            variants={pageAnimation}
                            style={{ marginBottom: '20vh' }}
                            id="formContent"
                            className="text-center"
                        >
                            <div className="container profile">
                                <Form className="my-3">
                                    <div className="row topProfile">
                                        <div className="col-md-4">
                                            <motion.div variants={imageProfile} className="profile-img">
                                                <motion.div
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    ref={this.imageRef}
                                                >
                                                    {(!this.state.isEditing ||
                                                        this.state.dropDownChoice === 'current image') && (
                                                        <Image
                                                            src={this.state.currentProfile?.picture}

                                                            // comment out line below
                                                            // this.state.currentProfile?.picture}
                                                        />
                                                    )}
                                                    {this.state.isEditing &&
                                                        this.state.dropDownChoice === 'upload image' && (
                                                            <div id="imageUploader">
                                                                <ImageUploader
                                                                    singleImage
                                                                    withIcon={true}
                                                                    buttonText="Upload"
                                                                    onChange={this.onDrop}
                                                                    imgExtension={[
                                                                        '.jpg',
                                                                        '.gif',
                                                                        '.png',
                                                                        '.gif',
                                                                        '.jpeg',
                                                                    ]}
                                                                    maxFileSize={Profile.IMAGE_MAX_SIZE_DEFAULT}
                                                                    withPreview={true}
                                                                />
                                                            </div>
                                                        )}
                                                    {this.state.isEditing &&
                                                        this.state.dropDownChoice === 'remove image' && (
                                                            <Image src={Profile.DEFAULT_IMAGE.href} />
                                                        )}
                                                </motion.div>
                                                <Overlay
                                                    target={this.imageRef.current}
                                                    show={this.state.isEditing}
                                                    placement="top-end"
                                                >
                                                    {({ placement, arrowProps, show: _show, popper, ...props }) => (
                                                        <div
                                                            {...props}
                                                            style={{
                                                                ...props.style,
                                                            }}
                                                        >
                                                            <Dropdown>
                                                                <Dropdown.Toggle variant="success" size="sm" />
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item
                                                                        href="#"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                dropDownChoice: 'current image',
                                                                            });
                                                                        }}
                                                                    >
                                                                        Current Image
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        href="#"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                dropDownChoice: 'remove image',
                                                                            });
                                                                        }}
                                                                    >
                                                                        Remove Image
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item
                                                                        href="#"
                                                                        onClick={() => {
                                                                            this.setState({
                                                                                dropDownChoice: 'upload image',
                                                                            });
                                                                        }}
                                                                    >
                                                                        Upload New Image
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown>
                                                        </div>
                                                    )}
                                                </Overlay>
                                                {/* <div className="file btn btn-lg btn-primary">
                                            Change Photo
                                            <input type="file" name="file"/>
                                        </div> */}
                                            </motion.div>
                                        </div>
                                        <div className="col-md-6">
                                            <motion.div
                                                variants={fade}
                                                className="profile-head"
                                                style={{ display: 'inline-block', float: 'left', width: '100%' }}
                                            >
                                                <motion.h3 variants={fade}>My Profile</motion.h3>

                                                <motion.h6 variants={fade}>
                                                    Welcome
                                                    <span>
                                                        {' '}
                                                        {this.state.currentProfile?.name}{' '}
                                                        {this.state.currentProfile?.surname}{' '}
                                                    </span>
                                                </motion.h6>

                                                <motion.p variants={fade}>
                                                    Current Balance :{' '}
                                                    <span>
                                                        {' '}
                                                        {this.state.currentProfile?.balance || '-'}{' '}
                                                        <FontAwesomeIcon icon={faCoins} />
                                                    </span>{' '}
                                                </motion.p>
                                                {/* <ul className="nav nav-tabs" id="myTab" role="tablist">
                                            <li className="nav-item">
                                                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">About</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Timeline</a>
                                            </li>
                                        </ul> */}
                                            </motion.div>
                                        </div>
                                        <motion.div variants={fade} className="col-md-2">
                                            <motion.input
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                className="btn-zena profile-edit-btn"
                                                style={{ float: 'left' }}
                                                type={this.state.isEditing ? 'button' : 'submit'}
                                                value={this.state.isEditing ? 'Submit' : 'Edit'}
                                                disabled={!(!this.state.isEditing || !this.state.errors.length)}
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    if (this.state.isEditing) {
                                                        await this.handleSubmit();
                                                    }
                                                    this.toggleButtonStatus();
                                                }}
                                            />{' '}
                                        </motion.div>
                                    </div>
                                    <motion.div variants={LineAnim} className="line"></motion.div>

                                    <motion.div variants={fade} className="row">
                                        <Col>
                                            <div className="border-right" style={{ paddingTop: '4rem' }}>
                                                <div className="profile-navigation">
                                                    <a href="/sales">Sales History</a>
                                                    <br />
                                                    <a href="/shopping">Shopping History</a>
                                                    <br />
                                                </div>
                                            </div>
                                            <div className="span6"></div>
                                        </Col>

                                        <Col xs={12} md={8}>
                                            <div>
                                                <div className="tab-content profile-tab" id="myTabContent">
                                                    <div
                                                        className="tab-pane fade show active"
                                                        id="home"
                                                        role="tabpanel"
                                                        aria-labelledby="home-tab"
                                                    >
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Form.Label className="form.fields">
                                                                    {' '}
                                                                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                                                                    First name
                                                                </Form.Label>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Form.Control
                                                                    readOnly
                                                                    value={this.state.currentProfile?.name}
                                                                    placeholder="First name"
                                                                    type="text"
                                                                    name="name"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Form.Label>
                                                                    {' '}
                                                                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                                                                    Surname
                                                                </Form.Label>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Form.Control
                                                                    readOnly
                                                                    value={this.state.currentProfile?.surname}
                                                                    placeholder="Surname"
                                                                    type="text"
                                                                    name="surname"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Form.Label>
                                                                    <FontAwesomeIcon
                                                                        icon={faBirthdayCake}
                                                                        className="mr-2"
                                                                    />
                                                                    Birthdate
                                                                </Form.Label>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Form.Control
                                                                    readOnly
                                                                    value={new Date(
                                                                        this.state.currentProfile?.birthdate || 0,
                                                                    ).toLocaleDateString()}
                                                                    placeholder="Birthdate"
                                                                    type="text"
                                                                    name="Birthdate"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Form.Label>
                                                                    <FontAwesomeIcon icon={faIdCard} className="mr-2" />
                                                                    Fiscal Code
                                                                </Form.Label>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Form.Control
                                                                    readOnly
                                                                    value={this.state.currentProfile?.fiscalCode}
                                                                    placeholder="Fiscal Code"
                                                                    type="text"
                                                                    name="Fiscal Code"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Form.Label>
                                                                    <FontAwesomeIcon
                                                                        icon={faEnvelope}
                                                                        className="mr-2"
                                                                    />
                                                                    Email
                                                                </Form.Label>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Form.Control
                                                                    readOnly
                                                                    value={this.state.currentProfile?.email}
                                                                    placeholder="Email"
                                                                    type="email"
                                                                    name="email"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Form.Label>
                                                                    <FontAwesomeIcon icon={faKey} className="mr-2" />
                                                                    New Password
                                                                </Form.Label>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Form.Control
                                                                    ref={this.newPassRef}
                                                                    readOnly={!this.state.isEditing}
                                                                    value={this.state.newPassword}
                                                                    placeholder={
                                                                        this.state.isEditing
                                                                            ? 'New Password'
                                                                            : 'Password'
                                                                    }
                                                                    type="password"
                                                                    name="password"
                                                                    onChange={(e) => {
                                                                        this.setState(
                                                                            { newPassword: e.target.value },
                                                                            this.checkErrors,
                                                                        );
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                        {this.state.isEditing && (
                                                            <>
                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <Form.Label>
                                                                            <FontAwesomeIcon
                                                                                icon={faKey}
                                                                                className="mr-2"
                                                                            />
                                                                            Confirm Password
                                                                        </Form.Label>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <Form.Control
                                                                            ref={this.confirmPasswRef}
                                                                            readOnly={!this.state.isEditing}
                                                                            value={this.state.confirmPassword}
                                                                            placeholder="Confirm password"
                                                                            type="password"
                                                                            name="confirmPassword"
                                                                            onChange={(e) => {
                                                                                this.setState(
                                                                                    { confirmPassword: e.target.value },
                                                                                    this.checkErrors,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="row">
                                                                    <div className="col-md-6">
                                                                        <Form.Label>
                                                                            <FontAwesomeIcon
                                                                                icon={faKey}
                                                                                className="mr-2"
                                                                            />
                                                                            Old Password
                                                                        </Form.Label>
                                                                    </div>
                                                                    <div className="col-md-6">
                                                                        <Form.Control
                                                                            ref={this.oldPasswRef}
                                                                            readOnly={!this.state.isEditing}
                                                                            value={this.state.oldPassword}
                                                                            placeholder="Old password"
                                                                            type="password"
                                                                            name="oldPassword"
                                                                            onChange={(e) => {
                                                                                this.setState(
                                                                                    { oldPassword: e.target.value },
                                                                                    this.checkErrors,
                                                                                );
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )}

                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Form.Label>
                                                                    <FontAwesomeIcon
                                                                        icon={faMapMarker}
                                                                        className="mr-2"
                                                                    />
                                                                    Address
                                                                </Form.Label>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Form.Control
                                                                    ref={this.addressRef}
                                                                    readOnly={!this.state.isEditing}
                                                                    value={
                                                                        this.state.isEditing
                                                                            ? this.state.newAddress
                                                                            : this.state.currentProfile?.address
                                                                    }
                                                                    placeholder="Address"
                                                                    type="text"
                                                                    name="address"
                                                                    onChange={(e) => {
                                                                        e.preventDefault();
                                                                        this.setState(
                                                                            { newAddress: e.target.value },
                                                                            this.checkErrors,
                                                                        );
                                                                        // this.checkError(
                                                                        //     e,
                                                                        //     'Address not valid, es: Via Dodecaneso 35, 16146, Genoa, GE',
                                                                        //     this.checkAddress,
                                                                        // );
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="row">
                                                            <div className="col-md-12">
                                                                <div className="text-center text-danger mb-3">
                                                                    {this.state.errors.map((error, key) => {
                                                                        return <div key={key}> {error} </div>;
                                                                    })}
                                                                </div>
                                                                <div className="text-center"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </motion.div>
                                </Form>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        );
    }

    private toggleButtonStatus(): void {
        const isEditing = !this.state.isEditing;
        this.setState({
            isEditing: !this.state.isEditing,
            newPassword: isEditing ? '' : Profile.PASSWORD_PLACEHOLDER,
            confirmPassword: '',
            oldPassword: '',
        });
        console.log(this.state.newPassword);
    }

    private async handleSubmit() {
        // todo check
        console.log(this.state);
        const body = {
            email: this.state.currentProfile?.email,
            address: this.state.newAddress,
            deleteImage: this.state.dropDownChoice === 'remove image',
            image: this.state.newPictures ? await loadFileBase64(this.state.newPictures) : undefined,
            ...(this.state.newPassword && { newPassword: this.state.newPassword }),
            ...(this.state.oldPassword && { oldPassword: this.state.oldPassword }),
        };
        Fetcher.post('/profile/update', body)
            .then(() => {
                ResponsePresenter.success('Edit profile with success!');
                this.reloadProfileInformation();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    private async checkErrors() {
        const { newPassword, oldPassword, newAddress, confirmPassword } = this.state;
        if (!newPassword && !confirmPassword && !oldPassword) {
            this.setError(true, 'Passwords does not match!', this.confirmPasswRef.current);
            this.setError(true, 'Invalid password', this.oldPasswRef.current);
            this.setError(
                true,
                'Password MUST cointains: lowercase char, uppercase char, numbers and special char!',
                this.newPassRef.current,
            );
            await this.setState({ errors: [] });
        }
        console.log(newAddress);
        this.setError(
            this.checkAddress(newAddress),
            'Address not valid, es: Via Dodecaneso 35, 16146, Genoa, GE',
            this.addressRef.current,
        );
        if (newPassword || confirmPassword)
            this.setError(
                this.checkPassword(newPassword),
                'Password MUST cointains: lowercase char, uppercase char, numbers and special char!',
                this.newPassRef.current,
            );
        if (confirmPassword)
            this.setError(this.checkPasswordsMatch(), 'Passwords does not match!', this.confirmPasswRef.current);
        if (oldPassword) {
            this.setError(
                this.checkPassword(newPassword),
                'Password MUST cointains: lowercase char, uppercase char, numbers and special char!',
                this.newPassRef.current,
            );
        }
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    private async setError(deleteError: boolean, errorMsg: string, el: HTMLElement | null, notModifyColor = false) {
        if (el) {
            const idx = this.state.errors.indexOf(errorMsg);
            if (deleteError) {
                const newClass = el.className.concat(' border-white');
                el.className = notModifyColor ? el.className : newClass;
                if (idx >= 0) {
                    this.setState({ errors: this.state.errors.filter((elem) => elem !== errorMsg) });
                }
            } else {
                const newClass = el.className.concat(' border-danger');
                el.className = notModifyColor ? el.className : newClass;
                if (idx < 0) {
                    this.setState({ errors: this.state.errors.concat(errorMsg) });
                }
            }
        }
    }

    private checkPassword(pwd: string | undefined): boolean {
        return (pwd &&
            pwd.length <= 100 &&
            pwd.length >= 8 &&
            /[a-z]/.test(pwd) &&
            /[A-Z]/.test(pwd) &&
            /[0-9]/.test(pwd) &&
            /[^a-zA-Z0-9]/.test(pwd)) as boolean;
    }

    private checkPasswordsMatch(): boolean {
        const pass1 = this.state.newPassword;
        const pass2 = this.state.confirmPassword;

        return (pass1 && pass2 && pass1 === pass2) as boolean;
    }

    private checkAddress(address: string | undefined): boolean {
        return (!!address &&
            address.length <= 100 &&
            /^[a-zA-Z0-9' ]+, [0-9]{5}, [a-zA-Z]+, [A-Z]{2}$/.test(address)) as boolean;
    }
}
