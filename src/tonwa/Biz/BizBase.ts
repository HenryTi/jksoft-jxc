import { Biz } from "./Biz";
import { BizPhraseType, UIStyle } from "./Defines";

export class BizBase {
    protected scaned: boolean;
    readonly biz: Biz;
    // readonly uq: UqExt;
    readonly type: string;
    private _name: string;
    id: number;
    phrase: string;
    ui: Partial<UIStyle>;
    bizPhraseType: BizPhraseType;
    get name(): string { return this._name; }
    get caption(): string { return this.ui?.caption ?? this._name; }

    constructor(biz: Biz, id: number, name: string, type: string) {
        this.biz = biz;
        // this.uq = biz.uq;
        this.id = id;
        this._name = name;
        this.type = type;
        this.bizPhraseType = BizPhraseType[type as keyof typeof BizPhraseType];
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
            case 'bin': break;
            case 'sysBuds': break;
            case 'showBuds': break;
            case 'phrase': this.phrase = val; break;
            case 'caption':
                this.ui = { caption: val };
                break;
            case 'ui':
                this.ui = val;
                break;
        }
    }
}
