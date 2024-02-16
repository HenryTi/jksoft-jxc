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
import { FA, Sep, useEffectOnce } from "tonwa-com";
import { RearPickResultType, ReturnUseBinPicks } from "./useBinPicks";

interface Props {
    sheetStore: SheetStore;
    rearPickResultType: RearPickResultType;
    onPicked: (results: ReturnUseBinPicks) => Promise<void>;
}

export function PageBinPicks({ sheetStore, rearPickResultType, onPicked }: Props) {
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
        setCur(binPicks.length);
    }

    function ViewBinPick({ binPick, onPick, index }: { binPick: BinPick; onPick: (binPick: BinPick, index: number) => Promise<void>; index: number; }) {
        let vPencil = <div className="ms-3">
            <FA name="search" fixWidth={true} className="small text-info" />
        </div>;
        let onClick: () => Promise<void>;
        let cnLabel: string, cnAngle: string, iconPrefix: string;
        let cn: string;
        let vContent: any;
        if (index < cur) {
            vContent = <>
                <div className="text-secondary flex-fill">
                    {JSON.stringify(namedResults[binPick.name]) ?? <span className="text-secondary">-</span>}
                </div>
                {vPencil}
            </>;
            onClick = async () => await onPick(binPick, index);
            cn = ' cursor-pointer ';
            cnLabel = '';
            cnAngle = ' text-success ';
            iconPrefix = 'check-circle-o';
        }
        else if (index === cur) {
            vContent = <>
                <div className="text-secondary flex-fill">
                    <FA name="search" className="ms-1 text-primary" size="lg" />
                </div>
            </>;
            onClick = async () => await onPick(binPick, index);
            cn = ' cursor-pointer';
            cnLabel = ' text-primary fw-bold ';
            cnAngle = ' text-primary ';
            iconPrefix = 'angle-right';
        }
        else {
            vContent = <>
                <small className="text-secondary">-</small>
            </>;
            cn = '';
            cnLabel = ' text-secondary small ';
            cnAngle = ' text-secondary small ';
            iconPrefix = 'angle-right';
        }
        return <>
            <div className="container">
                <div className="row">
                    <div className="col-3 py-2 tonwa-bg-gray-1">
                        <FA name={iconPrefix} fixWidth={true} className={'me-2 ' + cnAngle} />
                        <span className={cnLabel}>{binPick.name}</span>
                    </div>
                    <div className={'col py-2 ' + cn} onClick={onClick}>
                        <div className="d-flex">
                            {vContent}
                        </div>
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
    return <Page header={header}>
        <div className="p-3 tonwa-bg-gray-2">查询待处理业务</div>
        <Sep />

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
            <button className="btn btn-primary" onClick={onStart} disabled={rearPickResult === undefined}>
                下一步 <FA name="arrow-right ms-2" />
            </button>
        </div>
    </Page>;
}
