import { useRef, useState, JSX } from "react";
import { FA, Sep } from "tonwa-com";
import { useAtomValue } from "jotai";
import { PickResult, RearPickResultType, ReturnUseBinPicks } from "../../Store/PickResult";
import { BinPick, BizPhraseType, EnumDetailOperate, PickOptions, PickPend } from "../../Biz";
import { RowCols, ViewBud } from "../../View";
import { ViewAtomId } from "../../View/Form/ViewAtomId";
import { getAtomValue } from "../../tools";
import { PickRow } from "./PickRow";
import { ControllerSheetNew } from "./ControllerSheet";
import { InputScalar } from "./InputScalar";

interface Props {
    subHeader?: string;
    controller: ControllerSheetNew;
    onPicked: (results: ReturnUseBinPicks) => Promise<void>;
}

export function ViewMainPicks({ controller, onPicked, subHeader }: Props) {
    // const modal = useModal();
    const rearPickResultType = RearPickResultType.scalar;
    const { storeSheet, mainStore: main, binStore, steps/*, sheetConsole*/ } = controller;
    const { entity: entityBin } = main;
    const { current: controllerBinPicks } = useRef(controller.createControllerPinPicks(entityBin));
    const { formBudsStore } = controllerBinPicks;
    // const { steps } = sheetConsole;
    // let { current: formBudsStore } = useRef(new FormBudsStore(modal, new BinBudsEditing(storeSheet, main.entity, [])));
    // let formBudsStore: any;
    // let { budsEditing } = formBudsStore;
    const [cur, setCur] = useState(0);

    const { binPicks, rearPick } = entityBin;
    let refRearPickResult = useRef(undefined as PickResult[] | PickResult);
    function getNextPick() {
        if (cur < binPicks.length - 1) return binPicks[cur + 1];
        return rearPick;
    }

    function clearTailPicks(curSerial: number) {
        for (let i = curSerial + 1; i < binPicks.length; i++) {
            // formBudsStore.clearNameValues(binPicks[i].name);
        }
    }

    function afterPicked(curSerial: number) {
        clearTailPicks(curSerial);
        controller.setChanging();
        setCur(curSerial + 1);
        binStore.setReload();
    }

    async function onNext() {
        let rearPickResult = refRearPickResult.current;
        // if (rearPickResult === undefined) return;
        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];
        let ret: ReturnUseBinPicks = {
            editing: formBudsStore,
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
        const [message, setMessage] = useState(undefined as string);
        useAtomValue(controller.atomChanging);
        if (binPick.fromPhraseType === BizPhraseType.any) {
            if (serial === cur) {
                const { caption, name } = binPick;
                const defaultValue = formBudsStore.getValue(name);
                async function onPicked(scalarResult: PickResult) {
                    if (scalarResult === undefined) return;
                    formBudsStore.setNamedValue(binPick.to[0][0].name, scalarResult as any);
                    formBudsStore.setNamedValue(binPick.name, scalarResult as any);
                    let nextPick = getNextPick();
                    afterPicked(serial);
                    if (nextPick.fromPhraseType === BizPhraseType.pend) {
                        await autoPickPend(nextPick as PickPend);
                    }
                }
                async function autoPickPend(nextPick: PickPend) {
                    let pickPend = nextPick as PickPend;
                    const { binStore, mainStore } = storeSheet;
                    const { atomPendRows, operate, entity } = binStore;
                    const { divLevels } = entity;
                    let pendStore = binStore.getPickPendStore(nextPick as PickPend);
                    const { paramsEditing } = pendStore;
                    for (let bud of mainStore.entity.buds) {
                        let { name } = bud;
                        let editingValue = formBudsStore.getValue(name);
                        paramsEditing.setNamedValues(name, editingValue);
                    }
                    await pendStore.searchPend();
                    let pendRows = getAtomValue(atomPendRows);
                    if (pendRows.length === 0) {
                        setMessage('无待处理');
                        return;
                    }
                    let pendRow = pendRows[0];
                    let { to: toArr } = pickPend;
                    for (let [bud, col] of toArr) {
                        let colVal: any;
                        for (let midValue of pendRow.mid) {
                            if (midValue.bud.name === col) {
                                colVal = midValue.value; // pendRow.mid[]
                            }
                        }
                        formBudsStore.setNamedValue(bud.name, colVal);
                    }
                    afterPicked(serial + 1);
                    // 直接写入单据明细
                    switch (operate) {
                        default:
                        case EnumDetailOperate.default:
                            if (divLevels <= 1) {
                                await binStore.addAllPendRowsDirect();
                            }
                            else {
                                binStore.addAllPendRowsToSelect();
                            }
                            break;
                        case EnumDetailOperate.direct:
                            await binStore.addAllPendRowsDirect();
                            break;
                        case EnumDetailOperate.pend:
                            binStore.addAllPendRowsToSelect();
                            break;
                        case EnumDetailOperate.scan:
                            break;
                    }
                }
                return <ViewLabelRowPicking cn="d-flex align-items-stretch g-0" caption={caption} message={message}>
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
            if (await controllerBinPicks.doBinPick(binPick) !== undefined) {
                afterPicked(serial);
            }
            /*
            if (await doBinPick(formBudsStore, binPick) !== undefined) {
                afterPicked(serial);
            }
            */
        }
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
        useAtomValue(controller.atomChanging);
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
                                return <ViewBud key={bud.id} bud={bud} value={formBudsStore.getValue(bud.name)} />;
                            })}
                        </RowCols>
                    </div>
                };
            }
            return <PickRow label={''} cnAngle={cnAngle} iconPrefix={iconPrefix} >
                {vContent}
            </PickRow>;
        }
        if (serial > cur) return <ViewToPick binPick={rearPick} />;
        async function pick() {
            // let pickResult; // = await doBinPickRear(binStore, formBudsStore, rearPick, rearPickResultType);
            // let controllerBinPicks: ControllerBinPicks = controller.createControllerPinPicks(entityBin);
            let pickResult = await controllerBinPicks.doBinPickRear(rearPickResultType);
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
