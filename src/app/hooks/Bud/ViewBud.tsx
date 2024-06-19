import { BizBud, BudID, BudRadio, EnumBudType } from "app/Biz";
import { ViewBudSpec, ViewSpecNoAtom } from "app/hooks";
import { Store, contentFromDays } from "app/tool";
import { LabelBox, ViewBudEmpty } from "../tool";
import { Atom as BizAtom, BizPhraseType } from "uqs/UqDefault";
import { ViewSpecId } from "app/coms/ViewSpecId";

export enum ViewBudUIType {
    notInDiv = 0,
    inDiv = 1,
}

export function ViewBud({ bud, value, uiType, noLabel, store }: { bud: BizBud; value: any; uiType?: ViewBudUIType; noLabel?: boolean; store?: Store/* atomColl?: AtomColl;*/ }) {
    if (value === undefined) return null;
    if (value === null) return null;
    if (value === '') return null;
    if (bud === undefined) return <>{value}</>;
    if (Array.isArray(value) === true) value = value[0];
    let content: any;
    const { name, caption, budDataType } = bud;
    if (value === undefined) {
        content = <>&nbsp;</>;
    }
    else {
        let type = budDataType?.type;
        if (type === EnumBudType.atom) {
            return atom(bud, value, uiType, noLabel, store);
        }
        switch (type) {
            default:
            case EnumBudType.dec:
            case EnumBudType.none:
            case EnumBudType.int:
                content = <>{value}</>; break;
            case EnumBudType.char:
            case EnumBudType.str:
                content = <span title={value}>{value}</span>; break;
            case EnumBudType.radio: content = radio(bud, value); break;
            case EnumBudType.check: content = check(bud, value); break;
            case EnumBudType.pick: content = pick(bud, value); break;
            case EnumBudType.ID: content = ID(bud, value); break;
            case EnumBudType.date: content = date(bud, value); break;
            case EnumBudType.datetime: content = datetime(bud, value); break;
        }
    }
    if (noLabel === true) {
        return <div className="col">{content}</div>;
    }
    return <LabelBox label={caption ?? name} className="mb-1">{content}</LabelBox>;
}

export function budContent(bud: BizBud, value: any) {
    let content: any;
    const { name, caption, budDataType } = bud;
    if (value === undefined) {
        content = <>&nbsp;</>;
    }
    else {
        let type = budDataType?.type;
        if (type === EnumBudType.atom) {
            return `atom:${value}`; // atom(bud, value, uiType, noLabel);
        }
        switch (type) {
            default:
            case EnumBudType.dec:
            case EnumBudType.none:
            case EnumBudType.int:
                content = <>{value}</>; break;
            case EnumBudType.char:
            case EnumBudType.str:
                content = <span title={value}>{value}</span>; break;
            case EnumBudType.radio: content = radio(bud, value); break;
            case EnumBudType.check: content = check(bud, value); break;
            //case EnumBudType.intof: content = intof(bud, value); break;
            case EnumBudType.pick: content = pick(bud, value); break;
            case EnumBudType.ID: content = ID(bud, value); break;
            case EnumBudType.date: content = date(bud, value); break;
            case EnumBudType.datetime: content = datetime(bud, value); break;
        }
    }
    return content;
}

function atom(bud: BizBud, value: any, uiType: ViewBudUIType, noLabel: boolean, store: Store) {
    function view() {
        switch (bud.name) {
            default:
                return <ViewBudSpec id={value} bud={bud} noLabel={noLabel} />;
            case 'i':
            case 'x':
                return <ViewSpecNoAtom id={value} uiType={uiType} noLabel={noLabel} />;
        }
    }
    if (store === undefined) {
        return view();
    }
    const { bizAtomColl } = store;
    let bizAtom: BizAtom = bizAtomColl[value];
    if (bizAtom !== undefined) {
        let { no, ex } = bizAtom
        let title = `${ex} ${no}`;
        if (noLabel === true) {
            return <span title={title}>{ex}</span>;
        }
        let label: any;
        const { caption, name } = bud;
        label = caption ?? name;
        return <LabelBox title={title} label={label} /*colon={true}*/>
            {ex}
        </LabelBox>;
    }
    const { bizSpecColl } = store;
    let specValue = bizSpecColl[value];
    if (specValue !== undefined) {
        return <div>spec: {specValue.atom.id}</div>
    }
    else {
        const { entityID } = bud.budDataType as BudID;
        if (entityID.bizPhraseType === BizPhraseType.fork) {
            let label: any;
            const { caption, name } = bud;
            label = caption ?? name;
            return <LabelBox label={label}>
                <ViewSpecId id={value} />
            </LabelBox>
        }
    }
    return view();
}

function radio(bud: BizBud, value: any) {
    if (value === null) return <ViewBudEmpty />;
    let { options } = bud.budDataType as BudRadio;
    let v = options.coll[value];
    if (v === undefined) {
        return <>{JSON.stringify(value)}</>;
    }
    const { caption, name } = v;
    return <>{caption ?? name}</>;
}

function check(bud: BizBud, value: any) {
    if (value === null) return <ViewBudEmpty />;
    let { options } = bud.budDataType as BudRadio;
    let vArr: any[] = [];
    let vals = Array.isArray(value) === true ? value as number[] : [value];
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

function pick(bud: BizBud, value: any) {
    return <>pick: {value}</>;
}

function date(bud: BizBud, value: any) {
    if (typeof value === 'number') {
        value = contentFromDays(value);
    }
    return <>{value}</>;
}

function datetime(bud: BizBud, value: any) {
    return <>datetime: {value}</>;
}

function ID(bud: BizBud, value: any) {
    return <>ID: {value}</>;
}
