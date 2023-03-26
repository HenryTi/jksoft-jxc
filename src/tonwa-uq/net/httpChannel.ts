import { Caller } from './caller';
import { Net } from './Net';

const methodsWithBody = ['POST', 'PUT'];

export class HttpChannel {
    language: string;       // 可能以后会处理 http 的language and culture
    culture: string;

    private timeout: number;
    protected net: Net;
    protected hostUrl: string;
    protected authToken: string;

    constructor(net: Net, hostUrl: string, authToken: string) {
        this.net = net;
        this.hostUrl = hostUrl;
        this.authToken = authToken;
        this.timeout = net.fetchTimeout;
    }

    used() {
        this.post('', {});
    }

    async xcall(urlPrefix: string, caller: Caller<any>): Promise<void> {
        let options = this.buildOptions(undefined);
        let { headers, path, method } = caller;
        if (headers !== undefined) {
            let h = options.headers;
            for (let i in headers) {
                h[i] = encodeURI(headers[i]);
            }
        }
        options.method = method;
        let p = caller.buildParams();
        if (methodsWithBody.indexOf(method) >= 0 && p !== undefined) {
            options.body = JSON.stringify(p)
        }
        return await this.innerFetch(urlPrefix + path, options);
    }

    private async innerFetchResult(url: string, options: any): Promise<any> {
        let ret = await this.innerFetch(url, options);
        return ret.res;
    }

    async get(url: string, params: any = undefined, headers: any = undefined): Promise<any> {
        if (params) {
            let keys = Object.keys(params);
            if (keys.length > 0) {
                let c = '?';
                for (let k of keys) {
                    let v = params[k];
                    if (v === undefined) continue;
                    url += c + k + '=' + params[k];
                    c = '&';
                }
            }
        }
        let options = this.buildOptions(headers);
        options.method = 'GET';
        return await this.innerFetchResult(url, options);
    }

    async post(url: string, params: any, headers: any = undefined): Promise<any> {
        let options = this.buildOptions(headers);
        options.method = 'POST';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options);
    }

    async put(url: string, params: any, headers: any = undefined): Promise<any> {
        let options = this.buildOptions(headers);
        options.method = 'PUT';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options);
    }

    async delete(url: string, params: any, headers: any = undefined): Promise<any> {
        let options = this.buildOptions(headers);
        options.method = 'DELETE';
        options.body = JSON.stringify(params);
        return await this.innerFetchResult(url, options);
    }
    async fetch(url: string, options: any, resolve: (value?: any) => any, reject: (reason?: any) => void): Promise<void> {
        let path = url;
        try {
            console.log('%s-%s %s', options.method, path, options.body || '');
            let now = Date.now();
            let timeOutHandler = setTimeout(
                () => {
                    throw new Error(`webapi timeout: ${(Date.now() - now)}ms ${url}`);
                },
                this.timeout);
            let res = await fetch(encodeURI(path), options);
            if (res.ok === false) {
                clearTimeout(timeOutHandler);
                console.log('call error %s', res.statusText);
                throw res.statusText;
            }
            let ct = res.headers.get('content-type');
            if (ct && ct.indexOf('json') >= 0) {
                return res.json().then(async retJson => {
                    clearTimeout(timeOutHandler);
                    if (retJson.ok === true) {
                        if (typeof retJson !== 'object') {
                            debugger;
                        }
                        else if (Array.isArray(retJson) === true) {
                            debugger;
                        }
                        return resolve(retJson);
                    }
                    let retError = retJson.error;
                    if (retError === undefined) {
                        reject('not valid tonwa json');
                    }
                    else {
                        reject(retError);
                    }
                }).catch(async error => {
                    reject(error);
                });
            }
            else {
                let text = await res.text();
                clearTimeout(timeOutHandler);
                console.log('text endWait');
                resolve(text);
            }
        }
        catch (error) {
            if (typeof error === 'string') {
                let err = error.toLowerCase();
                if (err.startsWith('unauthorized') === true || err.startsWith('$roles') === true) {
                    return;
                }
            }
            console.error('fecth error (no nav.showError): ' + url);
        };
    }

    //protected abstract innerFetch(url: string, options: any): Promise<any>;
    protected async innerFetch(url: string, options: any): Promise<any> {
        let u = this.hostUrl + url;
        return new Promise<any>(async (resolve, reject) => {
            await this.fetch(u, options, resolve, reject);
        });
    }

    async callFetch(url: string, method: string, body: any): Promise<any> {
        let options = this.buildOptions(undefined);
        options.method = method;
        options.body = body;
        return new Promise<any>(async (resolve, reject) => {
            await this.fetch(url, options, resolve, reject);
        });
    }

    private buildOptions(headers: { [name: string]: string }): { method: string; headers: { [name: string]: string }; body: any } {
        let newHeaders = this.buildHeaders(headers);
        let options = {
            headers: newHeaders,
            method: undefined as any,
            body: undefined as any,
            // cache: 'no-cache',
        };
        return options;
    }

    protected buildHeaders(paramHeaders: { [name: string]: string }): { [name: string]: string } {
        let { language, culture } = this;
        let headers: { [name: string]: string } = {};
        headers['Content-Type'] = 'application/json;charset=UTF-8';
        let lang = language ?? '';
        if (culture) lang += '-' + culture;
        headers['Accept-Language'] = lang;
        if (this.authToken) {
            headers['Authorization'] = this.authToken;
        }
        if (paramHeaders !== undefined) {
            Object.assign(headers, paramHeaders);
        }
        return headers;
    }
}
