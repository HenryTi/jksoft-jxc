import { Prop, RowCols, RowColsSm, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";
import { getAtomValue, theme } from "tonwa-com";
import { BinStore, PendRow } from "../store";
import { ViewForkAtomBold, ViewForkAtomTitles, ViewForkBuds } from "app/hooks/View";
import { ViewBud } from "app/hooks";

export interface PendProps {
    binStore: BinStore;
    pendRow: PendRow;
}

// 如果 Pend 有I和X，主体显示这个
// 否则，尝试显示 origin bin 的 i
export function ViewPendRow({
    pendRow, binStore, showPendValue
}: PendProps & { showPendValue?: boolean }) {
    const { sheetStore, entity: entityBin } = binStore;
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
                return <ViewBud key={index} {...v} store={sheetStore} />;
            })}
        </>;
    }
    let viewPendValue: any;
    if (showPendValue === true) {
        let atomValDiv = binStore.valDivsOnPend[pendId];
        if (atomValDiv !== undefined) {
            let valDiv = getAtomValue(atomValDiv);
            if (valDiv !== undefined) {
                const { atomSum } = valDiv;
                const { sumAmount, sumValue: pendValue } = getAtomValue(atomSum);
                const vPendValue = <span className="fw-bold fs-larger text-primary">{pendValue}</span>;
                viewPendValue = <ViewValue
                    caption={'已办'}
                    value={vPendValue}
                />;
            }
        }
    }
    let viewBuds: any, viewAtomTitles: any;
    const { bizForkColl } = sheetStore;
    let iBizSpec = bizForkColl[i];
    if (iBizSpec !== undefined) {
        viewBuds = <ViewForkBuds id={i} store={sheetStore} />;
        viewAtomTitles = <ViewForkAtomTitles id={i} store={sheetStore} />;
    }
    else {
        viewBuds = <ViewShowBuds id={i} bud={iBud} store={sheetStore} />;
        viewAtomTitles = <ViewAtomTitles id={i} store={sheetStore} />;
    }
    let vPrice: any, vAmount: any;
    if (hasPrice === true && price !== undefined) {
        vPrice = <ViewValue caption={'单价'} value={price.toFixed(digits)} />;
    }
    if (hasAmount === true && amount !== undefined) {
        vAmount = <ViewValue caption={'金额'} value={amount.toFixed(digits)} />;
    }

    return <>
        <div className="pb-2 bg-white flex-fill ps-1">
            <div className="flex-fill ps-2 pt-2 pb-1 border-bottom tonwa-bg-gray-1">
                <ViewForkAtomBold id={i} store={sheetStore} />
                {viewAtomTitles}
            </div>
            <div className="d-flex ps-2">
                <RowColsSm contentClassName=" flex-fill ">
                    {viewBuds}
                    <ViewPropArr arr={mid} />
                </RowColsSm>
                <div className="align-self-end w-min-10c d-flex flex-column align-items-end pt-2 pe-3 my-1">
                    <ViewValue caption={'数量'} value={<span className="fw-bold fs-larger">{value}</span>} />
                    {vPrice}
                    {vAmount}
                    {viewPendValue}
                </div >
            </div>
        </div>
    </>;
}
