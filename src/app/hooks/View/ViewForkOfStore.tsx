import { ViewBud, budContent } from "app/hooks";
import { theme } from "tonwa-com";
import { EntityAtom } from "app/Biz";
import { EntityStore } from "app/tool";
import { ViewForkId } from "app/coms/ViewForkId";

export function ViewForkAtomBold({ id, store }: { id: number; store: EntityStore; }) {
    const { bizAtomColl, bizForkColl } = store;
    let bizAtom = bizAtomColl[id]?.atom;
    if (bizAtom === undefined) {
        let bizSpec = bizForkColl[id];
        if (bizSpec === undefined) return null;
        bizAtom = bizSpec.atom;
        if (bizAtom === undefined) {
            return <ViewForkId id={id} />;
        }
    }
    const { no, ex } = bizAtom;
    return <><b>{ex}</b> <span className="mx-3">{no}</span></>;
}

export function ViewForkAtom({ id, store }: { id: number; store: EntityStore; }) {
    if (store === undefined) {
        return <ViewForkId id={id} />;
    }
    const { bizAtomColl, bizForkColl } = store;
    let bizAtom = bizAtomColl[id]?.atom;
    if (bizAtom === undefined) {
        let bizSpec = bizForkColl[id];
        if (bizSpec === undefined) return null;
        bizAtom = bizSpec.atom;
    }
    const { no, ex } = bizAtom;
    return <>{ex ?? no}</>;
}

export function ViewForkBuds({ id, store }: { id: number; store: EntityStore; }) {
    const { budsColl, bizForkColl } = store;
    let bizSpec = bizForkColl[id];
    if (bizSpec === undefined) return null;
    let { buds } = bizSpec;
    let specBudValueColl = budsColl[id];
    return <>{buds.map(v => {
        let budId = v.id;
        let value = specBudValueColl[budId];
        return <ViewBud key={budId} bud={v} value={value} />;
    })}</>;
}

export function ViewAtomTitlesOfStore({ id, store }: { id: number; store: EntityStore; }) {
    const { budsColl, biz, bizAtomColl } = store;
    const atom = bizAtomColl[id]?.atom;
    const noLabel: boolean = undefined;
    if (atom === undefined) return null;
    let bizAtom = biz.entityFromId<EntityAtom>(atom.base);
    if (bizAtom === undefined) return null;
    let { titleBuds } = bizAtom;
    if (titleBuds === undefined) {
        return null;
    }
    const budValueColl = budsColl[id];
    if (budValueColl === undefined) return null;
    const { labelColor } = theme;
    return <>{
        titleBuds.map(v => {
            let { id } = v;
            let value = budValueColl[id];
            if (value === undefined) return null;
            let vLabel: any;
            let vContent = budContent(v, value, store);
            if (noLabel !== true) {
                vLabel = <><span className={labelColor}>{v.caption}</span>: </>;
            }
            return <span key={id} className="text-nowrap me-3">
                {vLabel}{vContent}
            </span>;
        })
    }</>;
}

export function ViewAtomPrimesOfStore({ id, store }: { id: number; store: EntityStore; }) {
    const { budsColl, biz, bizAtomColl } = store;
    const atom = bizAtomColl[id]?.atom;
    const noLabel: boolean = undefined;
    if (atom === undefined) return null;
    let bizAtom = biz.entityFromId<EntityAtom>(atom.base);
    if (bizAtom === undefined) return null;
    let { primeBuds } = bizAtom;
    if (primeBuds === undefined) {
        return null;
    }
    const budValueColl = budsColl[id];
    if (budValueColl === undefined) return null;
    return <>{
        primeBuds.map(v => {
            let { id } = v;
            let value = budValueColl[id];
            if (value === undefined) return null;
            return <ViewBud key={id} bud={v} value={value} />;
        })
    }</>;
}

export function ViewForkAtomTitles({ id, store }: { id: number; store: EntityStore; }) {
    const { budsColl, bizForkColl, biz } = store;
    const noLabel: boolean = undefined;
    let bizFork = bizForkColl[id];
    let bizAtom: EntityAtom;
    let atomId: number;
    if (bizFork === undefined) {
        const atomRet = store.bizAtomColl[id];
        if (atomRet === undefined) return null;
        const { atom, entityID } = atomRet;
        bizAtom = entityID;
        atomId = id;
    }
    else {
        const { id, base } = bizFork.atom;
        atomId = id;
        bizAtom = biz.entityFromId<EntityAtom>(base);
        if (bizAtom === undefined) return null;
    }
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
            let vContent = budContent(v, value, store);
            if (noLabel !== true) {
                vLabel = <><span className={labelColor}>{v.caption}</span>: </>;
            }
            return <span key={id} className="text-nowrap me-3">
                {vLabel}{vContent}
            </span>;
        })
    }</>;
}

