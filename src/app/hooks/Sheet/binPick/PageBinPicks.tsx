import { BinPick, EntityBin } from "app/Biz";
import { BizPhraseType } from "uqs/UqDefault";
import { useCallback, useRef, useState } from "react";
import { usePickFromAtom } from "./fromAtom";
import { usePickFromSpec } from "./fromSpec";
import { usePickFromPend } from "./fromPend";
import { usePickFromQuery } from "./fromQuery";
import { SheetStore } from "../store";
import { NamedResults, PickResult } from "../NamedResults";
import { Page, useModal } from "tonwa-app";
import { FA, Sep, SpinnerSmall, useEffectOnce } from "tonwa-com";
import { RearPickResultType, ReturnUseBinPicks } from "./useBinPicks";
import { ViewAtomId } from "app/hooks";

interface Props {
    sheetStore: SheetStore;
    onPicked: (results: ReturnUseBinPicks) => Promise<void>;
}

export function PageBinPicks({ sheetStore, onPicked }: Props) {
    const rearPickResultType = RearPickResultType.scalar;
    const pickFromAtom = usePickFromAtom();
    const pickFromSpec = usePickFromSpec();
    const pickFromPend = usePickFromPend();
    const [pickFromQueryScalar, pickFromQuery] = usePickFromQuery();
    const { main, entitySheet, divStore } = sheetStore;
    const { binPicks, rearPick } = main.entityMain;
    const { caption, name } = entitySheet;
    const header = caption ?? name;
    const [namedResults, setNamedResult] = useState<{ [name: string]: any }>({
        '%sheet': new Proxy(main.valRow, main.entityMain.proxyHandler()),
    });
    let [rearPickResult, setRearPickResult] = useState(undefined);
    let [cur, setCur] = useState(0);

    async function onPick(binPick: BinPick, index: number) {
        let pickResult: any;
        const { name, pick } = binPick;
        const { bizPhraseType } = pick;
        if (bizPhraseType === undefined) return;
        switch (bizPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, binPick);
                break;
            case BizPhraseType.spec:
                pickResult = await pickFromSpec(divStore, namedResults, binPick);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQueryScalar(namedResults, binPick);
                break;
        }
        if (pickResult === undefined) return;
        namedResults[name] = pickResult;
        for (let i = index + 1; i < binPicks.length; i++) {
            namedResults[binPicks[i].name] = undefined;
        }
        setNamedResult({ ...namedResults });
        setCur(index + 1);
    }
    async function onPickRear(binPick: BinPick, index: number) {
        if (sheetStore === undefined) debugger;
        const { divStore } = sheetStore;
        let pickResult: PickResult[] | PickResult;
        const { pick } = rearPick;
        switch (pick.bizPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, rearPick);
                break;
            case BizPhraseType.spec:
                pickResult = await pickFromSpec(divStore, namedResults, rearPick);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQuery(namedResults, rearPick, rearPickResultType);
                break;
            case BizPhraseType.pend:
                pickResult = await pickFromPend(divStore, namedResults, rearPick);
        }
        setRearPickResult(pickResult);
        setCur(binPicks.length + 1);
        setNamedResult({ ...namedResults, [binPick.name]: pickResult });
    }

    function ViewBinPick({ binPick, onPick, index }: { binPick: BinPick; onPick: (binPick: BinPick, index: number) => Promise<void>; index: number; }) {
        let [isPicking, setIsPicking] = useState(false);
        let vPencil = <div className="ms-3">
            <FA name="search" fixWidth={true} className="small text-info" />
        </div>;
        async function onClick() {
            if (index > cur) return;
            if (isPicking === true) return;
            setIsPicking(true);
            await onPick(binPick, index);
            setIsPicking(false);
        }
        let cnLabel: string, cnAngle: string, iconPrefix: string;
        let cn: string;
        let vContent: any;
        if (index < cur) {
            let val = namedResults[binPick.name];
            let vVal: any;
            if (val === undefined) {
                vVal = <span className="text-secondary">-</span>;
            }
            else {
                switch (typeof val) {
                    case 'object':
                        vVal = <ViewAtomId id={val.id} />;
                        break;
                    default:
                        vVal = val;
                        break;
                }
            }
            vContent = <div className="d-flex">
                <div className="text-secondary flex-fill">
                    {vVal}
                </div>
                {vPencil}
            </div>;
            cn = ' cursor-pointer ';
            cnLabel = '';
            cnAngle = ' text-success ';
            iconPrefix = 'check-circle-o';
        }
        else if (index === cur) {
            vContent = <div className="text-secondary flex-fill">
                <FA name="search" className="text-primary" size="lg" />
            </div>;
            cn = ' cursor-pointer';
            cnLabel = ' text-primary fw-bold ';
            cnAngle = ' text-primary ';
            iconPrefix = 'hand-o-right';
        }
        else {
            vContent = <small className="text-secondary">-</small>;
            cn = '';
            cnLabel = ' text-secondary small ';
            cnAngle = ' text-secondary small ';
            iconPrefix = 'angle-right';
        }
        if (isPicking === true) {
            vContent = <SpinnerSmall />;
        }
        return <>
            <div className="container">
                <div className="row">
                    <div className="col-3 py-2 tonwa-bg-gray-1">
                        <FA name={iconPrefix} fixWidth={true} className={'me-2 ' + cnAngle} />
                        <span className={cnLabel}>{binPick.name}</span>
                    </div>
                    <div className={'col py-2 ' + cn} onClick={onClick}>
                        {vContent}
                    </div>
                </div>
            </div>
            <Sep />
        </>;
    }
    async function onStart() {
        if (rearPickResult === undefined) return;
        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];

        let ret: ReturnUseBinPicks = {
            namedResults,
            rearBinPick: rearPick,           // endmost pick
            rearResult,
            rearPickResultType: rearPickResultType,
        };
        await onPicked(ret);
    }
    return <Page header="批选待处理" back="close">
        <div className="border rounded-3 mt-3">
            <div className="tonwa-bg-gray-2 small py-3 px-3 text-secondary">
                查询条件
            </div>
            <Sep />
            {binPicks.map((v, index) => {
                const { name } = v;
                return <ViewBinPick key={name} binPick={v} onPick={onPick} index={index} />;
            })}
            <ViewBinPick binPick={rearPick} onPick={onPickRear} index={binPicks.length} />
        </div>
        <div className="p-3">
            <button className="btn btn-primary" onClick={onStart} disabled={cur <= binPicks.length}>
                下一步 <FA name="arrow-right ms-2" />
            </button>
        </div>
    </Page>;
}
