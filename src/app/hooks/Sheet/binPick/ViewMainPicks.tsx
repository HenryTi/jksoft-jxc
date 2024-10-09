import { BinPick, PickOptions } from "app/Biz";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";
import { BinBudsEditing, doBinPick, doBinPickRear, RearPickResultType, ReturnUseBinPicks, SheetStore } from "../store";
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

    async function onPick(binPick: BinPick, serial: number) {
        if (await doBinPick(editing, binPick) === undefined) {
            // if (await editing.runBinPick(binPick) === undefined) {
            return;
        }
        afterPicked(serial);
        /*
        for (let i = index + 1; i < binPicks.length; i++) {
            editing.clearNameValues(binPicks[i].name);
        }
        editing.setChanging();
        setCur(index + 1);
        divStore.setReload();
        */
    }
    async function onPickRear(binPick: BinPick) {
        let pickResult = await doBinPickRear(divStore, editing, binPick, rearPickResultType);
        if (pickResult === undefined) return;
        // refRearPickResult.current = pickResult;
        // editing.setNamedValues(binPick.name, pickResult);
        afterPicked(binPicks.length + 1);
        /*
        editing.setChanging();
        setCur(binPicks.length + 1);
        divStore.setReload();
        */
    }
    function afterPicked(curSerial: number) {
        let serial = curSerial + 1;
        for (let i = serial; i < binPicks.length; i++) {
            editing.clearNameValues(binPicks[i].name);
        }
        editing.setChanging();
        setCur(serial);
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
                return <ViewPick key={index} binPick={v} serial={index} />;
            })}
            <ViewPickRear />
        </>;
        viewBinPicksNext = <LabelRow label={null} >
            <button className="btn btn-primary my-3" onClick={onNext} disabled={cur <= binPicks.length}>
                <FA name="arrow-right me-2" />下一步
            </button>
        </LabelRow>;
    }
    let vPencil = <div className="ms-3">
        <FA name="search" fixWidth={true} className="small text-info" />
    </div>;
    function ViewPick({ binPick, serial }: { binPick: BinPick; serial: number; }) {
        useAtomValue(editing.atomChanging);
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
        // function onClick() {
        // onPick(binPick, serial);
        // clearSerialAfter(serial + 1);
        // editing.setChanging();
        //setCur(serial);
        // }
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
        function ViewLabelRowPicking({ cn, children }: { cn?: string; children: any; }) {
            return <LabelRow label={binPick.caption} cn={cn}
                cnLabel="text-primary fw-bold"
                cnAngle="text-primary" iconPrefix="hand-o-right" >
                {children}
            </LabelRow>;
        }
        // let vContent: any, cn: string;
        if (binPick.fromPhraseType === BizPhraseType.any) {
            function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
                if (e.key === 'Enter') {
                    // onClick();
                    pick();
                }
            }
            function onChange(e: ChangeEvent<HTMLInputElement>) {
                // editing.setBudComposingValue(binPick, e.currentTarget.value);
            }
            return <ViewLabelRowPicking cn="d-flex">
                <input className="border-0 px-2 ms-n2 me-n2 flex-fill" type="text"
                    onKeyDown={onKeyDown}
                    onChange={onChange} />
            </ViewLabelRowPicking>
        }
        // cn = ' cursor-pointer ' + py;
        /*
        async function onClick() {
            await onPicking(binPick, serial);
        }
        */
        return <ViewLabelRowPicking>
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
/*
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
    // const py = ' py-3 ';
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
        vContent = <div className="d-flex py-3 cursor-pointer" onClick={onClick}>
            <div className="text-secondary flex-fill">
                {vVal}
            </div>
            {vPencil}
        </div>;
        // cn = ' cursor-pointer ' + py;
        cnLabel = '';
        cnAngle = ' text-success ';
        iconPrefix = 'check-circle-o';
    }
    else if (index === cur) {
        switch (binPick.fromPhraseType) {
            case BizPhraseType.any:
                cn = ' d-flex ';
                vContent = <ViewInputStr />;
                break;
            default:
                // cn = ' cursor-pointer ' + py;
                vContent = <div className="text-secondary flex-fill py-3 cursor-pointer" onClick={onClick}>
                    <FA name="search" className="text-primary" size="lg" />
                </div>;
                break;
        }
        cnLabel = ' text-primary fw-bold ';
        cnAngle = ' text-primary ';
        iconPrefix = 'hand-o-right';
    }
    else {
        vContent = <div className="small text-secondary py-3">-</div>;
        // cn = py;
        cnLabel = ' text-secondary ';
        cnAngle = ' text-secondary ';
        iconPrefix = 'angle-right';
    }
    if (isPicking === true) {
        vContent = <div className="py-3"><SpinnerSmall /></div>;
    }
    return <></>;

    function ViewInputStr() {
        function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
            if (e.key === 'Enter') {
                onClick();
            }
        }
        function onChange(e: ChangeEvent<HTMLInputElement>) {
            // editing.setBudComposingValue(binPick, e.currentTarget.value);
        }
        return <input className="border-0 px-2 ms-n2 me-n2 flex-fill" type="text"
            onKeyDown={onKeyDown}
            onChange={onChange} />;
    }
}
*/
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
