import { BinRow, BizBud, EntityPend, predefinedPendFields } from "app/Biz";
import { FA } from "tonwa-com";

const sheetFields = ['si', 'sx', 'svalue', 'sprice', 'samount'];
export class PendProxyHandler implements ProxyHandler<any> {
    private readonly entityPend: EntityPend;
    constructor(entityPend: EntityPend) {
        this.entityPend = entityPend;
    }
    get(target: any, p: string | symbol, receiver: any) {
        switch (p) {
            case 'bin':
            case 'sheet':
                return target[p];
        }
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

// 特别处理 BudFork
export function getValRowPropArr(valRow: ValRow, buds: BizBud[]) {
    const { buds: budsValues } = valRow;
    let propArr: [number, string | number, number][] = [];
    for (let bud of buds) {
        let { id, budDataType } = bud;
        let value = (budsValues as any)[id];
        if (value === undefined) continue;
        if (value === null) continue;
        if (typeof value === 'object') {
            value = JSON.stringify(value);
        }
        propArr.push([id, value, budDataType.type]);
    }
    return propArr;
}

export const btnNext = <>下一步 <FA name="arrow-right" className="ms-2" /></>;
export const cnNextClassName: string = "btn btn-primary";

export function mergeValRow(dest: ValRow, src: ValRow) {
    if (src === undefined) return;
    const { id, i, x, value, price, amount, buds, owned, pend, pendValue, origin } = src;
    dest.id = id;
    dest.i = i;
    dest.x = x;
    dest.value = value;
    dest.price = price;
    dest.amount = amount;
    if (buds !== undefined) Object.assign(dest.buds, buds);
    if (owned !== undefined) Object.assign(dest.owned, owned);
    dest.pend = pend;
    dest.pendValue = pendValue;
    dest.origin = origin;
}
