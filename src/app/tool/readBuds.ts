import { ReturnGetAtomBudsCheck, ReturnGetAtomBudsDec, ReturnGetAtomBudsInt, ReturnGetAtomBudsStr, ReturnGetAtomUoms } from "uqs/UqDefault";
import { BudValue } from "../hooks/model";

interface ParamBuds {
    budsInt: ReturnGetAtomBudsInt[];
    budsDec: ReturnGetAtomBudsDec[];
    budsStr: ReturnGetAtomBudsStr[];
    budsCheck: ReturnGetAtomBudsCheck[];
}

export function readBuds({ budsInt, budsDec, budsStr, budsCheck }: ParamBuds) {
    let buds: { [prop: string]: { bud: number; phrase: string; value: BudValue; } } = {};
    for (let bud of budsInt) {
        buds[bud.phrase] = bud;
    }
    for (let bud of budsDec) {
        buds[bud.phrase] = bud;
    }
    for (let bud of budsStr) {
        buds[bud.phrase] = bud;
    }
    for (let budCheck of budsCheck) {
        const { bud, phrase, item } = budCheck;
        let prop = buds[phrase];
        let check: { [item: string]: boolean; };
        if (prop === undefined) {
            check = {};
            prop = buds[phrase] = { bud, phrase, value: check };
        }
        else {
            check = prop.value as { [item: string]: boolean; };
        }
        check[item] = true;
    }
    return buds;
}

export interface AtomUomProps {
    atomUom: number;
    uom: number;
    ex: string;
    prevEx?: string;
    ratio?: number;
}
export function readUoms(uomsArr: ReturnGetAtomUoms[]) {
    const ret: AtomUomProps[] = uomsArr;
    return ret;
}
