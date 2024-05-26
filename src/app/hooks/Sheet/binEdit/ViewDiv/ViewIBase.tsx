import { SheetStore, ValDivBase } from "../../store";
import { RowColsSm, ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";
import { Atom as BizAtom } from "uqs/UqDefault";
import { theme } from "tonwa-com";
import { ViewSpecAtom } from "app/hooks/View";
import { BizBud } from "app/Biz";

export function ViewIBase({ sheetStore, valDiv }: { sheetStore: SheetStore, valDiv: ValDivBase }) {
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
    const { budsColl, bizAtomColl } = sheetStore
    let budValueColl = budsColl[iBase];
    return <>
        <ViewSpecAtom id={iBase} store={sheetStore} />
        <ViewAtomTitles budValueColl={budValueColl} bud={iBud} atomColl={bizAtomColl} />
    </>;
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
    const { budsColl, bizAtomColl } = sheetStore;
    let budValueColl = budsColl[iBase];
    return <ViewShowBuds bud={budIBase} budValueColl={budValueColl} atomColl={bizAtomColl} />
}

export function ViewIBaseFromId({ sheetStore, valDiv, iBase }: { sheetStore: SheetStore, valDiv: ValDivBase; iBase: number; }) {
    let { iBase: budIBase } = valDiv.binDiv.entityBin
    const { budsColl, bizAtomColl } = sheetStore
    let bizAtomValue = bizAtomColl[iBase];
    let budValueColl = budsColl[iBase];
    return <div>
        <div>
            <ViewAtom value={bizAtomValue} />
        </div>
        <div>
            <ViewAtomTitles budValueColl={budValueColl} bud={budIBase} atomColl={bizAtomColl} />
        </div>
        <div className={theme.bootstrapContainer}>
            <RowColsSm contentClassName="flex-fill">
                <ViewShowBuds bud={budIBase} budValueColl={budValueColl} atomColl={bizAtomColl} />
            </RowColsSm>
        </div>
    </div>;
}
