import { theme } from "tonwa-com";
import { StoreBase, StoreEntity } from "../../Store";
import { EntityAtom } from "../../Biz";
import { ViewForkId } from "./ViewForkId";
import { budContent, ViewBud } from "../Bud";

export function ViewForkAtomBold({ id, store }: { id: number; store: StoreEntity; }) {
    let IDAtom = store.getCacheAtom(id);
    //?.atom;
    if (IDAtom === undefined) debugger;
    /*
    if (bizAtom === undefined) {
        let bizFork = store.getCacheFork(id);
        if (bizFork === undefined) return null;
        const {atom} = bizFork;
        if (bizAtom === undefined) {
            return <ViewForkId id={id} />;
        }
    }
    */
    const { atom } = IDAtom;
    const { no, ex } = atom;
    return <><b>{ex}</b> <span className="mx-3">{no}</span></>;
}

export function ViewForkAtom({ id, store }: { id: number; store: StoreBase; }) {
    if (id === undefined) return <>-</>;
    if (store === undefined) {
        return <ViewForkId id={id} />;
    }
    let IDAtom = store.getCacheAtom(id);
    /*
    if (bizAtom === undefined) {
        let bizSpec = store.getCacheFork(id);
        if (bizSpec === undefined) return null;
        bizAtom = bizSpec.seed;
    }
    */
    const { no, ex } = IDAtom.atom;
    return <>{ex ?? no}</>;
}

export function ViewForkBuds({ id, store }: { id: number; store: StoreEntity; }) {
    let bizFork = store.getCacheFork(id);
    if (bizFork === undefined) return null;
    let { entityFork } = bizFork;
    if (entityFork === undefined) return null;
    let specBudValueColl = store.getCacheBudProps(id);
    return <>{entityFork.keys.map(v => {
        let budId = v.id;
        let value = specBudValueColl[budId];
        return <ViewBud key={budId} bud={v} value={value} />;
    })}</>;
}

export function ViewAtomTitlesOfStore({ id, store }: { id: number; store: StoreEntity; }) {
    const { biz } = store;
    const atom = store.getCacheAtom(id)?.atom;
    const noLabel: boolean = undefined;
    if (atom === undefined) return null;
    let bizAtom = biz.entityFromId<EntityAtom>(atom.phrase);
    if (bizAtom === undefined) return null;
    let { titleBuds } = bizAtom;
    if (titleBuds === undefined) {
        return null;
    }
    const budValueColl = store.getCacheBudProps(id);
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

export function ViewAtomPrimesOfStore({ id, store }: { id: number; store: StoreEntity; }) {
    const { biz } = store;
    const atom = store.getCacheAtom(id)?.atom;
    // const noLabel: boolean = undefined;
    if (atom === undefined) return null;
    let bizAtom = biz.entityFromId<EntityAtom>(atom.phrase);
    if (bizAtom === undefined) return null;
    let { primeBuds } = bizAtom;
    if (primeBuds === undefined) {
        return null;
    }
    const budValueColl = store.getCacheBudProps(id);
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

export function ViewForkAtomTitles({ id, store }: { id: number; store: StoreEntity; }) {
    // const { biz } = store;
    const noLabel: boolean = undefined;
    let bizFork = store.getCacheFork(id);
    /*
    let bizAtom: EntityAtom;
    let atomId: number;
    if (bizFork === undefined) {
        const atomRet = store.getCacheAtom(id);
        if (atomRet === undefined) return null;
        const { atom, entityID } = atomRet;
        bizAtom = entityID;
        atomId = id;
    }
    else {
        const { id, phrase } = bizFork.seed;
        atomId = id;
        bizAtom = biz.entityFromId<EntityAtom>(phrase);
        if (bizAtom === undefined) return null;
    }
    */
    if (bizFork === undefined) debugger;
    const { entityID, atom } = bizFork;
    let { titleBuds } = entityID;
    if (titleBuds === undefined) {
        return null;
    }
    const budValueColl = store.getCacheBudProps(atom.id);
    if (budValueColl === undefined) return null;
    const { labelColor } = theme;
    return <>{
        entityID.titleBuds.map(v => {
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

