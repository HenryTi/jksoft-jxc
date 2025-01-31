import { BizBud } from "tonwa";
import { BinStore, ValDivBase } from "../../../../Store";
import { ViewForkNoAtom } from "app/hooks";
import { FA, theme } from "tonwa-com";
import { useAtomValue } from "jotai";

export interface ViewDivProps {
    binStore: BinStore;
    valDiv: ValDivBase;
    readonly?: boolean;
    hidePivot?: boolean;
    className?: string;
    buttons?: any;
    index?: number;
}

export let cn: string = theme.bootstrapContainer + ' gx-0 ';

export function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
    if (bud === undefined) return null;
    return <ViewForkNoAtom id={value} noLabel={true} />;
}

export function PAV({ bud, className, val, onClick }: { bud: BizBud; className?: string; val: number; onClick?: () => void }) {
    if (bud === undefined) return null;
    let { caption } = bud;
    if (Number.isNaN(val) === true) {
        debugger;
        val = 0;
    }
    return <div className="d-flex align-items-center text-end text-nowrap" onClick={onClick}>
        <div className={theme.labelColor + ' me-2 '}>{caption}</div>
        <div className={(className ?? '') + ' w-min-3c '}>{bud.getUIValue(val)}</div>
    </div>
}

export function ViewDivRight({ children }: { children: React.ReactNode; }) {
    return <div className="d-flex flex-column justify-content-end align-items-end px-2 py-2 px-lg-3 border-start text-end w-max-10c w-min-10c">
        {children}
    </div>;
}

export function ViewPendValue(props: ViewDivProps) {
    const { valDiv, readonly } = props;
    const { atomSum, binDiv, parent } = valDiv;
    const { level, entityBin } = binDiv;
    const valRow = useAtomValue(valDiv.getAtomValRow());
    let { sumValue } = useAtomValue(atomSum);
    if (parent === undefined) {
        const { value: rootValue } = valRow;
        if (rootValue !== undefined) {
            sumValue = rootValue;
        }
    }
    const { pendValue } = valRow;
    let {
        pend: cnPend, pendOver: cnPendOver, pendValue: cnPendValue
    } = theme;

    const { value: budValue } = entityBin;
    if (pendValue === undefined) return null;
    if (level === 0) {
        if (readonly !== true) {
            let vOver: any;
            let icon: string, color: string;
            if (sumValue > pendValue) {
                icon = 'exclamation-circle';
                color = cnPendOver;
                vOver = <div className="position-absolute text-danger" style={{ right: '-0.5rem', top: '-0.5rem' }}>
                    <FA name={icon} />
                </div>;
            }
            else {
                color = cnPend;
            }
            // <FA name={icon} className={color + ' me-2 '} />
            return <div className="d-flex align-items-center position-relative">
                <span className={color + ' me-2 '}>待办</span>
                <span className={'w-min-2c w-min-3c ' + cnPendValue}>{budValue?.getUIValue(pendValue)}</span>
                {vOver}
            </div>;
        }
    }
    return null;
}
