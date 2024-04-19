import { SheetStore, ValDiv } from "../../store";
import { ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";

export function ViewIBase({ sheetStore, valDiv }: { sheetStore: SheetStore, valDiv: ValDiv }) {
    const { binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let { i } = valDiv;
    if (i === undefined) return null;
    let { iBase } = valDiv;
    const { budsColl, bizAtomColl } = sheetStore
    let atomValue = bizAtomColl[iBase];
    const { no, ex } = atomValue;
    let budValueColl = budsColl[iBase];
    return <>
        <><b>{ex}</b> <span className="ms-3">{no}</span></>
        <ViewAtomTitles budValueColl={budValueColl} bud={budIBase} atomColl={bizAtomColl} />
    </>;
}

export function ViewIBaseBuds({ sheetStore, valDiv }: { sheetStore: SheetStore, valDiv: ValDiv }) {
    const { binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let { iBase } = valDiv;
    const { budsColl, bizAtomColl } = sheetStore;
    let budValueColl = budsColl[iBase];
    return <ViewShowBuds bud={budIBase} budValueColl={budValueColl} atomColl={bizAtomColl} />
}
