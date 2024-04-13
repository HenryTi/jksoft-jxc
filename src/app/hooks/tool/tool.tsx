import { useUqApp } from "app/UqApp";
import { BudCheckValue, BudValue } from "tonwa-app";
import { ViewBud, budContent } from "../Bud";
import { FA, theme } from "tonwa-com";
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
    for (let { id, phrase, value } of props) {
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
                        console.error('budValuesFromProps duplicate ', v1);
                        // debugger;
                    }
                }
                break;
        }
    }
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
    let { fieldShows } = bud;
    if (fieldShows === undefined) {
        fieldShows = bud.getPrimeBuds();
        if (fieldShows === undefined) return null;
    }
    return <>{
        fieldShows.map((fieldShow, index) => {
            //const { entity, bud } = fieldShow;
            const bud = fieldShow;
            let { id } = bud;
            let value = budValueColl[id];
            return <ViewBud key={index} bud={bud} value={value} noLabel={noLabel} />;
        })}
    </>;
}

export function ViewAtomTitles({ budValueColl, bud, noLabel }: { budValueColl: BudValueColl; bud: BizBud; noLabel?: boolean; }) {
    if (budValueColl === undefined) return null;
    if (bud === undefined) return null;
    let buds = bud.getTitleBuds();
    if (buds === undefined) return null;
    const { labelColor } = theme;
    return <><span className="me-3" />{
        buds.map(v => {
            let { id } = v;
            let value = budValueColl[id];
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
