import { BinPick, PickOptions, PickPend } from "app/Biz";
import { useRef, useState } from "react";
import { BinBudsEditing, doBinPick, doBinPickRear, RearPickResultType, ReturnUseBinPicks, SheetStore } from "../../store";
import { getAtomValue } from "tonwa-com";
import { FA, Sep } from "tonwa-com";
import { PickResult, ViewAtomId, ViewBud } from "app/hooks";
import { useAtomValue } from "jotai";
import { BizPhraseType } from "uqs/UqDefault";
import { InputScalar } from "../InputScalar";
import { RowCols } from "app/hooks/tool";
import { PickRow } from "./PickRow";

interface Props {
    subHeader?: string;
    sheetStore: SheetStore;
    onPicked: (results: ReturnUseBinPicks) => Promise<void>;
}

export function ViewMainPicks({ sheetStore, onPicked, subHeader }: Props) {
    const rearPickResultType = RearPickResultType.scalar;
    const { mainStore: main, binStore, sheetConsole } = sheetStore;
    const { steps } = sheetConsole;
    let { current: editing } = useRef(new BinBudsEditing(sheetStore, main.entity, []));
    const [cur, setCur] = useState(0);

    const { binPicks, rearPick } = main.entity;
    let refRearPickResult = useRef(undefined as PickResult[] | PickResult);
    function getNextPick() {
        if (cur < binPicks.length - 1) return binPicks[cur + 1];
        return rearPick;
    }

    function clearTailPicks(curSerial: number) {
        for (let i = curSerial + 1; i < binPicks.length; i++) {
            editing.clearNameValues(binPicks[i].name);
        }
    }

    function afterPicked(curSerial: number) {
        clearTailPicks(curSerial);
        editing.setChanging();
        setCur(curSerial + 1);
        binStore.setReload();
    }

    async function onNext() {
        let rearPickResult = refRearPickResult.current;
        // if (rearPickResult === undefined) return;
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
        viewBinPicksNext = <PickRow label={null} >
            <button className="btn btn-primary my-3" onClick={onNext} disabled={cur < binPicks.length}>
                <FA name="arrow-right me-2" />下一步
            </button>
        </PickRow>;
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
                    editing.setNamedValue(binPick.to[0][0].name, scalarResult as any);
                    let nextPick = getNextPick();
                    afterPicked(serial);
                    if (nextPick.fromPhraseType === BizPhraseType.pend) {
                        await autoPickPend(nextPick as PickPend);
                    }
                }
                async function autoPickPend(nextPick: PickPend) {
                    let pickPend = nextPick as PickPend;
                    const { binStore } = sheetStore;
                    let pendStore = binStore.getPickPendStore(nextPick as PickPend, editing.valueSpace);
                    await pendStore.searchPend();
                    let pendRows = getAtomValue(binStore.atomPendRows);
                    if (pendRows.length === 0) return;
                    let pendRow = pendRows[0];
                    let { to: toArr } = pickPend;
                    for (let [bud, col] of toArr) {
                        let colVal: any;
                        for (let midValue of pendRow.mid) {
                            if (midValue.bud.name === col) {
                                colVal = midValue.value; // pendRow.mid[]
                            }
                        }
                        editing.setNamedValue(bud.name, colVal);
                    }
                    afterPicked(serial + 1);
                    /*
                    let pickResult = await doBinPickRear(binStore, editing, rearPick, rearPickResultType);
                    if (pickResult !== undefined) {
                        refRearPickResult.current = pickResult;
                    }
                    */
                    // 直接写入单据明细
                    binStore.addAllPendRows();
                }
                return <ViewLabelRowPicking cn="d-flex align-items-stretch g-0" caption={caption}>
                    <InputScalar binPick={binPick} onPicked={onPicked} value={defaultValue} />
                </ViewLabelRowPicking>;
            }
            else if (serial < cur) {
                async function pick() {
                    setCur(serial);
                    clearTailPicks(serial);
                    binStore.setReload();
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
        return <PickRow label={caption} cn={cn}
            cnLabel="text-primary fw-bold"
            cnAngle="text-primary" iconPrefix="hand-o-right" >
            {children}
        </PickRow>;
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
        return <PickRow label={binPick.caption} cnAngle="text-success" iconPrefix="check-circle-o">
            <div className="d-flex py-3 cursor-pointer" onClick={pick}>
                <div className="text-secondary flex-fill">
                    {vVal}
                </div>
                {vPencil}
            </div>
        </PickRow>;
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
        return <PickRow label={binPick.caption} cnLabel="text-secondary" cnAngle="text-secondary" iconPrefix="angle-right" >
            <div className="py-3 text-body-tertiery small">-</div>
        </PickRow>;
    }
    function ViewPickRear() {
        useAtomValue(editing.atomChanging);
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
                                return <ViewBud key={bud.id} bud={bud} value={editing.getValue(bud.name)} />;
                            })}
                        </RowCols>
                    </div>
                };
            }
            return <PickRow label={''} cnAngle={cnAngle} iconPrefix={iconPrefix} >
                {vContent}
            </PickRow>;
        }
        else {
            if (serial > cur) return <ViewToPick binPick={rearPick} />;
            async function pick() {
                let pickResult = await doBinPickRear(binStore, editing, rearPick, rearPickResultType);
                if (pickResult !== undefined) {
                    refRearPickResult.current = pickResult;
                    afterPicked(serial + 1);
                }
            }
            if (serial < cur) {
                return <ViewPicked binPick={rearPick} pick={pick} />;
            }
            return <ViewPicking binPick={rearPick} pick={pick} />;
        }
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
