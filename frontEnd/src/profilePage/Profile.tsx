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
    private static readonly DEFAULT_IMAGE = new URL(ENV.SERVER_URL + '/images/profiles/default_image_cat.png');
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

    public async componentDidMount(): Promise<void> {
        const currentProfile = await this.retrieveProfileInformation();
        this.setState({
            currentProfile: currentProfile,
            newPassword: Profile.PASSWORD_PLACEHOLDER,
            newAddress: currentProfile?.address,
        });
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
            <div className="form-fields">
                <div className="wrapper fadeInDown">
                    <div id="formContent" className="text-center">
                        <h3>Profile Page</h3>
                        <Form
                            className="my-3"
                            onSubmit={(e) => {
                                e.preventDefault();
                                this.handleSubmit();
                            }}
                        >
                            <Container>
                                <Row className="justify-content-center">
                                    <Col xs={8} sm={8} md={6} xl={4} lg={4}>
                                        <div ref={this.imageRef}>
                                            {(!this.state.isEditing ||
                                                this.state.dropDownChoice === 'current image') && (
                                                <Image src={this.state.currentProfile?.picture} />
                                            )}
                                            {this.state.isEditing && this.state.dropDownChoice === 'upload image' && (
                                                <ImageUploader
                                                    singleImage
                                                    withIcon={true}
                                                    buttonText="Upload"
                                                    onChange={this.onDrop}
                                                    imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
                                                    maxFileSize={Profile.IMAGE_MAX_SIZE_DEFAULT}
                                                    withPreview={true}
                                                />
                                            )}
                                            {this.state.isEditing && this.state.dropDownChoice === 'remove image' && (
                                                <Image src={Profile.DEFAULT_IMAGE.href} />
                                            )}
                                        </div>
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
                                    </Col>
                                </Row>
                                <Container className="mt-4">
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={3}>
                                            <Form.Label className="form.fields">First name</Form.Label>
                                        </Col>
                                        <Col md={8} xl={8}>
                                            <Form.Control
                                                readOnly
                                                value={this.state.currentProfile?.name}
                                                placeholder="First name"
                                                type="text"
                                                name="name"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={3}>
                                            <Form.Label>Surname</Form.Label>
                                        </Col>
                                        <Col md={8} xl={8}>
                                            <Form.Control
                                                readOnly
                                                value={this.state.currentProfile?.surname}
                                                placeholder="Surname"
                                                type="text"
                                                name="surname"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={3}>
                                            <Form.Label>Birthdate</Form.Label>
                                        </Col>
                                        <Col md={8} xl={8}>
                                            <Form.Control
                                                readOnly
                                                value={new Date(
                                                    this.state.currentProfile?.birthdate || 0,
                                                ).toLocaleDateString()}
                                                placeholder="Birthdate"
                                                type="text"
                                                name="Birthdate"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={3}>
                                            <Form.Label>Fiscal Code</Form.Label>
                                        </Col>
                                        <Col md={8} xl={8}>
                                            <Form.Control
                                                readOnly
                                                value={this.state.currentProfile?.fiscalCode}
                                                placeholder="Fiscal Code"
                                                type="text"
                                                name="Fiscal Code"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={3}>
                                            <Form.Label>Email</Form.Label>
                                        </Col>
                                        <Col md={8} xl={8}>
                                            <Form.Control
                                                readOnly
                                                value={this.state.currentProfile?.email}
                                                placeholder="Email"
                                                type="email"
                                                name="email"
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={3}>
                                            <Form.Label>New Password</Form.Label>
                                        </Col>
                                        <Col md={8} xl={8}>
                                            <Form.Control
                                                ref={this.newPassRef}
                                                readOnly={!this.state.isEditing}
                                                value={this.state.newPassword}
                                                placeholder={this.state.isEditing ? 'New Password' : 'Password'}
                                                type="password"
                                                name="password"
                                                onChange={(e) => {
                                                    this.setState({ newPassword: e.target.value }, this.checkErrors);
                                                    // this.setState({ newPassword: e.target.value }, () => {
                                                    //     this.checkError(e, '', this.checkAllPasswordsEmptyOrFilled).then(
                                                    //         () => {
                                                    //             this.checkError(
                                                    //                 e,
                                                    //                 'Password MUST cointains: lowercase char, uppercase char, numbers and special char!',
                                                    //                 this.checkPassword,
                                                    //             ).then(() => {
                                                    //                 this.checkError(
                                                    //                     e,
                                                    //                     'Passwords does not match!',
                                                    //                     this.checkPasswordsMatch,
                                                    //                     true,
                                                    //                 );
                                                    //             });
                                                    //         },
                                                    //     );
                                                    // });
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    {this.state.isEditing && (
                                        <>
                                            <Row className="justify-content-center">
                                                <Col md={2} xl={3}>
                                                    <Form.Label>Confirm Password</Form.Label>
                                                </Col>
                                                <Col md={8} xl={8}>
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
                                                            // this.setState({ confirmPassword: e.target.value }, () => {
                                                            //     this.checkError(
                                                            //         e,
                                                            //         'Passwords does not match!',
                                                            //         this.checkPasswordsMatch,
                                                            //     );
                                                            // });
                                                        }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="justify-content-center">
                                                <Col md={2} xl={3}>
                                                    <Form.Label>Old Password</Form.Label>
                                                </Col>
                                                <Col md={8} xl={8}>
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
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={3}>
                                            <Form.Label>Address</Form.Label>
                                        </Col>
                                        <Col md={8} xl={8}>
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
                                                    this.setState({ newAddress: e.target.value }, this.checkErrors);
                                                    // this.checkError(
                                                    //     e,
                                                    //     'Address not valid, es: Via Dodecaneso 35, 16146, Genoa, GE',
                                                    //     this.checkAddress,
                                                    // );
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center mt-3">
                                        <Col md={2} xl={2} className="justify-content-center text-white">
                                            {this.state.currentProfile?.balance || '-'}{' '}
                                            <Flower1 className="mb-1" color="white" size={30} />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={12} xl={5} className="col-md-offset-5">
                                            <div className="text-center text-danger mb-3">
                                                {this.state.errors.map((error, key) => {
                                                    return <div key={key}> {error} </div>;
                                                })}
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={12} xl={5} className="col-md-offset-5 mb-4">
                                            <div className="text-center">
                                                <input
                                                    className="btn btn-zena rounded-pill px-5 py-2"
                                                    type={this.state.isEditing ? 'button' : 'submit'}
                                                    value={this.state.isEditing ? 'Submit' : 'Edit'}
                                                    disabled={!(!this.state.isEditing || !this.state.errors.length)}
                                                    onClick={(e) => {
                                                        this.toggleButtonStatus();
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </Container>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

    private toggleButtonStatus(): void {
        this.setState({
            isEditing: !this.state.isEditing,
            newPassword: !this.state.isEditing ? '' : Profile.PASSWORD_PLACEHOLDER,
            confirmPassword: '',
            oldPassword: '',
        });
    }

    private async handleSubmit() {
        // todo check
        console.log(this.state);
        // eslint-disable-next-line prefer-const
        let body = {
            address: this.state.newAddress,
            newPassword: this.state.newPassword,
            oldPassword: this.state.oldPassword,
            deleteImage: this.state.dropDownChoice === 'remove image',
            image: this.state.newPictures ? await loadFileBase64(this.state.newPictures) : undefined,
        };
        Fetcher.post('/profile/update', body)
            .then(() => {
                ResponsePresenter.success('Edit profile with success!');
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
                el.className = notModifyColor ? el.className : 'border-white';
                if (idx >= 0) {
                    this.setState({ errors: this.state.errors.filter((elem) => elem !== errorMsg) });
                }
            } else {
                el.className = notModifyColor ? el.className : 'border-danger';
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
