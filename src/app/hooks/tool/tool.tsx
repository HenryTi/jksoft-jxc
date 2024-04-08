import { useUqApp } from "app/UqApp";
import { BudCheckValue, BudValue } from "tonwa-app";
import { ViewBud } from "../Bud";
import { FA } from "tonwa-com";
import React from "react";

interface PropData {
    id: number;
    phrase: number;
    value: any;
    owner: number;
}

export interface OwnerColl {
    [row: number]: { [owner: number]: [number, BudValue][] }
}
export function budValuesFromProps(props: PropData[]) {
    const budColl: { [row: number]: { [bud: number]: BudValue } } = {};
    const ownerColl: OwnerColl = {};
    for (let { id, phrase, value, owner } of props) {
        let budValues = budColl[id];
        if (budValues === undefined) {
            budColl[id] = budValues = {};
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
