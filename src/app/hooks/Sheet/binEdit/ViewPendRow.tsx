import { ViewSpec, ViewSpecBase, ViewSpecBaseOnly } from "app/hooks/View";
// import { Prop, VNamedBud } from "../tool";
import { RowCols, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";
import { getAtomValue, theme } from "tonwa-com";
import { DivStore, PendRow } from "../store";
import { Prop, VNamedBud } from "../store/tool";
import { useGetSpec } from "app/hooks/Uq";

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
    const { pend: pendId, detail: { id, i, price, amount }, value, mid/*, cols*/ } = pendRow;

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
        let atomValDiv = divStore.pendColl[pendId];
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
    const { budsColl, bizAtomColl } = sheetStore;
    const budValueColl = budsColl[i];
    function ViewSpecAtom({ id }: { id: number; }) {
        const { atom, specs } = useGetSpec(id);
        if (atom === undefined) return null;
        const { value: atomValue, entity } = atom;
        const { no, ex } = atomValue;
        return <><b>{ex}</b> <span className="ms-3">{no}</span></>
    }
    return <>
        <div className="py-2 bg-white flex-fill ps-3">
            <div className="flex-fill">
                <ViewSpecAtom id={i} />
                <ViewAtomTitles budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
            </div>
            <div className="d-flex">
                <RowCols contentClassName=" flex-fill ">
                    <ViewSpecBase id={i} ViewAtom={undefined} />
                    <ViewShowBuds budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
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
