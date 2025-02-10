import { ViewBud, budContent } from "app/hooks";
import { theme } from "tonwa-com";
import { EntityAtom, StoreBase, StoreEntity } from "tonwa";
import { ViewForkId } from "app/coms/ViewForkId";

export function ViewForkAtomBold({ id, store }: { id: number; store: StoreEntity; }) {
    let IDFork = store.getCacheFork(id);
    if (IDFork === undefined) return null;
    const { atom } = IDFork;
    const { no, ex } = atom;
    return <><b>{ex}</b> <span className="mx-3">{no}</span></>;
}

export function ViewForkAtom({ id, store }: { id: number; store: StoreBase; }) {
    if (store === undefined) {
        return <ViewForkId id={id} />;
    }
    let IDFork = store.getCacheFork(id);
    if (IDFork === undefined) return null;
    const { no, ex } = IDFork.atom;
    return <>{ex ?? no}</>;
}

export function ViewForkBuds({ id, store }: { id: number; store: StoreEntity; }) {
    let IDFork = store.getCacheFork(id);
    if (IDFork === undefined) return null;
    const { entityFork } = IDFork;
    if (entityFork === undefined) return null;
    let specBudValueColl = store.getCacheBudProps(id);
    if (specBudValueColl === undefined) return null;
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
    const { biz } = store;
    const noLabel: boolean = undefined;
    let bizFork = store.getCacheFork(id);
    if (bizFork === undefined) return null;
    const { entityID, atom } = bizFork;
    let { titleBuds } = entityID;
    if (titleBuds === undefined) return null;
    const budValueColl = store.getCacheBudProps(atom.id);
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

