import { useUqApp } from "app/UqApp";
import { BudValue } from "tonwa-app";
import { ViewBud, budContent } from "../Bud";
import { FA, theme } from "tonwa-com";
import React from "react";
import { BizBud, BudValueColl, Entity, EntityFork, EntityID, StoreEntity } from "tonwa";
// import { BudsColl, BudValueColl, EntityStore } from "app/tool";
import { BizPhraseType } from "uqs/UqDefault";

// atom field owns buds
export function OwnedBuds({ values, noLabel, store }: { values: [number, BudValue][]; noLabel?: boolean; store: StoreEntity; }) {
    if (values === undefined) return null;
    const { biz } = useUqApp();
    return <>{
        values.map(value => {
            let [budId, budValue] = value;
            let bizBud = biz.budFromId(budId);
            let content: any;
            if (bizBud === undefined) {
                content = <>
                    <div className="w-min-4c me-3 small text-secondary">bud</div>
                    <FA name="question-circle-o" className="text-danger me-2" /> {budId}
                </>;
            }
            else {
                content = <ViewBud bud={bizBud} value={budValue} noLabel={noLabel} store={store} />;
            }
            return <React.Fragment key={budId}>
                {content}
            </React.Fragment>;
        })}
    </>;
}

export function ViewShowBuds({ bud, id, noLabel, store }: { bud?: BizBud; id: number; store: StoreEntity; noLabel?: boolean; }) {
    // const { budsColl } = store;
    const budValueColl = store.getCacheBudProps(id);
    if (budValueColl === undefined) return null;
    let entity = store.entityFromId(id);
    if (entity !== undefined) {
        switch (entity.bizPhraseType) {
            default:
                debugger;
                break;
            case BizPhraseType.fork:
                const { seed, entityID: entityAtom, } = store.getCacheFork(id);
                const { showKeys, showBuds } = entity as EntityFork;
                return <>
                    {viewBuds(store.getCacheBudProps(seed.id), entityAtom.primeBuds)}
                    {viewBuds(budValueColl, showKeys)}
                    {viewBuds(budValueColl, showBuds)}
                </>;
            case BizPhraseType.atom:
                return <>{viewBuds(budValueColl, entity.primeBuds)}</>
        }
    }
    let fieldShows: BizBud[] = bud?.getPrimeBuds();
    if (fieldShows === undefined) return null;
    return <>{viewBuds(budValueColl, fieldShows)}</>

    function viewBuds(budsColl: BudValueColl, buds: BizBud[]): any {
        if (budsColl === undefined || buds === undefined) return null;
        return buds.map((bud, index) => {
            let { id: budId } = bud;
            let value = budsColl[budId];
            return <ViewBud key={index} bud={bud} value={value} noLabel={noLabel} store={store} />;
        })
    }
}

export function ViewAtomTitles({ id, noLabel, store }: { id: number; noLabel?: boolean; store: StoreEntity; }) {
    /* const { budsColl, bizForkColl, bizAtomColl } = store;
    let budValueColl: BudValueColl;
    let bizAtom = store.getCacheAtom(id);
    let entityID: EntityID;
    if (bizAtom === undefined) {
        let bizFork = store.getCacheFork(id);
        if (bizFork === undefined) return null;
        entityID = bizFork.entityID;
        const { atom } = bizFork;
        if (atom === undefined) return null;
        budValueColl = budsColl[bizFork.atom.id];
    }
    else {
        entityID = bizAtom.entityID;
        budValueColl = budsColl[id];
    }
    */
    let ret = store.getCacheIDBudProps(id);
    if (ret === null) return null;
    let { budValueColl, entityID } = ret;
    if (budValueColl === undefined) return null;
    if (entityID === undefined) return null;
    let buds: BizBud[] = entityID.titleBuds;
    if (buds === undefined) return null;
    const { labelColor } = theme;
    return <>{
        buds.map(v => {
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


export interface Prop<T = any> {
    name: string;
    bud: BizBud;
    value: T;
}
export interface NamedProps { [name: string]: Prop | any; }
export type QueryRowCol = [BizBud, string | number];
export interface QueryRow {
    rowId: number;              // 主从关系
    ban: number;
    ids: number[];
    values: [BizBud, number][];
    cols: QueryRowCol[];
    subs: QueryRow[];         // 从array
}

export function arrFromJsonArr(entity: Entity, arr: any[], hiddenBuds: Set<number>) {
    let propArr: Prop[] = [];
    const { biz } = entity;
    for (let v of arr) {
        let { length } = v;
        let v0 = v[0];
        let v1 = v[1];
        let name: string, bud: BizBud, value: any;
        switch (length) {
            default: debugger; continue;
            case 2:
                if (typeof (v0) === 'string') {
                    switch (v0) {
                        case 'no': continue;
                        case 'ex': continue;
                    }
                    name = v0;
                    value = v1
                }
                else {
                    bud = entity.budColl[v0];
                    name = bud.name;
                    value = v1;
                }
                break;
            case 3:
                let bizEntity = biz.entityFromId(v0);
                bud = bizEntity.budColl[v1];
                name = bud.name;
                value = v[2];
                break;
        }
        if (hiddenBuds.has(bud.id) === true) continue;
        let prop: Prop = { name, bud, value };
        propArr.push(prop);
    }
    return propArr;
}

// table pend
export function arrFromJsonMid(entity: Entity, mid: any, hiddenBuds: Set<number>) {
    let ret: Prop[] = [];
    const { budColl, buds } = entity;
    // 按buds的顺序处理。暂不知道buds是否包含继承来的
    for (let bud of buds) {
        if (bud === undefined) {
            debugger;
            continue;
        }
        let value = mid[bud.id];
        if (value === null) continue;
        if (hiddenBuds.has(bud.id) === true) continue;
        ret.push({ name: undefined, bud, value });
    }
    /*
    for (let i in mid) {
        let bud = budColl[i];
        if (bud === undefined) continue;
        let value = mid[i];
        if (value === null) continue;
        ret.push({ name: bud.name, bud, value });
    }
    */
    return ret;
}
