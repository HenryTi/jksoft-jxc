import { atom } from "jotai";
import { BinPick, BinRow, BizPhraseType, EntityBin, EntitySheet, EnumDetailOperate, PickPend } from "../../Biz";
import { StoreSheet, SheetMainStore, BinStore, SheetSteps, BinStorePendDirect } from "../../Store";
import { ControlBiz, ControlEntity } from "..";
import { PickResult, RearPickResultType, ReturnUseBinPicks } from "../../Store/PickResult";
import { ControlBinPicks } from "../ControlBuds";
import { setAtomValue, getAtomValue } from "../../tools";
import { WritableAtom } from "jotai";
import { ControlSheet as ControlSheet } from "./ControlSheet";
import { ControlSheetDash } from "./ControlSheetDash";
import { JSX } from "react";
import { BinEditing, FormBudsStore } from "../ControlBuds/BinEditing";

enum EnumSheetNewContent {
    sheet, mainPend, directPend, direct, startPend, startPicks
}
const stepPick = '录入条件';
const stepPend = '批选待处理';
const stepSheet = '录入单据';
function sheetSteps(steps: string[]): SheetSteps {
    return new SheetSteps(steps, stepSheet);
};

export abstract class ControlSheetStart extends ControlSheet {
    protected readonly controlSheetDash: ControlSheetDash;
    readonly atomChanging = atom(1);
    readonly atomCur = atom(0);         // pick main 的操作顺序
    readonly steps: SheetSteps;
    readonly controlBinPicks: ControlBinPicks;
    readonly rearPickResultType = RearPickResultType.scalar;
    refRearPickResult: PickResult[] | PickResult;

    constructor(controlSheetDash: ControlSheetDash) {
        const { controlBiz: controlBiz, entity: entitySheet } = controlSheetDash;
        super(controlBiz, entitySheet);
        this.controlSheetDash = controlSheetDash;
        const { mainStore, isPend, isMainPend } = this.storeSheet;
        const { entity } = mainStore;
        this.controlBinPicks = this.createControlPinPicks(entity);
        let enumSheetNewContent: EnumSheetNewContent;
        if (isMainPend === true) {
            enumSheetNewContent = EnumSheetNewContent.mainPend; // return <PageMainPend store={store} />;
        }
        else {
            const { binPicks, rearPick } = entity;
            if (rearPick === undefined && (binPicks === undefined || binPicks.length === 0)) {
                if (isPend === true) {
                    this.steps = sheetSteps([stepPend]);
                    enumSheetNewContent = EnumSheetNewContent.directPend;
                    // return <PageDirectPend store={store} />;
                }
                else {
                    enumSheetNewContent = EnumSheetNewContent.direct;
                    // return <PageSheetDirect store={store} />;
                }
            }
            else if (isPend === true) {
                this.steps = sheetSteps([stepPick, stepPend]);
                enumSheetNewContent = EnumSheetNewContent.startPend;
                // return <PageStartPend store={store} />;
            }
            else if (binPicks !== undefined) {
                this.steps = sheetSteps([stepPick]);
                enumSheetNewContent = EnumSheetNewContent.startPicks;
                // return <PageStartPicks store={store} />;
            }
            else {
                enumSheetNewContent = EnumSheetNewContent.direct;
                // return <PageSheetDirect store={store} />;
            }
        }
    }

    // atomLoaded = atom(false);
    atomContent = atom<EnumSheetNewContent>(get => {
        // if (get(this.atomLoaded) === true) return EnumSheetNewContent.sheet;
        const { isPend } = this.storeSheet;
        const { main, details } = this.entity;
        if (main.pend !== undefined) return EnumSheetNewContent.mainPend;

        const { binPicks, rearPick } = main;
        if (rearPick === undefined && (binPicks === undefined || binPicks.length === 0)) {
            if (isPend === true) {
                // sheetConsole.steps = sheetSteps([stepPend]);
                return EnumSheetNewContent.directPend;
            }
            return EnumSheetNewContent.direct;
        }
        if (isPend === true) {
            return EnumSheetNewContent.directPend;
        }
    });

    atomSubmitState = atom((get) => {
        //if (this.binStore === undefined) return SubmitState.enable;
        return get(this.binStore.atomSubmitState);
    }, null);

    createControlPinPicks(entityBin: EntityBin, initBinRow?: BinRow) {
        return new ControlBinPicks(this.controlBiz, this.storeSheet, entityBin, initBinRow);
    }

    setChanging() {
        setAtomValue(this.atomChanging, getAtomValue(this.atomChanging) + 1);
    }

    onMainPendPicked = async (results: ReturnUseBinPicks) => {
        await this.controlSheetDash.onMainPendPicked(results);
    }

    onPickedNew = async (results: ReturnUseBinPicks) => {
        await this.controlSheetDash.onPickedNew(results);
    }

    async onPicked(results: ReturnUseBinPicks) {
        return await this.controlSheetDash.onPicked(results);
    }

    async setSheetAsDraft() {
        this.storeSheet.setSheetAsDraft();
    }

    async start(): Promise<number> {
        let sheetId: number;
        const { /*atomLoaded, */storeSheet: store } = this;
        const { mainStore, isPend, isMainPend } = store;
        const { entity } = mainStore;
        if (isMainPend === true) {
            sheetId = await this.openModal(this.PageMainPend());
            return sheetId;
        }
        const { binPicks, rearPick } = entity;
        if (rearPick === undefined && (binPicks === undefined || binPicks.length === 0)) {
            if (isPend === true) {
                // sheetConsole.steps = sheetSteps([stepPend]);
                sheetId = await this.openModalAsync(this.PageDirectPend(), this.startDirectPend());
                return sheetId;
            }
            sheetId = await this.openModalAsync(this.PageSheetDirect(), this.startSheetDirect());
            return sheetId;
        }
        if (isPend === true) {
            sheetId = await this.openModalAsync(this.PageStartPend(), this.startPend());
            return sheetId;
        }
        if (binPicks !== undefined) {
            sheetId = await this.openModalAsync(this.PageStartPicks(), this.startPicks());
            return sheetId;
        }
        sheetId = await this.openModalAsync(this.PageSheetDirect(), this.startSheetDirect());
        return sheetId;
    }

    // protected abstract PageSheetStart(): JSX.Element;
    protected abstract PageMainPend(): JSX.Element;
    protected abstract PageDirectPend(): JSX.Element;
    protected abstract PageSheetDirect(): JSX.Element;
    protected abstract PageStartPend(): JSX.Element;
    protected abstract PageStartPicks(): JSX.Element;

    private async startDirectPend(): Promise<void> {
        const { storeSheet, modal } = this;
        let { entity } = storeSheet.mainStore;
        const budsEditing = new BinEditing(storeSheet, entity);
        // const budEditings = budsEditing.createBudEditings();
        const formBudsStore = new FormBudsStore(modal, budsEditing);

        let results: ReturnUseBinPicks = {
            editing: formBudsStore,
            rearBinPick: undefined,
            rearResult: [],
            rearPickResultType: RearPickResultType.scalar,
        };
        let ret = await this.onPicked(results);
        if (ret === undefined) {
            if (this.steps === undefined) {
                setTimeout(() => {
                    this.closeModal();
                }, 100);
            }
        }
    }

    private async startSheetDirect(): Promise<void> {
        // await nothingPicked(modal, control);
        //await storeSheet.setSheetAsDraft();
    }

    private async startPend(): Promise<void> {
    }

    private async startPicks(): Promise<void> {
    }

    onNextMainPicks = async () => {
        const { binPicks, rearPick } = this.mainStore.entity;
        const { formBudsStore } = this.controlBinPicks;
        let rearPickResult = this.refRearPickResult;
        // if (rearPickResult === undefined) return;
        let rearResult: PickResult[] = Array.isArray(rearPickResult) === false ?
            [rearPickResult as PickResult] : rearPickResult as PickResult[];
        let ret: ReturnUseBinPicks = {
            editing: formBudsStore,
            rearBinPick: rearPick,           // endmost pick
            rearResult,
            rearPickResultType: this.rearPickResultType,
        };
        await this.onPickedNew(ret);
        this.steps?.next();
    }


    async pick(binPick: BinPick, serial: number) {
        if (await this.controlBinPicks.doBinPick(binPick) !== undefined) {
            this.afterPicked(serial);
        }
        /*
        if (await doBinPick(formBudsStore, binPick) !== undefined) {
            afterPicked(serial);
        }
        */
    }

    async picked(serial: number) {
        setAtomValue(this.atomCur, serial);
        this.clearTailPicks(serial);
        this.binStore.setReload();
    }

    async pickRear(serial: number) {
        // let pickResult; // = await doBinPickRear(binStore, formBudsStore, rearPick, rearPickResultType);
        // let controlBinPicks: ControllerBinPicks = control.createControllerPinPicks(entityBin);
        let pickResult = await this.controlBinPicks.doBinPickRear(this.rearPickResultType);
        if (pickResult !== undefined) {
            this.refRearPickResult = pickResult;
            this.afterPicked(serial + 1);
        }
    }

    private afterPicked(curSerial: number) {
        this.clearTailPicks(curSerial);
        this.setChanging();
        // setCur(curSerial + 1);
        setAtomValue(this.atomCur, curSerial + 1);
        this.binStore.setReload();
    }

    private clearTailPicks(curSerial: number) {
        const { binPicks } = this.mainStore.entity;
        const { formBudsStore } = this.controlBinPicks;
        for (let i = curSerial + 1; i < binPicks.length; i++) {
            formBudsStore.clearNameValues(binPicks[i].name);
        }
    }

    async onPickedInputScalar(binPick: BinPick
        , serial: number
        , scalarResult: PickResult
        , setMessage: (message: string) => void) {
        if (scalarResult === undefined) return;
        const { formBudsStore } = this.controlBinPicks;
        formBudsStore.setNamedValue(binPick.to[0][0].name, scalarResult as any);
        formBudsStore.setNamedValue(binPick.name, scalarResult as any);
        let nextPick = this.getNextPick();
        this.afterPicked(serial);
        if (nextPick.fromPhraseType !== BizPhraseType.pend) return;
        {
            await this.autoPickPend(serial, nextPick as PickPend, setMessage);
        }
    }

    private getNextPick() {
        const { binPicks, rearPick } = this.mainStore.entity;
        const cur = getAtomValue(this.atomCur);
        if (cur < binPicks.length - 1) return binPicks[cur + 1];
        return rearPick;
    }

    private async autoPickPend(serial: number, nextPick: PickPend, setMessage: (message: string) => void) {
        let pickPend = nextPick as PickPend;
        const { binStore, mainStore } = this.storeSheet;
        const { atomPendRows, entity, operate } = binStore;
        const { divLevels } = entity;
        let pendStore = binStore.getPickPendStore(nextPick as PickPend);
        const { paramsEditing } = pendStore;
        const { formBudsStore } = this.controlBinPicks;
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
        this.afterPicked(serial + 1);
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
}
