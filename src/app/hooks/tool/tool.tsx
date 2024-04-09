import { useUqApp } from "app/UqApp";
import { BudCheckValue, BudValue } from "tonwa-app";
import { ViewBud } from "../Bud";
import { FA } from "tonwa-com";
import React from "react";
import { BizBud, EntityAtomID } from "app/Biz";

interface PropData {
    id: number;
    phrase: number;
    value: any;
    //    owner: number;
}
/*
interface BudColl {
    [row: number]: { [bud: number]: BudValue };
}
*/
export interface BudsColl {
    // [row: number]: { [owner: number]: [number, BudValue][] };
    [row: number]: BudValueColl;
}

export interface BudValueColl {
    [bud: number]: BudValue;
}

export function budValuesFromProps(props: PropData[]) {
    const budsColl: BudsColl = {};
    // const ownerColl: OwnerColl = {};
    for (let { id, phrase, value/*, owner*/ } of props) {
        // if (owner !== 0) continue;
        let budValues = budsColl[id];
        if (budValues === undefined) {
            budsColl[id] = budValues = {};
        }
        switch (value.length) {
            default:
            case 0: debugger; break;
            case 1: budValues[phrase] = value[0]; break;
            case 2:
                let v1 = value[1];
                let checks = budValues[phrase] as BudCheckValue;
                if (checks === undefined) {
                    budValues[phrase] = checks = [v1];
                }
                else {
                    // 可能重复，去重。具体为什么会重复，随后再找原因
                    if (checks.findIndex(v => v === v1) < 0) {
                        checks.push(v1);
                    }
                    else {
                        debugger;
                    }
                }
                break;
        }
    }
    /*
    for (let { id, phrase, owner } of props) {
        if (owner === 0) continue;
        let ownerValues = ownerColl[id];
        if (ownerValues === undefined) {
            ownerColl[id] = ownerValues = {};
        }
        let owned = ownerValues[owner];
        if (owned === undefined) {
            owned = [];
            ownerValues[owner] = owned;
        }
        owned.push([phrase, budColl[id][phrase]]);
    }
    return { budColl, ownerColl };
    */
    return budsColl;
}

// atom field owns buds
export function OwnedBuds({ values, noLabel }: { values: [number, BudValue][]; noLabel?: boolean; }) {
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
                content = <ViewBud bud={bizBud} value={budValue} noLabel={noLabel} />;
            }
            return <React.Fragment key={budId}>
                {content}
            </React.Fragment>;
        })}
    </>;
}

export function ViewShowBuds({ budValueColl, bud, noLabel }: { budValueColl: BudValueColl; bud: BizBud; noLabel?: boolean; }) {
    if (budValueColl === undefined) return null;
    if (bud === undefined) return null;
    const { fieldShows } = bud;
    if (fieldShows === undefined) return null;
    // return <>{bud.id}</>;
    // const { biz } = useUqApp();
    return <>{
        fieldShows.map((fieldShow, index) => {
            let { owner, items } = fieldShow;
            // let bizBud = biz.budFromId(budId);
            return <React.Fragment key={index}>
                {
                    items.map(({ entity, bud }) => {
                        /*
                        let content: any;
                        if (bizBud === undefined) {
                            content = <>
                                <div className="w-min-4c me-3 small text-secondary">bud</div>
                                <FA name="question-circle-o" className="text-danger me-2" /> {budId}
                            </>;
                        }
                        else {
                            content = <ViewBud bud={bizBud} value={budValue} noLabel={noLabel} />;
                        }
                        */
                        let { id } = bud;
                        let value = budValueColl[id];
                        return <ViewBud key={id} bud={bud} value={value} noLabel={noLabel} />;
                    })
                }
            </React.Fragment>;
        })}
    </>;
}
