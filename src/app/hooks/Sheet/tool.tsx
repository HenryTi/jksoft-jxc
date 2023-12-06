import { BizBud, Entity, EntityPend, predefinedPendFields } from "app/Biz";
import { ViewBud } from "app/hooks/Bud";
import { PendRow, SheetStore } from "./SheetStore";
import { NamedResults } from "./NamedResults";
import { BinStore } from "./BinEditing";

export interface Prop<T = any> {
    name: string;
    bud: BizBud;
    value: T;
}
export interface Picked { [name: string]: Prop | any }

export function pickedFromJsonArr(entity: Entity, propArr: Prop[], picked: Picked, arr: any[]) {
    const { biz } = entity;
    for (let v of arr) {
        let { length } = v;
        let v0 = v[0];
        let v1 = v[1];
        let name: string, bud: BizBud, value: any;
        switch (length) {
            default: debugger; continue;
            case 2:
                if (typeof (v0) === 'string') {
                    switch (v0) {
                        case 'no': picked.no = v1; continue;
                        case 'ex': picked.ex = v1; continue;
                    }
                    name = v0;
                    value = v1
                }
                else {
                    bud = entity.budColl[v0];
                    name = bud.name;
                    value = v1;
                }
                break;
            case 3:
                let bizEntity = biz.entityFromId(v0);
                bud = bizEntity.budColl[v1];
                name = bud.name;
                value = v[2];
                break;
        }
        let prop: Prop = { name, bud, value };
        picked[name] = prop;
        propArr.push(prop);
    }
}

export function arrFromJsonArr(entity: Entity, arr: any[]) {
    let propArr: Prop[] = [];
    const { biz } = entity;
    for (let v of arr) {
        let { length } = v;
        let v0 = v[0];
        let v1 = v[1];
        let name: string, bud: BizBud, value: any;
        switch (length) {
            default: debugger; continue;
            case 2:
                if (typeof (v0) === 'string') {
                    switch (v0) {
                        case 'no': continue;
                        case 'ex': continue;
                    }
                    name = v0;
                    value = v1
                }
                else {
                    bud = entity.budColl[v0];
                    name = bud.name;
                    value = v1;
                }
                break;
            case 3:
                let bizEntity = biz.entityFromId(v0);
                bud = bizEntity.budColl[v1];
                name = bud.name;
                value = v[2];
                break;
        }
        let prop: Prop = { name, bud, value };
        propArr.push(prop);
    }
    return propArr;
}

// table pend
export function arrFromJsonMid(entity: Entity, mid: any) {
    let ret: Prop[] = [];
    const { budColl } = entity;
    for (let i in mid) {
        let bud = budColl[i];
        if (bud === undefined) continue;
        let value = mid[i];
        if (value === null) continue;
        ret.push({ name: bud.name, bud, value });
    }
    return ret;
}

export function VNamedBud({ name, value, bud }: { name: string; value: any; bud: BizBud; }) {
    let caption: string;
    if (bud === undefined) caption = name;
    else {
        const { name: bn, ui: { caption: bc } } = bud;
        caption = bc ?? bn;
    }
    // if (value !== null && typeof value === 'object') value = value.id;
    return <div className="my-2 me-3 w-min-16c d-flex align-items-center">
        <small className="text-secondary me-1">{caption}:</small>
        <span><ViewBud bud={bud} value={value} /></span>
    </div>;
}

export interface PendBandEditProps {
    //sheetStore: SheetStore;
    binStore: BinStore;
    namedResults: NamedResults;
    pendRow: PendRow;
}

const sheetFields = ['si', 'sx', 'svalue', 'sprice', 'samount'];
export class PendProxyHander implements ProxyHandler<any> {
    private readonly entityPend: EntityPend;
    constructor(entityPend: EntityPend) {
        this.entityPend = entityPend;
    }
    get(target: any, p: string | symbol, receiver: any) {
        if (sheetFields.findIndex(v => v === p) >= 0) {
            let k = p.toString().substring(1);
            let ret = target.sheet[k];
            return ret
        }
        let { detail } = target;
        if (detail !== undefined) target = detail;
        if (predefinedPendFields.findIndex(v => v === p) >= 0) {
            return target[p];
        }
        let bud = this.entityPend.budColl[p as string];
        if (bud === undefined) return;
        let ret = target.mid[bud.id];
        return ret;
    }
}
