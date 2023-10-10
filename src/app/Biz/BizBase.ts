import { BizPhraseType, UqExt } from "uqs/UqDefault";
import { Biz } from "./Biz";

export class BizBase {
    readonly biz: Biz;
    readonly uq: UqExt;
    readonly type: string;
    private _name: string;
    id: number;
    phrase: string;
    caption: string;
    bizPhraseType: BizPhraseType;
    get name(): string { return this._name; }

    constructor(biz: Biz, id: number, name: string, type: string) {
        this.biz = biz;
        this.uq = biz.uq;
        this.id = id;
        this._name = name;
        this.type = type;
    }

    setName(name: string) {
        this._name = name;
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
            case 'id': break;
            case 'name': break;
            case 'jName': break;
            case 'type': break;
            case 'dataType': break;
            case 'history': break;
            case 'phrase': this.phrase = val; break;
            case 'caption':
                this.caption = val;
                break;
        }
    }
}

