import { BudCheckValue, BudValue } from "tonwa-app";
import { ReturnGetAtomProps } from "uqs/UqDefault";

export function readBuds(id: number, props: ReturnGetAtomProps[]) {
    let main: any;
    let buds: { [bud: number]: BudValue; } = {};
    let prop = props[0];
    if (prop !== undefined) {
        const { phrase, value: [no, ex] } = prop;
        main = { id, phrase, no, ex }
    }
    let len = props.length;
    let checks: { [bud: number]: BudCheckValue } = {}
    for (let i = 1; i < len; i++) {
        let { phrase, value } = props[i];
        switch (value.length) {
            default:
            case 0: debugger; break;
            case 1: buds[phrase] = value[0]; break;
            case 2:
                let check = checks[phrase];
                if (check === undefined) {
                    checks[phrase] = check = [];
                }
                check.push(value[1]);
                break;
        }
    }
    for (let i in checks) {
        buds[i] = checks[i];
    }
    return { main, buds };
}

export interface AtomUomProps {
    atomUom: number;
    uom: number;
    ex: string;
    prevEx?: string;
    ratio?: number;
}
