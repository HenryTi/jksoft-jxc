import { SheetSteps } from "../../Store";
import { ControlSheetDash, ControlSheetStart } from "../../Control";
import { ReturnUseBinPicks } from "../../Store/PickResult";
import { JSX, useCallback } from "react";
import { Page, PageSpinner } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { buttonDefs, headerSheet } from "./HeaderSheet";
import { ToolItem } from "../../View";
import { ViewMainPicks } from "./ViewMainPicks";
import { ViewSteps } from "./ViewSteps";
import { TControlBinPicks } from "./TControlBinPicks";
import { BinRow, EntityBin } from "../../Biz";
import { ControlBinPicks } from "../../Control/ControlBuds";

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
    // protected PageSheetStart() {
    //    return <PageSheetStart control={this} />;
    // }

    protected override PageMainPend(): JSX.Element {
        return <PageMainPend control={this} />;
    }
    protected override PageDirectPend(): JSX.Element {
        return <PageDirectPend control={this} />;
    }
    protected override PageSheetDirect(): JSX.Element {
        return <PageSheetDirect control={this} />;
    }
    protected override PageStartPend(): JSX.Element {
        return <PageStartPend control={this} />;
    }
    protected override PageStartPicks(): JSX.Element {
        return <PageStartPicks control={this} />;
    }

    protected createControlPinPicks(entityBin: EntityBin, initBinRow?: BinRow): ControlBinPicks {
        return new TControlBinPicks(this.controlBiz, this.storeSheet, entityBin, initBinRow);
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


function PageMainPend({ control }: { control: ControlSheetStart; }) {
    const { storeSheet: store, onMainPendPicked, steps } = control;
    const { btnSubmit, btnExit } = buttons(control);
    const group0: ToolItem[] = [btnSubmit];
    let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewSteps sheetSteps={steps} />
        <ViewMainPicks subHeader="新开单据" control={control} onPicked={onMainPendPicked} />
    </Page>;
}

function PageSheetDirect({ control }: { control: ControlSheetStart; }) {
    const { modal, storeSheet } = control;
    const { caption } = storeSheet;
    useEffectOnce(() => {
        (async function () {
            //await nothingPicked(modal, control);
            //await storeSheet.setSheetAsDraft();
        })();
    });
    return <PageSpinner header={caption + ' 创建中...'} />
}

/*
async function onPicked(store: SheetStore, results: ReturnUseBinPicks) {
    const { sheetConsole, mainStore, binStore } = store;
    let ret = await mainStore.startFromPickResults(results);
    if (ret === undefined) {
        if (store.mainId === undefined) {
            // 还没有创建单据
            if (sheetConsole.steps === undefined) {
                setTimeout(() => {
                    sheetConsole.close();
                }, 100);
            }
        }
        return; // 已有单据，不需要pick. 或者没有创建新单据
    }
    sheetConsole.onSheetAdded(store);
}
*/

function buttons(control: ControlSheetStart) {
    let btnSubmit = buttonDefs.submit(undefined, true);
    const navBack = () => control.closeModal();
    let btnExit = buttonDefs.exit(navBack, false);
    return { btnSubmit, btnExit };
}

function PageStartPicks({ control }: { control: ControlSheetStart; }) {
    // const { sheetConsole } = store;
    const { onPickedNew, storeSheet, steps } = control;
    const { btnSubmit, btnExit } = buttons(control);
    const group0: ToolItem[] = [btnSubmit];
    let { header: pageHeader, top, right } = headerSheet({ store: storeSheet, toolGroups: [group0], headerGroup: [btnExit] });
    /*
    async function onPickedNew(results: ReturnUseBinPicks) {
        await control.onPicked(results);
        await control.setSheetAsDraft();
    }
    */
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewSteps sheetSteps={steps} />
        <ViewMainPicks subHeader="新开单据" control={control} onPicked={onPickedNew} />
    </Page>;
}

function PageStartPend({ control }: { control: ControlSheetStart; }) {
    const { storeSheet } = control;
    const { caption } = storeSheet;
    const subCaption = '批选待处理';
    /*
    const onPend = useCallback(async (results: ReturnUseBinPicks) => {
        await control.onPickedNew(results);
        let added = await detailNew(store);
        if (added > 0) {
            await store.setSheetAsDraft();
        }
    }, []);
    */
    const onPend = control.onPickedNew;
    return <Page header={caption + ' - ' + subCaption}>
        {/*<ViewSteps sheetSteps={sheetConsole.steps} />*/}
        <ViewMainPicks subHeader={'批选条件'} control={control} onPicked={onPend} />
    </Page>;
}

function PageDirectPend({ control }: { control: ControlSheetStart; }) {
    const { modal, storeSheet, steps } = control;
    const { caption/*, sheetConsole*/ } = storeSheet;
    const subCaption = '批选待处理';
    /*
    useEffectOnce(() => {
        (async function () {
            await nothingPicked(modal, control);
            let added = await detailNew(store);
            if (added > 0) {
                await control.setSheetAsDraft();
            }
            else {
                await control.discard();
                modal.close();
            }
        })();
    });
    */
    return <Page header={caption + ' - ' + subCaption}>
        <ViewSteps sheetSteps={steps} />
    </Page>;
}

/*
async function nothingPicked(modal: Modal, control: ControlSheetStart) {
    const { storeSheet } = control;
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
    await storeSheet.onPicked(results);
}
*/
