import { Biz, EnumBudType } from "tonwa";
import { BudValue } from "tonwa-app";
import { ReturnGetAtomProps } from "uqs/UqDefault";

export function readBuds(biz: Biz, id: number, props: ReturnGetAtomProps[]) {
    let main: any;
    let buds: { [bud: number]: BudValue; } = {};
    let prop = props[0];
    if (prop !== undefined) {
        const { phrase, value: [no, ex] } = prop;
        main = { id, phrase, no, ex }
    }
    let len = props.length;
    for (let i = 1; i < len; i++) {
        let { phrase, value } = props[i];
        let bud = biz.budFromId(phrase);
        if (bud === undefined) {
            // debugger; 已经不再使用
        }
        else {
            const { budDataType } = bud;
            if (budDataType.type === EnumBudType.check) {
                buds[phrase] = value;
            }
            else {
                switch (value.length) {
                    case 0: debugger; break;
                    case 1: buds[phrase] = value[0]; break;
                    default: buds[phrase] = value; break;
                }
            }
        }
    }
    return { main, buds };
}
