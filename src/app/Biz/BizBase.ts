import { UqExt } from "uqs/UqDefault";
import { Biz } from "./Biz";

export class BizBase {
    readonly biz: Biz;
    readonly uq: UqExt;
    readonly name: string;
    readonly type: string;
    caption: string;

    constructor(biz: Biz, name: string, type: string) {
        this.biz = biz;
        this.uq = biz.uq;
        this.name = name;
        this.type = type;
    }

    get phrase() {
        return `${this.type}.${this.name}`;
    }

    fromSchema(schema: any) {
        for (let i in schema) {
            this.fromSwitch(i, schema[i]);
        }
    }

    protected fromSwitch(i: string, val: any) {
        switch (i) {
            default:
                debugger;
                throw Error(`unknown ${i}`);
            case 'name': break;
            case 'type': break;
            case 'dataType': break;
            case 'history': break;
            case 'caption':
                this.caption = val;
                break;
        }
    }
}

