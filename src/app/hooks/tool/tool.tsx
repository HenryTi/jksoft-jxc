import { useUqApp } from "app/UqApp";
import { BudCheckValue, BudValue } from "tonwa-app";
import { ViewBud, budContent } from "../Bud";
import { FA, theme } from "tonwa-com";
import React from "react";
import { BizBud } from "app/Biz";
import { Atom as BizAtom } from "uqs/UqDefault";

interface PropData {
    id: number;
    phrase: number;
    value: any;
    //    owner: number;
}

export interface BudsColl {
    [row: number]: BudValueColl;
}

// bud=100, atom.no
// bud=101, atom.ex
export interface BudValueColl {
    [bud: number]: BudValue;
}

export interface AtomColl {
    [id: number]: BizAtom;
}

export interface SpecColl {
    [id: number]: {
        atom: BizAtom;
        buds: BizBud[];
    }
}

export function budValuesFromProps(props: PropData[]) {
    const budsColl: BudsColl = {};
    for (let { id, phrase, value } of props) {
        let budValues = budsColl[id];
        if (budValues === undefined) {
            budsColl[id] = budValues = {};
        }
        if (Array.isArray(value) === false) {
            budValues[phrase] = value;
        }
        else {
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
    }
    return budsColl;
}

// atom field owns buds
export function OwnedBuds({ values, noLabel, atomColl }: { values: [number, BudValue][]; noLabel?: boolean; atomColl?: AtomColl; }) {
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
                content = <ViewBud bud={bizBud} value={budValue} noLabel={noLabel} atomColl={atomColl} />;
            }
            return <React.Fragment key={budId}>
                {content}
            </React.Fragment>;
        })}
    </>;
}

export function ViewShowBuds({ budValueColl, bud, noLabel, atomColl }: { budValueColl: BudValueColl; bud: BizBud; atomColl?: AtomColl; noLabel?: boolean; }) {
    if (budValueColl === undefined) return null;
    if (bud === undefined) return null;
    let { fieldShows } = bud;
    if (fieldShows === undefined) {
        fieldShows = bud.getPrimeBuds();
        if (fieldShows === undefined) return null;
    }
    return <>{
        fieldShows.map((fieldShow, index) => {
            const bud = fieldShow;
            let { id } = bud;
            let value = budValueColl[id];
            return <ViewBud key={index} bud={bud} value={value} noLabel={noLabel} atomColl={atomColl} />;
        })}
    </>;
}

export function ViewAtomTitles({ budValueColl, bud, noLabel, atomColl }: { budValueColl: BudValueColl; bud: BizBud; noLabel?: boolean; atomColl: AtomColl; }) {
    if (budValueColl === undefined) return null;
    if (bud === undefined) return null;
    let buds = bud.getTitleBuds();
    if (buds === undefined) return null;
    const { labelColor } = theme;
    return <><span className="me-3" />{
        buds.map(v => {
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
