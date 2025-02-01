import { StoreSheet, ValDivBase } from "../../../../Store";
import { RowCols, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";
import { ViewForkAtomBold } from "app/hooks/View";
import { AtomData, BizBud } from "tonwa";

export function ViewIBase({ sheetStore, valDiv, index }: { sheetStore: StoreSheet; valDiv: ValDivBase; index: number; }) {
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
        <ViewForkAtomBold id={iBase} store={sheetStore} />
        <ViewAtomTitles id={iBase} store={sheetStore} />
    </div>;
}

function ViewAtom({ value }: { value: AtomData; }) {
    const { no, ex } = value;
    return <><b>{ex}</b> <span className="ms-3">{no}</span></>;
}

export function ViewIBaseBuds({ sheetStore, valDiv }: { sheetStore: StoreSheet, valDiv: ValDivBase }) {
    const { binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let iValue = valDiv.getIValue();
    let iBase = valDiv.getIBase(sheetStore, iValue);
    if (iBase === undefined) iBase = iValue;
    if (iBase === undefined) return null;
    return <ViewShowBuds bud={budIBase} id={iBase} store={sheetStore} />;
}

export function ViewIBaseFromId({ sheetStore, valDiv, iBase }: { sheetStore: StoreSheet, valDiv: ValDivBase; iBase: number; }) {
    let { iBase: budIBase } = valDiv.binDiv.entityBin
    let bizAtomValue = sheetStore.getCacheAtom(iBase)?.atom;
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
