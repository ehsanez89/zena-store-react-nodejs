import React, { Component } from 'react';
import { Row, Col, Container, Form } from 'react-bootstrap';
import NumericInput from 'react-numeric-input';
import ImageUploader from 'react-images-upload';
import 'react-datetime/css/react-datetime.css';
import Datetime from 'react-datetime';
import '../assets/scss/FormFields.scss';
import '../CreationProductService/CreationCard.scss';
import Select, { SelectItemRenderer } from 'react-dropdown-select';
import { toast, ToastOptions } from 'react-toastify';
import { ButtonRounded } from '../common/ButtonRounded/ButtonRounded';
import Cookies from 'universal-cookie';
import Fetcher from '../common/Fetcher';
import { IUser, ICategory as IBackCategory } from '../common/BackendTypes';
import { loadFileBase64 } from '../utils/FileReader';

interface ICategory {
    value: number;
    label: string;
}

export interface ICreationCardProps {
    toastSettings?: ToastOptions;
    imageMaxSize?: number;
    siteAbsoluteUrl: URL;
}

export interface ICreationCardState {
    title: string;
    pictures: File[];
    price: number;
    quantity: number;
    timeSlotFrom: Date;
    timeSlotTo: Date;
    address: string;
    description: string;
    options: ICategory[];
    categories: ICategory[];
}

export class CreationCard extends Component<ICreationCardProps, ICreationCardState> {
    private toastSettings;
    private imageMaxSize;
    private static readonly IMAGE_MAX_SIZE_DEFAULT = 5242880;
    private static readonly TOAST_SETTINGS_DEFAULT: ToastOptions = {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    };

    constructor(props: ICreationCardProps) {
        super(props);
        this.toastSettings = this.props.toastSettings || CreationCard.TOAST_SETTINGS_DEFAULT;
        this.imageMaxSize = this.props.imageMaxSize || CreationCard.IMAGE_MAX_SIZE_DEFAULT;
        this.state = {
            title: '',
            pictures: [],
            price: 1,
            quantity: 1,
            timeSlotFrom: new Date(),
            timeSlotTo: new Date(),
            address: '',
            description: '',
            options: [],
            categories: [],
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public async componentDidMount(): Promise<void> {
        this.retrieveCategories().then((options) => this.setState({ options: options }));
        this.retrieveProfileAddress().then((addr) => {
            if (addr) this.setState({ address: addr });
        });
    }

    public render(): JSX.Element {
        return (
            <div id="body-CreationCard">
                <div className="form-fields">
                    <div className="wrapper fadeInDown">
                        <div id="formContent" className="text-center">
                            <h3>Create a new product</h3>
                            <Form className="my-3">
                                <Container>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={1} className="justify-content-center">
                                            <Form.Label className="my-3 col-md-offset-5"> Title* </Form.Label>
                                        </Col>
                                        <Col md={12} xl={8} className="col-md-offset-5">
                                            <Form.Control
                                                value={this.state.title}
                                                placeholder="Enter the title"
                                                type="text"
                                                name="Title"
                                                onChange={(e) => this.setState({ title: e.target.value })}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={1} className="justify-content-center">
                                            <Form.Label className="my-3 col-md-offset-5"> Price* </Form.Label>
                                        </Col>
                                        <Col md={12} xl={8} className="col-md-offset-5">
                                            <NumericInput
                                                className="form-control numericinp"
                                                value={this.state.price}
                                                min={0.01}
                                                max={99999}
                                                step={1}
                                                precision={2}
                                                size={7}
                                                placeholder="Enter the price"
                                                maxLength={7}
                                                onChange={(valNum) => this.setState({ price: valNum || 0 })}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={1} className="justify-content-center">
                                            <Form.Label className="my-3 col-md-offset-5"> Quantity*</Form.Label>
                                        </Col>
                                        <Col md={12} xl={8} className="col-md-offset-5">
                                            <NumericInput
                                                className="form-control numericinp"
                                                value={this.state.quantity}
                                                min={1}
                                                max={99999}
                                                step={1}
                                                precision={0}
                                                size={3}
                                                maxLength={3}
                                                placeholder="Quantity"
                                                onChange={(valNum) => this.setState({ quantity: valNum || 0 })}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={1} className="justify-content-center">
                                            <Form.Label className="my-3 col-md-offset-5"> Category </Form.Label>
                                        </Col>
                                        <Col md={12} xl={8} className="col-md-offset-5">
                                            <Select
                                                multi
                                                style={{
                                                    backgroundColor: 'white',
                                                    width: '85%',
                                                    padding: '8px 32px',
                                                    border: 'none',
                                                    color: ' #0d0d0d',
                                                    textAlign: 'center',
                                                    textDecoration: 'none',
                                                    display: 'inline-flex',
                                                    margin: '5px',
                                                    transition: 'all 0.5s ease-in-out',
                                                    borderRadius: ' 5px 5px 5px 5px',
                                                    height: 'fit-content',
                                                }}
                                                options={this.state.options}
                                                values={this.state.categories}
                                                onChange={(newCategories) => {
                                                    this.setState({ categories: newCategories });
                                                }}
                                                itemRenderer={this.customItemRenderer.bind(this)}
                                                // optionRenderer={this.customOptionRenderer.bind(this)}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center row-fluid">
                                        <Col md={2} xl={1} className="justify-content-center">
                                            <Form.Label className="my-3 col-md-offset-5"> Address </Form.Label>
                                        </Col>
                                        <Col md={12} xl={8} className="col-md-offset-5">
                                            <Form.Control
                                                value={this.state.address}
                                                placeholder="Enter the address"
                                                type="text"
                                                name="address"
                                                onChange={(e) => this.setState({ address: e.target.value })}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center mt-0">
                                        <Col md={2} xl={1} className="justify-content-center">
                                            <Form.Label className="my-3 col-md-offset-5"> From* </Form.Label>
                                        </Col>
                                        <Col md={12} xl={8} className="col-md-offset-5">
                                            <Datetime
                                                value={this.state.timeSlotFrom}
                                                input={true}
                                                renderInput={this.renderInput}
                                                onChange={(m) => {
                                                    if (typeof m === 'string' || m instanceof String)
                                                        console.error('roba');
                                                    else this.setState({ timeSlotFrom: m.toDate() });
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={2} xl={1} className="justify-content-center">
                                            <Form.Label className="my-3 col-md-offset-5"> To* </Form.Label>
                                        </Col>
                                        <Col md={12} xl={8} className="col-md-offset-5">
                                            <Datetime
                                                value={this.state.timeSlotTo}
                                                input={true}
                                                renderInput={this.renderInput}
                                                onChange={(m) => {
                                                    if (typeof m === 'string' || m instanceof String)
                                                        console.error('roba');
                                                    else this.setState({ timeSlotTo: m.toDate() });
                                                }}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center mt-3">
                                        <Col md={2} xl={1} className="justify-content-center">
                                            <Form.Label className="my-3 col-md-offset-5"> Description </Form.Label>
                                        </Col>
                                        <Col md={12} xl={8} className="col-md-offset-5">
                                            <Form.Control
                                                as="textarea"
                                                rows={4}
                                                value={this.state.description}
                                                placeholder="Enter the description"
                                                type="text"
                                                name="Description"
                                                onChange={(e) => this.setState({ description: e.target.value })}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col md={12} xl={8} className="justify-content-center">
                                            <ImageUploader
                                                withIcon={true}
                                                buttonText="Choose images"
                                                onChange={this.onDrop.bind(this)}
                                                imgExtension={['.jpg', '.gif', '.png', '.gif', '.jpeg']}
                                                maxFileSize={this.imageMaxSize}
                                                withPreview={true}
                                            />
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center my-3">
                                        <ButtonRounded
                                            buttonLabel={'Submit'}
                                            onClickCallBack={this.handleSubmit.bind(this)}
                                        />
                                    </Row>
                                </Container>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private renderInput(props: any) {
        return (
            <div>
                <input {...props} />
            </div>
        );
    }

    private checkSubmission(): boolean {
        /* Check title not empty */
        if (this.state.title === '') {
            console.error('Error empty title');
            toast.error('You must insert a valid title!', this.toastSettings);
            return false;
        }
        /* Check Date validity */
        if (!this.checkDateValidity(this.state.timeSlotFrom, this.state.timeSlotTo)) {
            console.error('Error date validity');
            toast.error('You must insert valid dates!', this.toastSettings);
            return false;
        }
        /* Check validity of price quantity... By the way this should not be a problem cause it's already handled */
        if (this.state.price <= 0 || this.state.quantity < 1) {
            console.error('Error price or quantity lowe than min value');
            toast.error('You cheecky hacker! Price or value are under min value!', this.toastSettings);
            return false;
        }
        return true;
    }

    private async handleSubmit() {
        async function loadAllImgs(files: File[]): Promise<string[]> {
            const b64: string[] = [];
            for (const file of files) {
                b64.push(await loadFileBase64(file));
            }
            return b64;
        }
        try {
            if (!this.checkSubmission()) {
                return;
            }
            const newProdServ = {
                title: this.state.title,
                price: this.state.price,
                categories: this.state.categories.map((option) => option.value),
                quantity: this.state.quantity,
                start: Math.floor(this.state.timeSlotFrom.getTime()),
                end: Math.floor(this.state.timeSlotTo.getTime()),
                description: this.state.description,
                images: await loadAllImgs(this.state.pictures),
            };
            await Fetcher.post('/products/insert', newProdServ);
            toast.success('New Service/Product Submitted', this.toastSettings);
        } catch (e) {
            console.log(e);
        }
    }

    private onDrop(pictureFiles: File[]) {
        this.setState({
            pictures: pictureFiles,
        });
    }

    private async retrieveProfileAddress(): Promise<string | null> {
        try {
            return (await Fetcher.get<{ user: IUser }>('/profile/info')).user.address;
        } catch (e) {
            console.error('Error Cannot retrieve  user information. User not logged.');
            return null;
        }
    }

    /**
     * Return true if valid, false otherwise
     */
    private checkDateValidity(dateFrom: Date, dateTo: Date) {
        const d = new Date();
        d.setHours(d.getHours() - 2);
        return dateFrom < dateTo && dateFrom >= d;
    }

    public customItemRenderer(selectItemRenderer: SelectItemRenderer<ICategory>): JSX.Element {
        return (
            <div onClick={() => selectItemRenderer.methods.addItem(selectItemRenderer.item)}>
                {selectItemRenderer.item.label}
            </div>
        );
    }

    private async retrieveCategories(): Promise<ICategory[]> {
        try {
            return (await Fetcher.get<{ data: IBackCategory[] }>('/products/categories')).data.map(
                (c: IBackCategory) => {
                    return { label: c.name, value: c.id } as ICategory;
                },
            );
        } catch (e) {
            console.error(e);
            return [];
        }
    }
}
