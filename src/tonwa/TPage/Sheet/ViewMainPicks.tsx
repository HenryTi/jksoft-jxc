import { useState, JSX } from "react";
import { FA, Sep } from "tonwa-com";
import { useAtomValue } from "jotai";
import { PickResult, ReturnUseBinPicks } from "../../Store/PickResult";
import { BinPick, BizPhraseType, PickOptions } from "../../Biz";
import { RowCols, ViewBud } from "../../View";
import { ViewAtomId } from "../../View/Form/ViewAtomId";
import { PickRow } from "./PickRow";
import { InputScalar } from "./InputScalar";
import { ControlSheetStart } from "../../Control";

interface Props {
    subHeader?: string;
    control: ControlSheetStart;
    onPicked: (results: ReturnUseBinPicks) => Promise<void>;
}

export function ViewMainPicks({ control, subHeader, onPicked }: Props) {
    const { storeSheet, mainStore: main, binStore, steps, controlBinPicks, atomCur, atomChanging } = control;
    const cur = useAtomValue(atomCur);
    if (controlBinPicks === undefined) return null;
    const { entity: entityBin } = main;
    const { formBudsStore } = controlBinPicks;
    const { binPicks, rearPick } = entityBin;

    async function onNext() {
        await control.onNextMainPicks(onPicked);
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
        viewBinPicksNext = <PickRow label={null} >
            <button className="btn btn-primary my-3" onClick={onNext} disabled={cur <= binPicks.length}>
                <FA name="arrow-right me-2" />下一步
            </button>
        </PickRow>;
    }
    let vPencil = <div className="ms-3">
        <FA name="search" fixWidth={true} className="small text-info" />
    </div>;
    function ViewPick({ binPick, serial }: { binPick: BinPick; serial: number; }) {
        const [message, setMessage] = useState(undefined as string);
        useAtomValue(atomChanging);
        if (binPick.fromPhraseType === BizPhraseType.any) {
            if (serial === cur) {
                const { caption, name } = binPick;
                const defaultValue = formBudsStore.getValue(name);
                async function onPicked(scalarResult: PickResult) {
                    await control.onPickedInputScalar(binPick, serial, scalarResult, setMessage);
                }
                return <ViewLabelRowPicking cn="d-flex align-items-stretch g-0" caption={caption} message={message}>
                    <InputScalar binPick={binPick} onPicked={onPicked} value={defaultValue} />
                </ViewLabelRowPicking>;
            }
            else if (serial < cur) {
                async function pick() { control.picked(serial); }
                return <ViewPicked binPick={binPick} pick={pick} />;
            }
        }
        async function pick() { await control.pick(binPick, serial); }
        if (serial < cur) return <ViewPicked binPick={binPick} pick={pick} />;
        if (serial === cur) {
            return <ViewPicking binPick={binPick} pick={pick} message={message} />;
        }
        return <ViewToPick binPick={binPick} />;
    }
    function ViewLabelRowPicking({ cn, children, caption, message }: { cn?: string; children: any; caption: string; message?: string | JSX.Element; }) {
        return <PickRow label={caption} cn={cn}
            cnLabel="text-primary fw-bold"
            cnAngle="text-primary" iconPrefix="hand-o-right" message={message}>
            {children}
        </PickRow>;
    }
    function ViewPicked({ binPick, pick }: { binPick: BinPick; pick: () => Promise<void>; }) {
        let val = formBudsStore.getValue(binPick.name);
        let vVal: any = val;
        if (val === undefined) {
            vVal = <span className="text-secondary">-</span>;
        }
        else if (binPick.fromPhraseType === BizPhraseType.options) {
            vVal = (binPick as PickOptions).itemCaptionFromId(val);
        }
        else if (typeof val === 'object') {
            vVal = <ViewAtomId id={(val as any).id} />;
        }
        return <PickRow label={binPick.caption} cnAngle="text-success" iconPrefix="check-circle-o">
            <div className="d-flex py-3 cursor-pointer" onClick={pick}>
                <div className="text-secondary flex-fill">
                    {vVal}
                </div>
                {vPencil}
            </div>
        </PickRow>;
    }
    function ViewPicking({ binPick, pick, message }: { binPick: BinPick; pick: () => Promise<void>; message?: string | JSX.Element; }) {
        const { caption } = binPick;
        return <ViewLabelRowPicking caption={caption} message={message}>
            <div className="text-secondary flex-fill py-3 cursor-pointer" onClick={pick}>
                <FA name="search" className="text-primary" size="lg" />
            </div>
        </ViewLabelRowPicking>;
    }
    function ViewToPick({ binPick }: { binPick: BinPick; }) {
        return <PickRow label={binPick.caption} cnLabel="text-secondary" cnAngle="text-secondary" iconPrefix="angle-right" >
            <div className="py-3 text-body-tertiery small">-</div>
        </PickRow>;
    }
    function ViewPickRear() {
        useAtomValue(control.atomChanging);
        let serial = binPicks.length;
        if (rearPick.fromPhraseType === BizPhraseType.pend) {
            let cnAngle: string, iconPrefix: string, vContent: any;
            if (serial > cur) {
                // to pick
                cnAngle = "text-secondary";
                iconPrefix = "angle-right";
                vContent = <div className="py-3 text-body-tertiery small">-</div>;
            }
            else {
                cnAngle = "text-success";
                iconPrefix = "check-circle-o";
                const { to } = rearPick;
                if (to === undefined) {
                    vContent = "Picked";
                }
                else {
                    vContent = <div className="py-2">
                        <RowCols>
                            {to.map(([bud]) => {
                                let v = formBudsStore.getValue(bud.name);
                                return <ViewBud key={bud.id} bud={bud} value={v} />;
                            })}
                        </RowCols>
                    </div>
                };
            }
            return <PickRow label={''} cnAngle={cnAngle} iconPrefix={iconPrefix} >
                {vContent}
            </PickRow>;
        }
        async function pickRear() {
            await control.pickRear(serial);
        }
        if (serial > cur) return <ViewToPick binPick={rearPick} />;
        if (serial < cur) {
            return <ViewPicked binPick={rearPick} pick={pickRear} />;
        }
        return <ViewPicking binPick={rearPick} pick={pickRear} />;
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
