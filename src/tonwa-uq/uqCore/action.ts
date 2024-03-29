import { Entity } from './entity';
import { ActionCaller } from './caller';

export class UqAction<P, R> extends Entity {
    get typeName(): string { return 'action'; }
    async submit(data: P, $$user: number = undefined, waiting: boolean = true) {
        let caller = new ActionSubmitCaller(this, data, $$user, waiting);
        let ret = await caller.request();
        return ret;
    }
    async submitReturns(data: P, $$user: number = undefined): Promise<R> {
        return await new SubmitReturnsCaller(this, data, $$user).request();
    }
    async submitConvert(data: P, $$user: number = undefined) {
        return await new SubmitConvertCaller(this, data, $$user).request();
    }
}

export class Action extends UqAction<any, any> {
}

export class ActionSubmitCaller extends ActionCaller {
    get path(): string { return 'action/' + this.entity.name; }
    buildParams(): any {
        let data = this._entity.schema.jsoned === true ?
            this.entity.packJson(this.params) : this.entity.pack(this.params);
        return {
            $$user: this.$$user,
            data
        };
    }
}

class SubmitReturnsCaller extends ActionSubmitCaller {
    get path(): string { return 'action/' + this.entity.name + '/returns'; }
    xresult(res: any): any {
        let { returns } = this.entity;
        let len = returns.length;
        let ret: { [r: string]: any[] } = {};
        for (let i = 0; i < len; i++) {
            let retSchema = returns[i];
            ret[retSchema.name] = res[i];
        }
        return ret;
    }
}

class SubmitConvertCaller extends ActionSubmitCaller {
    get path(): string { return 'action-convert/' + this.entity.name; }
    buildParams(): any {
        return {
            $$user: this.$$user,
            data: this.params
        };
    }
}
