import { BinPick, PickAtom, PickPend, PickQuery, PickSpec } from "app/Biz";
import { BizPhraseType } from "uqs/UqDefault";
import { useState } from "react";
import { usePickFromAtom } from "./fromAtom";
import { usePickFromSpec } from "./fromSpec";
import { usePickFromPend } from "./fromPend";
import { usePickFromQuery } from "./fromQuery";
import { RearPickResultType, ReturnUseBinPicks, SheetStore } from "../store";
import { PickResult } from "../store";
import { getAtomValue, setAtomValue, theme } from "tonwa-com";
import { FA, Sep, SpinnerSmall } from "tonwa-com";
import { ViewAtomId } from "app/hooks";
import { useAtomValue } from "jotai";

interface Props {
    subHeader?: string;
    sheetStore: SheetStore;
    onPicked: (results: ReturnUseBinPicks) => Promise<void>;
}

export function ViewBinPicks({ sheetStore, onPicked, subHeader }: Props) {
    const rearPickResultType = RearPickResultType.scalar;
    const pickFromAtom = usePickFromAtom();
    const pickFromSpec = usePickFromSpec();
    const pickFromPend = usePickFromPend();
    const [pickFromQueryScalar, pickFromQuery] = usePickFromQuery();
    const { main, divStore, sheetConsole } = sheetStore;
    const { binPicks, rearPick } = main.entityBin;
    const { picks } = sheetConsole;
    const { atomPickedResults, atomRearPickResult, atomCur } = picks;
    let namedResults = getAtomValue(atomPickedResults);
    let rearPickResult = useAtomValue(atomRearPickResult);
    let cur = useAtomValue(atomCur);

    async function onPick(binPick: BinPick, index: number) {
        let pickResult: any;
        const { name, fromPhraseType } = binPick;
        if (fromPhraseType === undefined) return;
        switch (fromPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, binPick as PickAtom);
                break;
            case BizPhraseType.spec:
                pickResult = await pickFromSpec(divStore, namedResults, binPick as PickSpec);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQueryScalar(namedResults, binPick as PickQuery);
                break;
        }
        if (pickResult === undefined) return;
        namedResults[name] = pickResult;
        for (let i = index + 1; i < binPicks.length; i++) {
            namedResults[binPicks[i].name] = undefined;
        }
        setAtomValue(atomPickedResults, { ...namedResults });
        setAtomValue(atomCur, index + 1);
        divStore.setReload();
    }
    async function onPickRear(binPick: BinPick, index: number) {
        const { divStore } = sheetStore;
        let pickResult: PickResult[] | PickResult;
        const { fromPhraseType } = rearPick;
        switch (fromPhraseType) {
            default: debugger; break;
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(divStore, namedResults, rearPick as PickAtom);
                break;
            case BizPhraseType.spec:
                pickResult = await pickFromSpec(divStore, namedResults, rearPick as PickSpec);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQuery(namedResults, rearPick as PickQuery, rearPickResultType);
                break;
            case BizPhraseType.pend:
                pickResult = await pickFromPend(divStore, namedResults, rearPick as PickPend);
                break;
        }
        setAtomValue(atomRearPickResult, pickResult);
        setAtomValue(atomCur, binPicks.length + 1);
        setAtomValue(atomPickedResults, { ...namedResults, [binPick.name]: pickResult });
        divStore.setReload();
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
    let viewBinPicks: any;
    let viewBinPicksNext: any;
    if (binPicks !== undefined) {
        viewBinPicks = <>
            {binPicks.map((v, index) => {
                const { name } = v;
                return <ViewBinPick key={name} binPick={v}
                    onPick={onPick}
                    index={index} cur={cur}
                    sheetStore={sheetStore}
                />;
            })}
            <ViewBinPick binPick={rearPick} onPick={onPickRear}
                index={binPicks.length} cur={cur}
                sheetStore={sheetStore}
            />
        </>;
        viewBinPicksNext = <LR cn={undefined} onClick={undefined} label={null}>
            <button className="btn btn-primary" onClick={onStart} disabled={cur <= binPicks.length}>
                <FA name="arrow-right me-2" />下一步
            </button>
        </LR>;
    }
    return <>
        <div className="border rounded-3 mt-3">
            <div className="tonwa-bg-gray-2 py-1 px-3 text-secondary">
                {subHeader}
            </div>
            <Sep />
            {viewBinPicks}
        </div>
        {viewBinPicksNext}
    </>;
}

function ViewBinPick({ binPick, onPick, index, cur, sheetStore }: {
    binPick: BinPick;
    onPick: (binPick: BinPick, index: number) => Promise<void>;
    cur: number;
    index: number;
    sheetStore: SheetStore;
}) {
    let namedResults = useAtomValue(sheetStore.sheetConsole.picks.atomPickedResults);
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
        cnLabel = ' text-secondary ';
        cnAngle = ' text-secondary ';
        iconPrefix = 'angle-right';
    }
    if (isPicking === true) {
        vContent = <SpinnerSmall />;
    }
    return <>
        <LR label={<>
            <FA name={iconPrefix} fixWidth={true} className={'me-2 ' + cnAngle} />
            <div className="flex-fill" />
            <span className={cnLabel}>{binPick.caption ?? binPick.name}</span>
        </>} cn={cn} onClick={onClick}>
            {vContent}
        </LR>
        <Sep />
    </>;
}

function LR({ children, label, cn, onClick }: { children: React.ReactNode; label: JSX.Element; cn: string; onClick: () => void }) {
    const py = ' py-3 ';
    let cnLabel = ' col-3 ' + (label ? 'col-3 tonwa-bg-gray-1 d-flex align-items-center border-end ' + py : '');
    return <div className={theme.bootstrapContainer}>
        <div className="row">
            <div className={cnLabel}>
                {label}
            </div>
            <div className={' col ' + py + (cn ?? '')} onClick={onClick}>
                {children}
            </div>
        </div>
    </div>;
}
