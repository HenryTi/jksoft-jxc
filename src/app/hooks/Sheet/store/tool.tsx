import { BinRow, BizBud, EntityPend, predefinedPendFields } from "app/Biz";
import { ViewBud } from "app/hooks/Bud";
import { FA } from "tonwa-com";

export function VNamedBud({ name, value, bud }: { name: string; value: any; bud: BizBud; }) {
    let caption: string;
    if (bud === undefined) caption = name;
    else {
        const { name: bn, ui } = bud;
        caption = ui?.caption ?? bn;
    }
    return <ViewBud bud={bud} value={value} />;
}

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
