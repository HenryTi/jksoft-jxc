import { BizBud, BudFork, BudID, BudRadio, EntityAtom, EntityFork, EnumBudType } from "app/Biz";
import { ViewBudSpec, ViewSpecNoAtom } from "app/hooks";
import { EntityStore, contentFromDays } from "app/tool";
import { LabelBox, ViewBudEmpty } from "../tool";
import { Atom as BizAtom, BizPhraseType } from "uqs/UqDefault";
import { ViewSpecId } from "app/coms/ViewSpecId";

export enum ViewBudUIType {
    notInDiv = 0,
    inDiv = 1,
}

export function ViewBud({ bud, value, uiType, noLabel, store }: { bud: BizBud; value: any; uiType?: ViewBudUIType; noLabel?: boolean; store?: EntityStore/* atomColl?: AtomColl;*/ }) {
    if (value === undefined) return null;
    if (value === null) return null;
    if (value === '') return null;
    if (bud === undefined) return <>{value}</>;
    if (Array.isArray(value) === true) {
        value = value;
    }
    let content: any;
    const { name, caption, budDataType } = bud;
    if (value === undefined) {
        return null;
    }
    else {
        let type = budDataType?.type;
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
            case EnumBudType.date:
                content = date(bud, value);
                break;
            case EnumBudType.datetime: content = datetime(bud, value); break;
            case EnumBudType.atom:
                return atom(bud, value, uiType, noLabel, store);
            case EnumBudType.bin:
                return bin(bud, value, store);
            case EnumBudType.fork:
                return fork(bud, value, store);
        }
    }
    if (noLabel === true) {
        return <div className="col mb-1">{content}</div>;
    }
    return <LabelBox label={caption} className="mb-1">{content}</LabelBox>;
}

export function budContent(bud: BizBud, value: any, store: EntityStore) {
    let content: any;
    const { budDataType } = bud;
    if (value === undefined) {
        content = <>&nbsp;</>;
    }
    else {
        let type = budDataType?.type;
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
            case EnumBudType.date:
                content = date(bud, value);
                break;
            case EnumBudType.datetime: content = datetime(bud, value); break;
            case EnumBudType.atom:
                return atom(bud, value, ViewBudUIType.notInDiv, true, store);
            case EnumBudType.bin:
                return bin(bud, value, store);
            case EnumBudType.fork:
                return fork(bud, value, store);
        }
    }
    return content;
}

function atom(bud: BizBud, value: any, uiType: ViewBudUIType, noLabel: boolean, store: EntityStore) {
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
    let pAtom = bizAtomColl[value];
    let bizAtom: BizAtom = pAtom?.atom;
    if (bizAtom !== undefined) {
        let { no, ex } = bizAtom
        let title = `${ex} ${no}`;
        if (noLabel === true) {
            return <span title={title}>{ex}</span>;
        }
        let label: any;
        const { caption } = bud;
        label = caption;
        return <LabelBox title={title} label={label}>
            {ex}
        </LabelBox>;
    }
    const { bizForkColl: bizSpecColl } = store;
    let specValue = bizSpecColl[value];
    if (specValue !== undefined) {
        return <div>spec: {specValue.atom.id}</div>
    }
    else {
        const { entityID } = bud.budDataType as BudID;
        if (entityID === undefined) {
            return view();
        }
        const { caption } = bud;
        if (entityID.bizPhraseType === BizPhraseType.fork) {
            return <LabelBox label={caption}>
                <ViewSpecId id={value} />
            </LabelBox>
        }
        else {
            return <ViewSpecId id={value} />;
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
    if (vals.length === 0) return <ViewBudEmpty />;
    for (let v of vals) {
        let op = options.coll[v];
        if (op === undefined) continue;
        const { caption, name } = op;
        if (vArr.length > 0) {
            vArr.push(<small key={'s' + v} className="text-body-tertiary mx-1">/</small>);
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

function bin(bud: BizBud, value: any, store: EntityStore) {
    let showBuds = bud.getPrimeBuds();
    if (showBuds === undefined) return null;
    const { budsColl } = store;
    let budVals = budsColl[value];
    function viewNoVals(bud: BizBud) {
        let { id, caption } = bud;
        return <LabelBox key={id} label={caption} className="mb-1">
            <div>{ }</div>
            ?{id}-{value}?
        </LabelBox>;
    }
    function viewWithVals(bud: BizBud) {
        const { id: showBudId } = bud;
        let val = budVals[showBudId];
        return <ViewBud key={showBudId} bud={bud} value={val} uiType={ViewBudUIType.inDiv} store={store} />;
    }
    let viewFunc = budVals === undefined ? viewNoVals : viewWithVals;
    return <>
        {
            showBuds.map((v, index) => {
                if (v === undefined) {
                    return <div key={index}>showBuds undefined</div>;
                }
                return viewFunc(v);
            })
        }
    </>;
}

function fork(bud: BizBud, value: any, store: EntityStore) {
    let { $ } = value;
    let entityFork: EntityFork;
    if ($ !== undefined) {
        entityFork = bud.biz.entityFromId($);
    }
    if (entityFork === undefined) {
        return <LabelBox label={bud.caption} className="mb-1">{JSON.stringify(value)}</LabelBox>;
    }
    const { showKeys, showBuds } = entityFork;
    function viewBud(bud: BizBud) {
        const { id } = bud;
        return <ViewBud key={id} bud={bud} value={value[id]} />;
    }
    return <>
        {showKeys.map(v => viewBud(v))}
        {showBuds.map(v => viewBud(v))}
    </>;
}