import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { Page, PageSpinner, useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { SheetSteps, StoreSheet } from "../../Store";
import { Modal } from "../../UI";
import { ToolItem, ViewCurSiteHeader } from "../../View";
import { ReturnUseBinPicks } from "../../Store/PickResult";
import { buttonDefs, headerSheet } from "./HeaderSheet";
import { ViewSteps } from "./ViewSteps";
import { ViewMainPicks } from "./ViewMainPicks";
import { BControlSheetStart } from "../../Control";

const stepPick = '录入条件';
const stepPend = '批选待处理';
const stepSheet = '录入单据';
function sheetSteps(steps: string[]): SheetSteps {
    return new SheetSteps(steps, stepSheet);
};
export function PageSheetStart({ control }: { control: BControlSheetStart }) {
    const { /*atomLoaded, */storeSheet: store } = control;
    // const { sheetConsole } = store;
    /*
    const loaded = useAtomValue(atomLoaded);
    if (loaded === true) {

        return <PageSheetEdit controller={controller} />;
    }
    */
    const { mainStore, isPend, isMainPend } = store;
    const { entity } = mainStore;
    if (isMainPend === true) {
        return <PageMainPend control={control} />;
    }
    const { binPicks, rearPick } = entity;
    if (rearPick === undefined && (binPicks === undefined || binPicks.length === 0)) {
        if (isPend === true) {
            // sheetConsole.steps = sheetSteps([stepPend]);
            return <PageDirectPend control={control} />;
        }
        return <PageSheetDirect control={control} />;
    }
    if (isPend === true) {
        // sheetConsole.steps = sheetSteps([stepPick, stepPend]);
        return <PageStartPend control={control} />;
    }
    if (binPicks !== undefined) {
        // sheetConsole.steps = sheetSteps([stepPick]);
        return <PageStartPicks control={control} />;
    }
    return <PageSheetDirect control={control} />;
}

function PageMainPend({ control }: { control: BControlSheetStart; }) {
    const { storeSheet: store, onMainPendPicked } = control;
    // const { sheetConsole } = store;
    // const { btnSubmit, btnExit } = buttons(sheetConsole);
    // const group0: ToolItem[] = [btnSubmit];
    // let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    // header={pageHeader} back={null} top={top} right={right}>
    return <Page header="PageMainPend">
        {/*<ViewSteps sheetSteps={sheetConsole.steps} />*/}
        <ViewMainPicks subHeader="新开单据" controller={control} onPicked={onMainPendPicked} />
    </Page>;
    /*
    const { caption } = store;
    return <Page header={caption + ' - 新开'}>
        PageMainPend
    </Page>;
    */
}

function PageSheetDirect({ control }: { control: BControlSheetStart; }) {
    const modal = useModal();
    const { storeSheet } = control;
    const { caption } = storeSheet;
    useEffectOnce(() => {
        (async function () {
            await nothingPicked(modal, control);
            await storeSheet.setSheetAsDraft();
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

function buttons(control: BControlSheetStart) {
    let btnSubmit = buttonDefs.submit(undefined, true);
    const navBack = () => control.closeModal();
    let btnExit = buttonDefs.exit(navBack, false);
    return { btnSubmit, btnExit };
}

function PageStartPicks({ control }: { control: BControlSheetStart; }) {
    // const { sheetConsole } = store;
    const { onPickedNew, storeSheet, steps } = control;
    const { btnSubmit, btnExit } = buttons(control);
    const group0: ToolItem[] = [btnSubmit];
    let { header: pageHeader, top, right } = headerSheet({ store: storeSheet, toolGroups: [group0], headerGroup: [btnExit] });
    /*
    async function onPickedNew(results: ReturnUseBinPicks) {
        await controller.onPicked(results);
        await controller.setSheetAsDraft();
    }
    */
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewSteps sheetSteps={steps} />
        <ViewMainPicks subHeader="新开单据" controller={control} onPicked={onPickedNew} />
    </Page>;
}

function PageStartPend({ control }: { control: BControlSheetStart; }) {
    const { storeSheet } = control;
    const { caption/*, sheetConsole*/ } = storeSheet;
    const subCaption = '批选待处理';
    const onPend = useCallback(async (results: ReturnUseBinPicks) => {
        await control.onPickedNew(results);
        /*
        let added = await detailNew(store);
        if (added > 0) {
            await store.setSheetAsDraft();
        }
        */
    }, []);
    return <Page header={caption + ' - ' + subCaption}>
        {/*<ViewSteps sheetSteps={sheetConsole.steps} />*/}
        <ViewMainPicks subHeader={'批选条件'} controller={control} onPicked={onPend} />
    </Page>;
}

function PageDirectPend({ control }: { control: BControlSheetStart; }) {
    const modal = useModal();
    const { storeSheet } = control;
    const { caption/*, sheetConsole*/ } = storeSheet;
    const subCaption = '批选待处理';
    useEffectOnce(() => {
        (async function () {
            await nothingPicked(modal, control);
            let added: any; // = await detailNew(store);
            if (added > 0) {
                // await controller.setSheetAsDraft();
            }
            else {
                await control.discard();
                modal.close();
            }
        })();
    });
    return <Page header={caption + ' - ' + subCaption}>
        {/*<ViewSteps sheetSteps={sheetConsole.steps} />*/}
    </Page>;
}

async function nothingPicked(modal: Modal, control: BControlSheetStart) {
    const { storeSheet } = control;
    let { entity } = storeSheet.mainStore;
    /*
    const budsEditing = new BinEditing(store, entity);
    // const budEditings = budsEditing.createBudEditings();
    const formBudsStore = new FormBudsStore(modal, budsEditing);

    let results: ReturnUseBinPicks = {
        editing: formBudsStore,
        rearBinPick: undefined,
        rearResult: [],
        rearPickResultType: RearPickResultType.scalar,
    };
    await store.onPicked(results);
    */
}
