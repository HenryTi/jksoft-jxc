import { consts } from "./consts";

export class MiApi {
    private readonly authToken: string;
    constructor(authToken: string) {
        this.authToken = authToken;
    }

    private buildOptions(): any {
        //let { language, culture } = this;
        let headers: { [name: string]: string } = {};
        headers['Content-Type'] = 'application/json;charset=UTF-8';
        // let lang = language ?? '';
        //if (culture) lang += '-' + culture;
        // headers['Accept-Language'] = lang;
        if (this.authToken) {
            headers['Authorization'] = this.authToken;
        }
        // return headers;
        // let { language, culture } = nav;
        //let headers = new Headers();
        headers['Access-Control-Allow-Origin'] = '*';
        let options = {
            headers,
            // cache: 'no-cache',
        };
        return options;
    }

    private async post(url: string, body: any) {
        let options = this.buildOptions();
        options.method = 'POST';
        options.body = JSON.stringify(body);
        url = consts.miApiHost + 'miscan/' + url;
        try {
            let resp = await fetch(encodeURI(url), options);
            let json = await resp.json();
            if (json.ok !== true) throw Error(json.error);
            return json.res;
        }
        catch (err) {
            console.error(err);
            debugger;
        }
    }

    async call(name: string, params: any[]): Promise<any> {
        let pbody = { call: name, params };
        return await this.post('sql/call', pbody);
    }

    async query(name: string, params: any[]): Promise<any> {
        let pbody = { call: name, params };
        return await this.post('sql/call', pbody);
    }

    async page(name: string, params: any[], pageStart: number, pageSize: number): Promise<any> {
        let p: any[];
        switch (typeof params) {
            case 'undefined': p = []; break;
            default: p = Object.assign({}, params); break;
        }
        p.push(pageStart);
        p.push(pageSize);
        let pbody = { call: name, params: p };
        return await this.post('sql/call', pbody);
    }

    async process(proc: any, params: any[]): Promise<any> {
        let pbody = { proc, params };
        return await this.post('sql/query', pbody);
    }
}
