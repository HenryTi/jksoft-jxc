import { atom } from "jotai";
import { BinRow, EntityBin, EntitySheet, EnumDetailOperate } from "../../Biz";
import { StoreSheet, SheetMainStore, BinStore, SheetSteps, BinStorePendDirect } from "../../Store";
import { ControlSheet, ControlSheetStart, ControlBiz, ControlEntity } from "../../Control";
import { ReturnUseBinPicks } from "../../Store/PickResult";
import { ControlBinPicks } from "../../Control/ControlBuds";
import { setAtomValue, getAtomValue } from "../../tools";
import { WritableAtom } from "jotai";
import { TControlSheet as TControlSheet } from "./TControlSheet";
import { TControlSheetDash } from "./TControlSheetDash";
import { PageSheetStart } from "./PageSheetStart";

enum EnumSheetNewContent {
    sheet, mainPend, directPend, direct, startPend, startPicks
}
const stepPick = '录入条件';
const stepPend = '批选待处理';
const stepSheet = '录入单据';
function sheetSteps(steps: string[]): SheetSteps {
    return new SheetSteps(steps, stepSheet);
};

export class TControlSheetStart extends ControlSheetStart {
    protected PageSheetStart() {
        return <PageSheetStart control={this} />;
    }
    /*
    protected readonly controlSheetDash: ControlSheetDash;
    readonly atomChanging = atom(1);
    readonly steps: SheetSteps;

    constructor(controlSheetDash: ControlSheetDash) {
        const { controlBiz: controlBiz, entity: entitySheet } = controlSheetDash;
        super(controlBiz, entitySheet);
        this.controlSheetDash = controlSheetDash;
        const { mainStore, isPend, isMainPend } = this.storeSheet;
        const { entity } = mainStore;
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
    */
}
