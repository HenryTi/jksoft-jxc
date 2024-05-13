// import { ViewSpec, ViewSpecBase, ViewSpecBaseOnly } from "app/hooks/View";
// import { Prop, VNamedBud } from "../tool";
import { RowCols, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";
import { getAtomValue, theme } from "tonwa-com";
import { DivStore, PendRow } from "../store";
import { Prop, VNamedBud } from "../store/tool";
import { ViewBud } from "app/hooks";
import { ViewSepcBuds, ViewSpecAtom } from "../views";
// import { useGetSpec } from "app/hooks/Uq";

export interface PendProps {
    divStore: DivStore;
    pendRow: PendRow;
}

// 如果 Pend 有I和X，主体显示这个
// 否则，尝试显示 origin bin 的 i
export function ViewPendRow({
    pendRow, divStore, showPendValue
}: PendProps & { showPendValue?: boolean }) {
    const { sheetStore, entityBin } = divStore;
    const { pend: entityPend } = entityBin;
    let { i: iBud, hasPrice, hasAmount } = entityPend;
    const { pend: pendId, detail: { id, i, price, amount }, value, mid } = pendRow;

    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex text-end align-items-center">
            <span className={' me-3 ' + theme.labelColor}>{caption}</span>
            <span className="w-min-3c">{value}</span>
        </div>;
    }
    const digits = 2;
    function ViewPropArr({ arr }: { arr: Prop[]; }) {
        if (arr === undefined || arr.length === 0) return null;
        return <>
            {arr.map((v, index) => {
                return <VNamedBud key={index} {...v} />;
            })}
        </>;
    }
    let viewPendValue: any;
    if (showPendValue === true) {
        let atomValDiv = divStore.valDivsOnPend[pendId];
        if (atomValDiv !== undefined) {
            let valDiv = getAtomValue(atomValDiv);
            if (valDiv !== undefined) {
                const { atomSum } = valDiv;
                const pendValue = getAtomValue(atomSum);
                viewPendValue = <ViewValue
                    caption={'已办'}
                    value={<span className="fw-bold fs-larger text-primary">{pendValue}</span>}
                />;
            }
        }
    }
    let viewBuds: any;
    const { budsColl, bizAtomColl, bizSpecColl } = sheetStore;
    const budValueColl = budsColl[i];
    let iBizSpec = bizSpecColl[i];
    if (iBizSpec !== undefined) {
        viewBuds = <ViewSepcBuds id={i} sheetStore={sheetStore} />;
    }
    else {
        viewBuds = <ViewShowBuds budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />;
    }
    return <>
        <div className="py-2 bg-white flex-fill ps-3">
            <div className="flex-fill">
                <ViewSpecAtom id={i} sheetStore={sheetStore} />
                <ViewAtomTitles budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
            </div>
            <div className="d-flex">
                <RowCols contentClassName=" flex-fill ">
                    {viewBuds}
                    <ViewPropArr arr={mid} />
                </RowCols>
            </div>
        </div>
        <div className="w-min-10c d-flex flex-column align-items-end pt-2 pe-3">
            {hasPrice === true && price !== undefined && <ViewValue caption={'单价'} value={price.toFixed(digits)} />}
            {hasAmount === true && amount !== undefined && <ViewValue caption={'金额'} value={amount.toFixed(digits)} />}
            <ViewValue caption={'数量'} value={<span className="fw-bold fs-larger">{value}</span>} />
            {viewPendValue}
        </div >
    </>;
}
