/* eslint-disable camelcase */
export interface IUser {
    name: string;
    surname: string;
    address: string;
    email: string;
    birthdate: string;
    picture: string;
    confirmed: string;
    uuid: string;
    balance: number;
    fiscalCode: string;
}

export interface ICategory {
    id: number;
    name: string;
}

export interface IProducts {
    id: number;
    title: string;
    description: string;
    uid_seller_name: string;
    seller_name: string;
    seller_surname: string;
    picture: string;
    price: number;
    quantity: number;
    start: number;
    end: number;
    address: string;
    categories: string; // comma separated string
}
