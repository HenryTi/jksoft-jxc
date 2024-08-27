import { SheetStore, ValDivBase } from "../../store";
import { RowCols, RowColsSm, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";
import { Atom as BizAtom } from "uqs/UqDefault";
import { theme } from "tonwa-com";
import { ViewSpecAtomBold } from "app/hooks/View";
import { BizBud } from "app/Biz";

export function ViewIBase({ sheetStore, valDiv, index }: { sheetStore: SheetStore; valDiv: ValDivBase; index: number; }) {
    const { binDiv } = valDiv;
    const { binDivBuds, entityBin } = binDiv;
    const { budIBase: iBaseBudInDiv } = binDivBuds;
    const { iBase: iBaseBudInBin } = entityBin;
    let iBud: BizBud;
    if (iBaseBudInDiv === undefined) {
        if (iBaseBudInBin !== undefined) return null;
        iBud = entityBin.i;
    }
    else {
        iBud = iBaseBudInDiv;
    }
    let iValue = valDiv.getIValue();
    let iBase = valDiv.getIBase(sheetStore, iValue);
    if (iBase === undefined) iBase = iValue;
    if (iBase === undefined) return null;
    let vIndex: any;
    if (index !== undefined) {
        vIndex = <span className="small text-body-tertiary w-min-1c d-inline-block">{index}&nbsp;</span>;
    }
    return <div className="mb-1">
        {vIndex}
        <ViewSpecAtomBold id={iBase} store={sheetStore} />
        <ViewAtomTitles id={iBase} store={sheetStore} />
    </div>;
}

function ViewAtom({ value }: { value: BizAtom; }) {
    const { no, ex } = value;
    return <><b>{ex}</b> <span className="ms-3">{no}</span></>;
}

export function ViewIBaseBuds({ sheetStore, valDiv }: { sheetStore: SheetStore, valDiv: ValDivBase }) {
    const { binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let { iBase } = valDiv;
    return <ViewShowBuds bud={budIBase} id={iBase} store={sheetStore} />;
}

export function ViewIBaseFromId({ sheetStore, valDiv, iBase }: { sheetStore: SheetStore, valDiv: ValDivBase; iBase: number; }) {
    let { iBase: budIBase } = valDiv.binDiv.entityBin
    const { bizAtomColl } = sheetStore
    let bizAtomValue = bizAtomColl[iBase]?.atom;
    return <div>
        <div>
            <ViewAtom value={bizAtomValue} />
        </div>
        <div className="my-1">
            <ViewAtomTitles id={iBase} store={sheetStore} />
        </div>
        <div className="my-1">
            <RowCols contentClassName="flex-fill">
                <ViewShowBuds bud={budIBase} id={iBase} store={sheetStore} />
            </RowCols>
        </div>
    </div>;
}
