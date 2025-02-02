import { atom } from "jotai";
import { BinRow, EntityBin, EntitySheet, EnumDetailOperate } from "../../Biz";
import { StoreSheet, SheetMainStore, BinStore, SheetSteps, BinStorePendDirect } from "../../Store";
import { ControllerBiz, ControllerEntity } from "../../Controller";
import { ReturnUseBinPicks } from "../../Store/PickResult";
import { ControllerBinPicks } from "tonwa/Controller/ControllerBuds";

abstract class ControllerSheet extends ControllerEntity<EntitySheet> {
    readonly storeSheet: StoreSheet
    readonly mainStore: SheetMainStore;
    binStore: BinStore;

    constructor(controllerBiz: ControllerBiz, entitySheet: EntitySheet) {
        super(controllerBiz, entitySheet);
        this.storeSheet = new StoreSheet(controllerBiz.storeBiz, entitySheet);
        this.mainStore = new SheetMainStore(this.storeSheet);
        console.log('ControllerSheet', entitySheet.caption, this.keyId);
    }
    async discard() {
        await this.storeSheet.discard();
    }

    createControllerPinPicks(entityBin: EntityBin, initBinRow?: BinRow) {
        return new ControllerBinPicks(this.controllerBiz, this.storeSheet, entityBin, initBinRow);
    }
}

enum EnumSheetNewContent {
    sheet, mainPend, directPend, direct, startPend, startPicks
}
const stepPick = '录入条件';
const stepPend = '批选待处理';
const stepSheet = '录入单据';
function sheetSteps(steps: string[]): SheetSteps {
    return new SheetSteps(steps, stepSheet);
};
export class ControllerSheetNew extends ControllerSheet {
    protected readonly isPend: boolean;
    readonly steps: SheetSteps;

    constructor(controllerBiz: ControllerBiz, entitySheet: EntitySheet) {
        super(controllerBiz, entitySheet);
        const { main, details } = this.entity;
        let len = details.length;
        if (len > 0) {
            let detail = details[0];
            const { bin } = detail;
            this.isPend = bin.pend !== undefined;
            switch (detail.operate) {
                default: this.binStore = new BinStore(this.storeSheet, detail.bin, detail.operate); break;
                case EnumDetailOperate.direct: this.binStore = new BinStorePendDirect(this.storeSheet, detail.bin, detail.operate); break;
            }
        }
        else {
            this.isPend = false;
        }

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

    atomLoaded = atom(false);
    atomContent = atom<EnumSheetNewContent>(get => {
        if (get(this.atomLoaded) === true) return EnumSheetNewContent.sheet;
        const { main, details } = this.entity;
        if (main.pend !== undefined) return EnumSheetNewContent.mainPend;

        const { binPicks, rearPick } = main;
        if (rearPick === undefined && (binPicks === undefined || binPicks.length === 0)) {
            if (this.isPend === true) {
                // sheetConsole.steps = sheetSteps([stepPend]);
                return EnumSheetNewContent.directPend;
            }
            return EnumSheetNewContent.direct;
        }
        if (this.isPend === true) {
            return EnumSheetNewContent.directPend;
        }
    });
    atomSubmitState = atom((get) => {
        //if (this.binStore === undefined) return SubmitState.enable;
        return get(this.binStore.atomSubmitState);
    }, null);

    onPickedNew = async (results: ReturnUseBinPicks) => {
        await this.onPicked(results);
        await this.setSheetAsDraft();
    }

    async onPicked(results: ReturnUseBinPicks) {

    }

    async setSheetAsDraft() {

    }
}

export class ControllerSheetEdit extends ControllerSheet {
}
