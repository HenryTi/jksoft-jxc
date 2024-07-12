import { useUqApp } from "app/UqApp";
import { BudValue } from "tonwa-app";
import { ViewBud, budContent } from "../Bud";
import { FA, theme } from "tonwa-com";
import React from "react";
import { BizBud, Entity } from "app/Biz";
import { BudValueColl, Store } from "app/tool";

// atom field owns buds
export function OwnedBuds({ values, noLabel, store }: { values: [number, BudValue][]; noLabel?: boolean; store: Store; }) {
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

export function ViewShowBuds({ bud, id, noLabel, store }: { bud: BizBud; id: number; store: Store; noLabel?: boolean; }) {
    const { budsColl } = store;
    const budValueColl = budsColl[id];
    if (budValueColl === undefined) return null;
    if (bud === undefined) return null;
    let { fieldShows } = bud;
    if (fieldShows === undefined) {
        fieldShows = bud.getPrimeBuds();
        if (fieldShows === undefined) return null;
    }
    return <>
        {
            fieldShows.map((fieldShow, index) => {
                const bud = fieldShow;
                let { id } = bud;
                let value = budValueColl[id];
                return <ViewBud key={index} bud={bud} value={value} noLabel={noLabel} store={store} />;
            })
        }
    </>;
}

export function ViewAtomTitles({ bud, id, noLabel, store }: { id: number; bud: BizBud; noLabel?: boolean; store: Store; }) {
    const { budsColl } = store;
    let budValueColl = budsColl[id];
    if (budValueColl === undefined) return null;
    if (bud === undefined) return null;
    let buds = bud.getTitleBuds();
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
                vLabel = <><small className={labelColor}>{v.caption ?? v.name}</small>: </>;
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
export interface Picked { [name: string]: Prop | any; }

export function pickedFromJsonArr(entity: Entity, propArr: Prop[], picked: Picked, arr: any[]) {
    if (arr === undefined) return;
    const { biz } = entity;
    for (let v of arr) {
        let { length } = v;
        if (length === undefined) continue;
        let v0 = v[0];
        let v1 = v[1];
        let name: string, bud: BizBud, value: any;
        if (v0 === 0) {
            (v as number[]).shift();
            picked.$ids = v;
            continue;
        }
        switch (length) {
            default: debugger; continue;
            case 2:
                if (typeof (v0) === 'string') {
                    switch (v0) {
                        case 'no': picked.no = v1; continue;
                        case 'ex': picked.ex = v1; continue;
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
        let prop: Prop = { name, bud, value };
        picked[name] = prop;
        propArr.push(prop);
    }
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
