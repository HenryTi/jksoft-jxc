import { ViewSpec } from "app/hooks/View";
import { Prop, VNamedBud } from "../tool";
import { OwnedBuds } from "app/hooks/tool";
import { ViewPendRowEdit } from "./ViewPendRowEdit";
import { PendBandProps } from "./model";

export function ViewPendRow({
    value: pendRow
    , divStore
    , hasPrice, hasAmount }: PendBandProps) {
    const { entityBin, ownerColl } = divStore;
    const { div, pend: entityPend } = entityBin;
    let { i: iBud } = entityPend;

    const { detail: { id, i, price, amount }, value, mid, cols } = pendRow;
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex text-end align-items-center">
            <span className="me-3 small text-secondary">{caption}</span>
            <span className="w-min-4c">{value}</span>
        </div>;
    }
    const digits = 2;
    function ViewPropArr({ className, arr }: { className?: string; arr: Prop[]; }) {
        if (arr === undefined || arr.length === 0) return null;
        return <div className={className}>
            {arr.map((v, index) => {
                return <VNamedBud key={index} {...v} />;
            })}
        </div>;
    }
    let ownedBudsValuesColl = ownerColl[id];
    if (ownedBudsValuesColl === undefined) debugger;
    let ownedBudsValues = ownedBudsValuesColl[iBud.id];
    let rowContent = <div className="row">
        <div className="col">
            <div className="py-2">
                <ViewSpec id={i} />
                <OwnedBuds values={ownedBudsValues} />
            </div>
        </div>
        <ViewPropArr className="col" arr={mid} />
        <ViewPropArr className="col" arr={cols} />
        <div className="col">
            <div className="py-2 d-flex flex-column align-items-end">
                {hasPrice === true && <ViewValue caption={'单价'} value={price?.toFixed(digits)} />}
                {hasAmount === true && <ViewValue caption={'金额'} value={amount?.toFixed(digits)} />}
                <ViewValue caption={'数量'} value={<span className="fs-larger fw-bold">{value}</span>} />
            </div>
        </div >
    </div>;

    if (div.div === undefined) return <div className="container">{rowContent}</div>;
    return <ViewPendRowEdit pendRow={pendRow}
        pendContent={rowContent}
        divStore={divStore} />;
}
