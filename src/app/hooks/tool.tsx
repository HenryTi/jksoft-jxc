import { useUqApp } from "app/UqApp";
import { BudCheckValue, BudValue } from "tonwa-app";
import { ViewBud } from "./Bud";

interface PropData {
    id: number;
    phrase: number;
    value: any;
    owner: number;
}

export function budValuesFromProps(props: PropData[]) {
    const budColl: { [row: number]: { [bud: number]: BudValue } } = {};
    const ownerColl: { [row: number]: { [owner: number]: [number, BudValue][] } } = {};
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
                let checks = budValues[phrase] as BudCheckValue;
                if (checks === undefined) {
                    budValues[phrase] = checks = [];
                }
                checks.push(value[1]);
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
export function OwnedBuds({ values }: { values: [number, BudValue][]; }) {
    if (values === undefined) return null;
    const { biz } = useUqApp();
    return <div className="d-flex flex-wrap my-1">{
        values.map(value => {
            let [budId, budValue] = value;
            let bizBud = biz.budFromId(budId);
            let { caption, name } = bizBud;
            return <div className="d-flex w-min-12c align-items-center" key={budId}>
                <div className="w-min-4c me-3 small text-secondary">{caption ?? name}</div>
                <ViewBud bud={bizBud} value={budValue} />
            </div>;
        })}
    </div>;
}
