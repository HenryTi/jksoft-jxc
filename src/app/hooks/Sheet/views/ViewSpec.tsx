import { ViewBud } from "app/hooks";
import { SheetStore } from "../store";

export function ViewSpecAtom({ id, sheetStore }: { id: number; sheetStore: SheetStore; }) {
    const { bizAtomColl, bizSpecColl } = sheetStore;
    let bizAtom = bizAtomColl[id];
    if (bizAtom === undefined) {
        let bizSpec = bizSpecColl[id];
        if (bizSpec === undefined) return null;
        bizAtom = bizSpec.atom;
    }
    const { no, ex } = bizAtom;
    return <><b>{ex}</b> <span className="ms-3">{no}</span></>
}

export function ViewSepcBuds({ id, sheetStore }: { id: number; sheetStore: SheetStore; }) {
    const { budsColl, bizSpecColl } = sheetStore;
    let bizSpec = bizSpecColl[id];
    if (bizSpec === undefined) return null;
    let { buds } = bizSpec;
    let specBudValueColl = budsColl[id];
    return <>{buds.map(v => {
        let budId = v.id;
        let value = specBudValueColl[budId];
        return <ViewBud key={budId} bud={v} value={value} />;
    })}</>;
}
