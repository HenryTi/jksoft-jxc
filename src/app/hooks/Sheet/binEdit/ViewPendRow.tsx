import { ViewSpec } from "app/hooks/View";
import { Prop, VNamedBud } from "../tool";
import { OwnedBuds, RowCols } from "app/hooks/tool";
import { ViewPendRowEdit } from "./ViewPendRowEdit";
import { PendBandProps } from "./model";
import { BudValue } from "tonwa-app";
import { theme } from "tonwa-com";

export function ViewPendRow({
    value: pendRow
    , divStore
    , hasPrice, hasAmount }: PendBandProps) {
    const { entityBin, ownerColl } = divStore;
    const { div, pend: entityPend } = entityBin;
    let { i: iBud } = entityPend;

    const { detail: { id, i, price, amount }, value, mid, cols } = pendRow;
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex text-end align-items-center pt-1 pb-2">
            <span className="me-3 small text-secondary">{caption}</span>
            <span className="w-min-4c">{value}</span>
        </div>;
    }
    const digits = 2;
    function ViewPropArr({ className, arr }: { className?: string; arr: Prop[]; }) {
        if (arr === undefined || arr.length === 0) return null;
        return <>
            {arr.map((v, index) => {
                return <VNamedBud key={index} {...v} />;
            })}
        </>;
    }
    let ownedBudsValuesColl = ownerColl[id];
    let ownedBudsValues: [number, BudValue][];
    if (ownedBudsValuesColl !== undefined) {
        ownedBudsValues = ownedBudsValuesColl[iBud.id];
    }
    let rowContent = <div className="d-flex py-1">
        <div className={'flex-grow ' + theme.bootstrapContainer}>
            <RowCols>
                <ViewSpec id={i} />
                <OwnedBuds values={ownedBudsValues} />
                <ViewPropArr className="col" arr={mid} />
                <ViewPropArr className="col" arr={cols} />
            </RowCols>
        </div>
        <div className="w-min-10c d-flex flex-column align-items-end">
            {hasPrice === true && <ViewValue caption={'单价'} value={price?.toFixed(digits)} />}
            {hasAmount === true && <ViewValue caption={'金额'} value={amount?.toFixed(digits)} />}
            <ViewValue caption={'数量'} value={<span className="fw-bold">{value}</span>} />
        </div >
    </div>;

    if (div.div === undefined) return rowContent;
    return <ViewPendRowEdit pendRow={pendRow}
        pendContent={rowContent}
        divStore={divStore}
        namedResults={undefined} />;
}
