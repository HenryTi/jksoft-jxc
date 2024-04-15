import { SheetStore, ValDiv } from "../../store";
import { ViewAtomTitles, ViewShowBuds } from "app/hooks/tool";
import { useGetSpec } from "app/hooks/Uq";

export function ViewIBase({ sheetStore, valDiv }: { sheetStore: SheetStore, valDiv: ValDiv }) {
    const { binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let { i } = valDiv;
    if (i === undefined) return null;
    function ViewSpecAtom({ id }: { id: number; }) {
        const { atom, specs } = useGetSpec(id);
        if (atom === undefined) return null;
        const { value: atomValue, entity } = atom;
        const { no, ex } = atomValue;
        return <><b>{ex}</b> <span className="ms-3">{no}</span></>
    }
    let { iBase } = valDiv;
    let budValueColl = sheetStore.budsColl[iBase];
    return <>
        <ViewSpecAtom id={i} />
        <ViewAtomTitles budValueColl={budValueColl} bud={budIBase} />
    </>;
    /*
    return <div className="fw-bold">
        <ViewSpecBaseOnly id={i} noVisible={true} />
    </div>;
    */
}

export function ViewIBaseBuds({ sheetStore, valDiv }: { sheetStore: SheetStore, valDiv: ValDiv }) {
    const { binDiv } = valDiv;
    const { binDivBuds } = binDiv;
    const { budIBase } = binDivBuds;
    if (budIBase === undefined) return null;
    let { iBase } = valDiv;
    let budValueColl = sheetStore.budsColl[iBase];
    return <ViewShowBuds bud={budIBase} budValueColl={budValueColl} />
}
