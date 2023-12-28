import { BinRow, BizBud, Entity, EntityPend, predefinedPendFields } from "app/Biz";
import { ViewBud } from "app/hooks/Bud";
import { FA } from "tonwa-com";

export interface Prop<T = any> {
    name: string;
    bud: BizBud;
    value: T;
}
export interface Picked { [name: string]: Prop | any; }

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
    return <ViewBud bud={bud} value={value} />;
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

export interface ValRow extends BinRow {
    origin?: number;     // origin可能指向源单id，也指向本单parent。
    pend: number;
    pendValue?: number;
}

export const btnNext = <>下一步 <FA name="arrow-right" className="ms-2" /></>;
export const cnNextClassName: string = "btn btn-primary";
export const cnRolCols = ' row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 ';

interface LabelBoxProps {
    label: string | JSX.Element; children: React.ReactNode; required?: boolean;
    title?: string;
    colon?: boolean;
}

export function LabelBox({ label, children, required, title, colon }: LabelBoxProps) {
    if (required === true) {
        label = <>
            {label}
            <span className="text-danger ms-1">*</span>
        </>;
        // <FA name="star-o" className="small text-danger me-1" />;
    }
    let vColon: any;
    if (colon === true) vColon = ':';
    return <div className="col">
        <div className="row">
            <div className={'col-4 px-0 text-secondary text-end d-flex align-items-center flex-row justify-content-end small'} title={title}>
                {label} {vColon}
            </div>
            <div className="col-8 ps-2 py-1">
                {children}
            </div>
        </div>
    </div>;
}

export function LabelContent({ label, children, required, title, colon }: LabelBoxProps) {
    if (required === true) {
        label = <>
            {label}
            <span className="text-danger ms-1">*</span>
        </>;
        // <FA name="star-o" className="small text-danger me-1" />;
    }
    let vColon: any;
    if (colon === true) vColon = ':';
    return <div className="col">
        <div className="row">
            <div className={'col-4 px-0 text-secondary text-end d-flex align-items-center flex-row justify-content-end small'} title={title}>
                {label} {vColon}
            </div>
            <div className="col-8 ps-2 py-1">
                <div className="d-flex align-items-center border-bottom border-secondary-subtle tonwa-bg-gray-1 pt-1 pb-2 px-2">
                    {children}
                </div>
            </div>
        </div>
    </div>;
}
