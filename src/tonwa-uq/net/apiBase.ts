import { HttpChannel } from './httpChannel';
import { Caller } from './caller';
import { Net } from './Net';

export async function refetchApi(channel: HttpChannel, url: string, options: any,
    resolve: (values: any) => any, reject: (reason: any) => void) {
    await channel.fetch(url, options, resolve, reject);
}

export abstract class ApiBase {
    protected readonly net: Net;
    protected path: string;

    constructor(net: Net, path: string) {
        this.net = net;
        this.path = path || '';
    }

    protected abstract getHttpChannel(): Promise<HttpChannel>;

    protected customHeader(): { [key: string]: string } {
        return undefined;
    }

    async xcall(caller: Caller<any>): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.xcall(this.path, caller);
    }

    public async call(url: string, method: string, body: any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.callFetch(url, method, body);
    }

    public async get(path: string, params: any = undefined): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.get(this.path + path, params, this.customHeader());
    }

    public async post(path: string, params: any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.post(this.path + path, params, this.customHeader());
    }

    public async put(path: string, params: any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.put(this.path + path, params, this.customHeader());
    }

    public async delete(path: string, params: any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.delete(this.path + path, params, this.customHeader());
    }
}
