import { AtomData, BizBud, BudBin, BudFork, BudID, BudRadio, EntityAtom, EntityFork, StoreEntity, EnumBudType, EnumSysBud } from "tonwa";
import { ViewBudFork, ViewForkAtom, ViewForkNoAtom } from "app/hooks";
import { contentFromDays } from "app/tool";
import { LabelBox, ViewBudEmpty } from "../tool";
import { ViewForkId } from "app/coms/ViewForkId";
import { dateFromMinuteId, EasyDate } from "tonwa-com";

export enum ViewBudUIType {
    notInDiv = 0,
    inDiv = 1,
}

const cnViewBud = ' my-1 ';

export function ViewBud({ bud, value, uiType, noLabel, store, colon }: {
    bud: BizBud;
    value: any; uiType?: ViewBudUIType; noLabel?: boolean;
    colon?: boolean;
    store?: StoreEntity;
}) {
    if (value === undefined) return null;
    if (value === null) return null;
    if (value === '') return null;
    if (bud === undefined) return <>{value}</>;
    if (Array.isArray(value) === true) {
        value = value;
    }
    let content: any;
    const { caption, budDataType } = bud;
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
            return atom(bud, value, uiType, colon, noLabel, store);
        case EnumBudType.bin:
            return bin(bud, value, store);
        case EnumBudType.fork:
            return fork(bud, value, store);
    }
    if (noLabel === true) {
        return <div className="col my-2 ">{content}</div>;
    }
    return <LabelBox label={caption} colon={colon} className={cnViewBud}>{content}</LabelBox>;
}

export function budContent(bud: BizBud, value: any, store: StoreEntity, colon: boolean = undefined) {
    let content: any;
    const { budDataType } = bud;
    if (value === undefined) {
        content = <small className="text-body-tertiary">-</small>;
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
                return atom(bud, value, ViewBudUIType.notInDiv, colon, true, store);
            case EnumBudType.bin:
                return bin(bud, value, store);
            case EnumBudType.fork:
                return fork(bud, value, store);
        }
    }
    return content;
}

function atom(bud: BizBud, value: any, uiType: ViewBudUIType, colon: boolean, noLabel: boolean, store: StoreEntity) {
    function view() {
        switch (bud.name) {
            default:
                return <ViewBudFork id={value} bud={bud} noLabel={noLabel} />;
            case 'i':
            case 'x':
                return <ViewForkNoAtom id={value} uiType={uiType} noLabel={noLabel} />;
        }
    }
    const { caption } = bud;
    let vContent: any, title: string;
    if (store === undefined) {
        vContent = view();
    }
    else {
        // const { bizAtomColl } = store;
        let pAtom = store.getCacheAtom(value); // bizAtomColl[value];
        let bizAtom: AtomData = pAtom?.atom;
        if (bizAtom !== undefined) {
            let { no, ex } = bizAtom
            title = `${ex} ${no}`;
            vContent = ex;
        }
        else {
            // const { budsColl } = store;
            let forkValue = store.getCacheFork(value); // bizForkColl[value];
            if (forkValue !== undefined) {
                const { seed, buds } = forkValue;
                if (seed === undefined) {
                    vContent = <ViewForkId id={value} />;
                }
                else {
                    // vContent = <ViewSpecId id={atom.id} />;
                    vContent = <ViewFork />;
                    function ViewFork() {
                        const { no, ex } = seed;
                        let ret: string = (ex ?? no);
                        let sep = ' '
                        for (let bud of buds) {
                            let budValue = store.getCacheBudValue(value, bud); // budsColl[value][bud.id];
                            if (budValue !== undefined) {
                                ret += sep;
                                ret += bud.getUIValue(budValue);
                                sep = '/';
                            }
                        }
                        return <>{ret}</>;
                    }
                }
            }
            else {
                const { entityID } = bud.budDataType as BudID;
                if (entityID === undefined) {
                    vContent = view();
                }
                else // if (entityID.bizPhraseType === BizPhraseType.fork) {
                    vContent = <ViewForkAtom id={value} store={store} />
                // else {
                // vContent = <ViewForkId id={value} />;
                // }
            }
        }
    }
    if (noLabel === true) {
        return <span title={title}>{vContent}</span>;
    }
    return <LabelBox title={title} label={caption} className={cnViewBud} colon={colon}>
        {vContent}
    </LabelBox>;
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

function bin(bud: BizBud, value: any, store: StoreEntity) {
    const showBuds = bud.getPrimeBuds();
    // const { budsColl } = store;
    let budVals = store.getCacheBudProps(value); // budsColl[value];
    if (budVals === undefined) {
        debugger;
        return null;
    }
    return <>{viewSysBuds()}{viewShowBuds()}</>
    function viewSysBuds() {
        const budBin = bud.budDataType as BudBin;
        const { sysBuds } = budBin
        if (sysBuds === undefined || sysBuds.length === 0) return null;
        const { entityBin } = budBin;
        return sysBuds.map(v => {
            let label: string = entityBin.sheet.caption, content: any = budVals[v];
            switch (v) {
                case EnumSysBud.sheetNo:
                    label += '编号';
                    break;
                case EnumSysBud.sheetOperator:
                    label += '操作员';
                    break;
                case EnumSysBud.sheetDate:
                    label += '日期';
                    content = dateFromMinuteId(content).toLocaleDateString();
                    break;
            }
            return <LabelBox key={v} label={label} className={cnViewBud}>
                {content}
            </LabelBox>;
        });
    }
    function viewShowBuds() {
        if (showBuds === undefined || showBuds.length === 0) return null;
        function viewNoVals(bud: BizBud) {
            let { id, caption } = bud;
            return <LabelBox key={id} label={caption} className={cnViewBud}>
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
        return showBuds.map((v, index) => {
            if (v === undefined) {
                return <div key={index}>showBuds undefined</div>;
            }
            return viewFunc(v);
        })
    };
}

function fork(bud: BizBud, value: any, store: StoreEntity) {
    let { $ } = value;
    let entityFork: EntityFork;
    if ($ !== undefined) {
        entityFork = bud.biz.entityFromId($);
    }
    if (entityFork === undefined) {
        return <LabelBox label={bud.caption} className={cnViewBud}>{JSON.stringify(value)}</LabelBox>;
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