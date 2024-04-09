import { ViewSpec } from "app/hooks/View";
import { Prop, VNamedBud } from "../tool";
import { OwnedBuds, RowCols, ViewShowBuds } from "app/hooks/tool";
import { ViewPendRowEdit } from "./ViewPendRowEdit";
import { BudValue } from "tonwa-app";
import { Sep, getAtomValue, theme } from "tonwa-com";
import { DivStore, PendRow } from "../store";

interface PendProps {
    divStore: DivStore;
    pendRow: PendRow;
}

export function ViewPendRowCandidate({ pendRow, divStore }: PendProps) {
    const { entityBin } = divStore;
    const { div } = entityBin;
    let rowContent = <ViewPendRow divStore={divStore} pendRow={pendRow} showPendValue={true} />;

    // if (div.div === undefined) return rowContent;
    return <ViewPendRowEdit pendRow={pendRow}
        pendContent={rowContent}
        divStore={divStore}
        namedResults={undefined} />;
}

export function ViewPendRow({
    pendRow, divStore, viewButtons, showPendValue
}: PendProps & { viewButtons?: any; showPendValue?: boolean }) {
    const { entityBin, sheetStore: { budsColl: ownerColl } } = divStore;
    const { div, pend: entityPend } = entityBin;
    let { i: iBud, hasPrice, hasAmount } = entityPend;

    const { pend: pendId, detail: { id, i, price, amount }, value, mid, cols } = pendRow;
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex text-end align-items-center pb-1">
            <span className={' me-3 ' + theme.labelColor}>{caption}</span>
            <span className="w-min-3c">{value}</span>
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
    /*
    let ownedBudsValuesColl = ownerColl[id];
    let ownedBudsValues: [number, BudValue][];
    if (ownedBudsValuesColl !== undefined) {
        ownedBudsValues = ownedBudsValuesColl[iBud.id];
    }
    */
    let viewPendValue: any;
    if (showPendValue === true) {
        let atomValDiv = divStore.pendColl[pendId];
        if (atomValDiv !== undefined) {
            let valDiv = getAtomValue(atomValDiv);
            if (valDiv !== undefined) {
                const { atomSum } = valDiv;
                const pendValue = getAtomValue(atomSum);
                viewPendValue = <ViewValue
                    caption={'已处理'}
                    value={<span className="fw-bold fs-larger text-primary">{pendValue}</span>}
                />;
            }
        }
    }
    const budValueColl = divStore.sheetStore.budsColl[i];
    // if (budValueColl === undefined) debugger;
    // if (iBud === undefined) debugger;
    return <div className="py-2 bg-white flex-fill">
        <div className="d-flex px-3">
            <div className="flex-fill">
                <ViewSpec id={i} bold={true} noLabel={true} />
            </div>
            {viewButtons}
        </div>
        <Sep className="my-1" />
        <div className="d-flex px-3">
            <RowCols contentClassName=" flex-fill ">
                <ViewShowBuds budValueColl={budValueColl} bud={iBud} />
                <ViewPropArr className="col" arr={mid} />
                <ViewPropArr className="col" arr={cols} />
            </RowCols>
            <div className="w-min-10c d-flex flex-column align-items-end">
                {hasPrice === true && <ViewValue caption={'单价'} value={price?.toFixed(digits)} />}
                {hasAmount === true && <ViewValue caption={'金额'} value={amount?.toFixed(digits)} />}
                <ViewValue caption={'数量'} value={<span className="fw-bold fs-larger">{value}</span>} />
                {viewPendValue}
            </div >
        </div>
    </div>;
}
