import { BinPick, PickOptions } from "app/Biz";
import { useRef, useState } from "react";
// import { usePickFromQuery } from "../../Query/fromQuery";
import { BinBudsEditing, RearPickResultType, ReturnUseBinPicks, SheetStore } from "../store";
import { theme } from "tonwa-com";
import { FA, Sep, SpinnerSmall } from "tonwa-com";
import { PickResult, ViewAtomId } from "app/hooks";
import { useAtomValue } from "jotai";
import { BizPhraseType } from "uqs/UqDefault";

interface Props {
    subHeader?: string;
    sheetStore: SheetStore;
    onPicked: (results: ReturnUseBinPicks) => Promise<void>;
}

export function ViewMainPicks({ sheetStore, onPicked, subHeader }: Props) {
    const rearPickResultType = RearPickResultType.scalar;
    const { mainStore: main, binStore: divStore, sheetConsole } = sheetStore;
    const { steps } = sheetConsole;
    let { current: editing } = useRef(new BinBudsEditing(sheetStore, main.entity, []));
    const [cur, setCur] = useState(0);

    const { binPicks, rearPick } = main.entity;
    let refRearPickResult = useRef(undefined as PickResult[] | PickResult);

    async function onPick(binPick: BinPick, index: number) {
        await editing.runBinPick(binPick);
        for (let i = index + 1; i < binPicks.length; i++) {
            editing.clearNameValues(binPicks[i].name);
        }
        editing.setChanging();
        setCur(index + 1);
        divStore.setReload();
    }
    async function onPickRear(binPick: BinPick, index: number) {
        let pickResult = await editing.runBinPickRear(divStore, binPick, rearPickResultType);
        refRearPickResult.current = pickResult;
        setCur(binPicks.length + 1);
        editing.setNamedValues(binPick.name, pickResult);
        editing.setChanging();
        divStore.setReload();
    }

    async function onNext() {
        let rearPickResult = refRearPickResult.current;
        if (rearPickResult === undefined) return;
        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];

        let ret: ReturnUseBinPicks = {
            editing,
            rearBinPick: rearPick,           // endmost pick
            rearResult,
            rearPickResultType: rearPickResultType,
        };
        await onPicked(ret);
        steps.next();
    }
    let viewBinPicks: any;
    let viewBinPicksNext: any;
    if (binPicks !== undefined) {
        viewBinPicks = <>
            {binPicks.map((v, index) => {
                const { name } = v;
                return <ViewPick key={name} editing={editing} binPick={v}
                    onPick={onPick}
                    index={index} cur={cur}
                />;
            })}
            <ViewPick editing={editing} binPick={rearPick} onPick={onPickRear}
                index={binPicks.length} cur={cur}
            />
        </>;
        viewBinPicksNext = <LR cn={undefined} onClick={undefined} label={null}>
            <button className="btn btn-primary" onClick={onNext} disabled={cur <= binPicks.length}>
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

function ViewPick({ editing, binPick, onPick, index, cur }: {
    editing: BinBudsEditing,
    binPick: BinPick;
    onPick: (binPick: BinPick, index: number) => Promise<void>;
    cur: number;
    index: number;
}) {
    useAtomValue(editing.atomChanging);
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
        let val = editing.getValue(binPick.name);
        let vVal: any;
        if (val === undefined) {
            vVal = <span className="text-secondary">-</span>;
        }
        else {
            switch (typeof val) {
                case 'object':
                    vVal = <ViewAtomId id={(val as any).id} />;
                    break;
                default:
                    if (binPick.fromPhraseType === BizPhraseType.options) {
                        let item = (binPick as PickOptions).from.items.find(v => v.id === val);
                        vVal = item.caption ?? item.name;
                    }
                    else {
                        vVal = val;
                    }
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
            <span className={cnLabel}>{binPick.caption}</span>
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
