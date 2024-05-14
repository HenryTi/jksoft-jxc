import { ViewBud, budContent } from "app/hooks";
import { SheetStore } from "../store";
import { theme } from "tonwa-com";
import { EntityAtom } from "app/Biz";

export function ViewSpecAtom({ id, sheetStore }: { id: number; sheetStore: SheetStore; }) {
    const { bizAtomColl, bizSpecColl } = sheetStore;
    let bizAtom = bizAtomColl[id];
    if (bizAtom === undefined) {
        let bizSpec = bizSpecColl[id];
        if (bizSpec === undefined) return null;
        bizAtom = bizSpec.atom;
    }
    const { no, ex } = bizAtom;
    return <><b>{ex}</b> <span className="mx-3">{no}</span></>
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

export function ViewSpecAtomTitles({ id, sheetStore }: { id: number; sheetStore: SheetStore; }) {
    const { budsColl, bizSpecColl, biz } = sheetStore;
    const noLabel: boolean = undefined;
    let bizSpec = bizSpecColl[id];
    if (bizSpec === undefined) return null;
    const { id: atomId, base } = bizSpec.atom;
    let bizAtom = biz.entityFromId<EntityAtom>(base);
    if (bizAtom === undefined) return null;
    let { titleBuds } = bizAtom;
    if (titleBuds === undefined) {
        return null;
    }
    const budValueColl = budsColl[atomId];
    if (budValueColl === undefined) return null;
    const { labelColor } = theme;
    return <>{
        bizAtom.titleBuds.map(v => {
            let { id } = v;
            let value = budValueColl[id];
            if (value === undefined) return null;
            let vLabel: any;
            let vContent = budContent(v, value);
            if (noLabel !== true) {
                vLabel = <><small className={labelColor}>{v.caption ?? v.name}</small>: </>;
            }
            return <span key={id} className="text-nowrap me-3">
                {vLabel}{vContent}
            </span>;
        })
    }</>;
}

