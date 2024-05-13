import { BizBud } from "app/Biz";
import { DivStore, ValDiv, ValDivBase } from "../../store";
import { ViewSpecNoAtom } from "app/hooks";
import { theme } from "tonwa-com";

export interface ViewDivProps {
    divStore: DivStore;
    valDiv: ValDivBase;
    readonly?: boolean;
    hidePivot?: boolean;
    className?: string;
    buttons?: any;
}

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
    return <div className="d-flex align-items-center text-end text-nowrap" onClick={onClick}>
        <div className={theme.labelColor + ' me-2 '}>{caption ?? name}</div>
        <div className={(className ?? '') + ' w-min-3c '}>{bud.getUIValue(val)}</div>
    </div>
}

export function ViewDivRight({ children }: { children: React.ReactNode; }) {
    return <div className="d-flex flex-column justify-content-end align-items-end px-2 py-2 px-lg-3 border-start text-end w-max-10c w-min-10c">
        {children}
    </div>;
}