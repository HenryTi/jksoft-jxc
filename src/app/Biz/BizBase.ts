import { BizPhraseType, UqExt } from "uqs/UqDefault";
import { Biz } from "./Biz";
import { EntityAtomID } from "./EntityAtom";
import { UIStyle } from "app/ui";
import { BizBud } from "./BizBud";
import { Entity } from "./Entity";

export class BizBase {
    readonly biz: Biz;
    readonly uq: UqExt;
    readonly type: string;
    private _name: string;
    id: number;
    phrase: string;
    ui: Partial<UIStyle>;
    bizPhraseType: BizPhraseType;
    get name(): string { return this._name; }
    get caption(): string { return this.ui?.caption; }

    constructor(biz: Biz, id: number, name: string, type: string) {
        this.biz = biz;
        this.uq = biz.uq;
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
            case 'phrase': this.phrase = val; break;
            case 'caption':
                this.ui = { caption: val };
                break;
            case 'ui':
                this.ui = val;
                break;
        }
    }

    protected fromProp(entity: Entity, prop: any) {
        if (prop === undefined) debugger;
        let { id, name, dataType } = prop;
        let bizBud = new BizBud(this.biz, id, name, dataType, entity);
        let { budDataType } = bizBud;
        if (budDataType === undefined) {
            debugger;
            return;
        }
        budDataType.fromSchema(prop);
        bizBud.fromSchema(prop);
        return bizBud;
    }

    protected fromProps(entity: Entity, props: any[]) {
        let buds: BizBud[] = [];
        for (let prop of props) {
            let bizBud = this.fromProp(entity, prop);
            if (bizBud === undefined) continue;
            buds.push(bizBud);
        }
        return buds;
    }
}

export interface IxField {
    caption: string;
    atoms: EntityAtomID[];
}
