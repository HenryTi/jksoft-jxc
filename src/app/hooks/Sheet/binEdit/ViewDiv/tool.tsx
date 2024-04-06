import { BizBud } from "app/Biz";
import { DivStore, ValDiv } from "../../store";
import { ViewSpecNoAtom } from "app/hooks";
import { theme } from "tonwa-com";

export interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDiv;
    // editable: boolean;
    className?: string;
    buttons?: any;
}

export const cnBtn = 'w-min-8c w-max-8c d-flex justify-content-end align-items-end';
export let cn: string = theme.bootstrapContainer + ' gx-0 ';

export function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
    if (bud === undefined) return null;
    return <ViewSpecNoAtom id={value} noLabel={true} />;
}

export function PAV({ bud, className, val, onClick }: { bud: BizBud; className?: string; val: number; onClick?: () => void }) {
    if (bud === undefined) return null;
    let { caption, name } = bud;
    if (Number.isNaN(val) === true) {
        debugger;
        val = 0;
    }
    return <div className="d-flex ms-3 align-items-center text-end text-nowrap" onClick={onClick}>
        <div className={theme.labelColor + ' me-2 '}>{caption ?? name}</div>
        <div className={(className ?? '') + ' w-min-2c '}>{val}</div>
    </div>
}
