import { ResponsePresenter } from '../utils/responsePresenter';

import { ENV } from '../env';

export interface IFetcherOptions {
    displayPopUpErrorMsg?: boolean; // default: true
}

export default class Fetcher {
    private static readonly _defaultOptions = {
        displayPopUpErrorMsg: true,
    } as IFetcherOptions;

    private static async _fetch<T>(
        url: string,
        method: 'get' | 'post',
        data: any,
        fetcherOptions?: IFetcherOptions,
    ): Promise<T> {
        const options = this._createFetcherOptions(fetcherOptions);
        if (method === 'get' && data) {
            const query: Array<string> = [];
            Object.keys(data).forEach((key) => {
                query.push(key + '=' + data[key]);
            });
            url += '?' + query.join('&');
        }
        let res, body;

        try {
            res = await fetch(encodeURI(ENV.SERVER_URL + url), {
                method: method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: method === 'post' ? JSON.stringify(data) : undefined,
            });
            body = await res.json();
        } catch (e) {
            if (options.displayPopUpErrorMsg) {
                ResponsePresenter.error('Network issues! Check the connection');
            }
            console.error('Network issues! Check the connection');
            throw e;
        }
        if (!res.ok) {
            const errorMsg = Fetcher._createErrorMessage(body);
            if (options.displayPopUpErrorMsg) {
                ResponsePresenter.error(errorMsg);
            }
            throw new Error(errorMsg);
        } else {
            return body;
        }
    }

    private static _createErrorMessage(body: any): string {
        let errorMsg;
        try {
            errorMsg = body.error.message;
        } catch (e) {
            console.error(e);
            errorMsg = `Error: ${body.statusText || body.status}`;
        }
        return errorMsg;
    }

    public static async get<T>(endpoint: string, query?: any, fetcherOptions?: IFetcherOptions): Promise<T> {
        return await Fetcher._fetch<T>(endpoint, 'get', query, fetcherOptions);
    }

    public static async post<T>(endpoint: string, body?: any, fetcherOptions?: IFetcherOptions): Promise<T> {
        return await Fetcher._fetch<T>(endpoint, 'post', body, fetcherOptions);
    }

    private static _createFetcherOptions(opt?: IFetcherOptions) {
        if (!opt) return this._defaultOptions;
        return {
            displayPopUpErrorMsg: opt.displayPopUpErrorMsg !== undefined ? opt.displayPopUpErrorMsg : true,
        };
    }
}
