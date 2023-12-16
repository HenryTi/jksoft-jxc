import { BizBud, BudRadio, EnumBudType } from "app/Biz";
import { ViewSpec } from "app/hooks";
import { contentFromDays } from "app/tool";

export enum ViewBudUIType {
    notInDiv = 0,
    inDiv = 1,
}

export function ViewBud({ bud, value, uiType }: { bud: BizBud; value: any; uiType?: ViewBudUIType; }) {
    if (bud === undefined) return <>{value}</>;
    const { name, caption, budDataType } = bud;
    let type = budDataType?.type;
    if (type === EnumBudType.atom) {
        return atom(bud, value, uiType);
    }
    let content: any;
    switch (type) {
        default:
        case EnumBudType.dec:
        case EnumBudType.none:
        case EnumBudType.int:
        case EnumBudType.char:
        case EnumBudType.str: content = <>{value}</>; break;
        case EnumBudType.radio: content = radio(bud, value); break;
        case EnumBudType.check: content = check(bud, value); break;
        case EnumBudType.intof: content = intof(bud, value); break;
        case EnumBudType.pick: content = pick(bud, value); break;
        case EnumBudType.ID: content = ID(bud, value); break;
        case EnumBudType.date: content = date(bud, value); break;
        case EnumBudType.datetime: content = datetime(bud, value); break;
    }
    if (uiType === ViewBudUIType.inDiv) {
        return <div className="col"><small className="text-secondary me-2">{caption ?? name}</small> {content}</div>
    }
    else {
        return content;
    }
}

function ViewAtomInBud({ value }: { value: any; }) {
    return <>{value?.ex}</>;
}
function atom(bud: BizBud, value: any, uiType: ViewBudUIType) {
    return <ViewSpec id={value} uiType={uiType} />;
    // return <IDView uq={bud.biz.uq} id={value} Template={ViewAtomInBud} />;
}

function radio(bud: BizBud, value: any) {
    if (value === null) return <small className="text-secondary">/</small>;
    let { options } = bud.budDataType as BudRadio;
    let v = options.coll[value];
    if (v === undefined) return <>{JSON.stringify(value)}</>;
    const { caption, name } = v;
    return <>{caption ?? name}</>;
}

function check(bud: BizBud, value: any) {
    if (value === null) return <small className="text-secondary">/</small>;
    let { options } = bud.budDataType as BudRadio;
    let vArr: any[] = [];
    let vals = value as number[];
    for (let v of vals) {
        let op = options.coll[v];
        if (op === undefined) continue;
        const { caption, name } = op;
        if (vArr.length > 0) {
            vArr.push(<small key={'s' + v} className="text-secondary mx-2">|</small>);
        }
        vArr.push(<span key={v} className="">{caption ?? name}</span>);
    }
    return <>{vArr}</>;
}

function intof(bud: BizBud, value: any) {
    return <>intof: {value}</>;
}

function pick(bud: BizBud, value: any) {
    return <>pick: {value}</>;
}

function date(bud: BizBud, value: any) {
    return <>{contentFromDays(value)}</>;
}

function datetime(bud: BizBud, value: any) {
    return <>datetime: {value}</>;
}

function ID(bud: BizBud, value: any) {
    return <>ID: {value}</>;
}
