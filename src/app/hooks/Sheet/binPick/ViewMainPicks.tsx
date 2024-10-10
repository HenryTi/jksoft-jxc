import { BinPick, PickOptions } from "app/Biz";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { BinBudsEditing, doBinPick, doBinPickRear, RearPickResultType, ReturnUseBinPicks, SheetStore } from "../store";
import { theme } from "tonwa-com";
import { FA, Sep, SpinnerSmall } from "tonwa-com";
import { PickResult, ViewAtomId } from "app/hooks";
import { useAtomValue } from "jotai";
import { BizPhraseType } from "uqs/UqDefault";
import { InputScalar } from "./InputScalar";

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

    function clearTailPicks(curSerial: number) {
        for (let i = curSerial + 1; i < binPicks.length; i++) {
            editing.clearNameValues(binPicks[i].name);
        }
    }

    function afterPicked(curSerial: number) {
        clearTailPicks(curSerial);
        editing.setChanging();
        setCur(curSerial + 1);
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
        steps?.next();
    }
    let viewBinPicks: any;
    let viewBinPicksNext: any;
    if (binPicks !== undefined) {
        viewBinPicks = <>
            {binPicks.map((v, index) => {
                return <ViewPick key={index} binPick={v} serial={index} />;
            })}
            <ViewPickRear />
        </>;
        viewBinPicksNext = <LabelRow label={null} >
            <button className="btn btn-primary my-3" onClick={onNext} disabled={cur < binPicks.length}>
                <FA name="arrow-right me-2" />下一步
            </button>
        </LabelRow>;
    }
    let vPencil = <div className="ms-3">
        <FA name="search" fixWidth={true} className="small text-info" />
    </div>;
    function ViewPick({ binPick, serial }: { binPick: BinPick; serial: number; }) {
        useAtomValue(editing.atomChanging);
        if (binPick.fromPhraseType === BizPhraseType.any) {
            if (serial === cur) {
                const { caption, name } = binPick;
                const defaultValue = editing.getValue(name);
                async function onPicked(scalarResult: PickResult) {
                    if (scalarResult === undefined) return;
                    editing.setNamedValue(binPick.name, scalarResult as any);
                    afterPicked(serial);
                }
                return <ViewLabelRowPicking cn="d-flex align-items-stretch g-0" caption={caption}>
                    <InputScalar binPick={binPick} onPicked={onPicked} value={defaultValue} />
                </ViewLabelRowPicking>;
            }
            else if (serial < cur) {
                async function pick() {
                    setCur(serial);
                    clearTailPicks(serial);
                    divStore.setReload();
                }
                return <ViewPicked binPick={binPick} pick={pick} />;
            }
        }
        async function pick() {
            if (await doBinPick(editing, binPick) !== undefined) {
                afterPicked(serial);
            }
        }
        if (serial < cur) return <ViewPicked binPick={binPick} pick={pick} />;
        if (serial === cur) {
            return <ViewPicking binPick={binPick} pick={pick} />;
        }
        return <ViewToPick binPick={binPick} />;
    }
    function ViewLabelRowPicking({ cn, children, caption }: { cn?: string; children: any; caption: string; }) {
        return <LabelRow label={caption} cn={cn}
            cnLabel="text-primary fw-bold"
            cnAngle="text-primary" iconPrefix="hand-o-right" >
            {children}
        </LabelRow>;
    }
    function ViewPicked({ binPick, pick }: { binPick: BinPick; pick: () => Promise<void>; }) {
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
        return <LabelRow label={binPick.caption} cnAngle="text-success" iconPrefix="check-circle-o">
            <div className="d-flex py-3 cursor-pointer" onClick={pick}>
                <div className="text-secondary flex-fill">
                    {vVal}
                </div>
                {vPencil}
            </div>
        </LabelRow>;
    }
    function ViewPicking({ binPick, pick }: { binPick: BinPick; pick: () => Promise<void>; }) {
        const { caption } = binPick;
        return <ViewLabelRowPicking caption={caption}>
            <div className="text-secondary flex-fill py-3 cursor-pointer" onClick={pick}>
                <FA name="search" className="text-primary" size="lg" />
            </div>
        </ViewLabelRowPicking>;
    }
    function ViewToPick({ binPick }: { binPick: BinPick; }) {
        return <LabelRow label={binPick.caption} cnLabel="text-secondary" cnAngle="text-secondary" iconPrefix="angle-right" >
            <div className="py-3 text-body-tertiery small">-</div>
        </LabelRow>;
    }
    function ViewPickRear() {
        useAtomValue(editing.atomChanging);
        let serial = binPicks.length;
        async function pick() {
            let pickResult = await doBinPickRear(divStore, editing, rearPick, rearPickResultType);
            if (pickResult !== undefined) {
                refRearPickResult.current = pickResult;
                afterPicked(serial + 1);
            }
        }
        if (serial < cur) {
            return <ViewPicked binPick={rearPick} pick={pick} />;
        }
        if (serial > cur) return <ViewToPick binPick={rearPick} />;
        return <ViewPicking binPick={rearPick} pick={pick} />;
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

function LabelRow({ children, label, cn, iconPrefix, cnAngle, cnLabel }: {
    children: React.ReactNode;
    label?: string;
    cn?: string; iconPrefix?: string; cnAngle?: string; cnLabel?: string;
}) {
    let cnLabelContainer = ' col-3 ' + (label ? 'col-3 tonwa-bg-gray-1 d-flex align-items-center border-end py-3' : '');
    return <>
        <div className={theme.bootstrapContainer}>
            <div className="row">
                <div className={cnLabelContainer}>
                    {label && <>
                        <FA name={iconPrefix} fixWidth={true} className={'me-2 ' + cnAngle} />
                        <div className="flex-fill" />
                        <span className={cnLabel}>{label}</span>
                    </>}
                </div>
                <div className={' col ' + (cn ?? '')}>
                    {children}
                </div>
            </div>
        </div>
        <Sep />
    </>;
}
