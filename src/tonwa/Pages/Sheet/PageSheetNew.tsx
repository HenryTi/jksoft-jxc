import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { Page, PageSpinner, useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { SheetSteps, StoreSheet } from "../../Store";
import { Modal } from "../../UI";
import { ToolItem, ViewCurSiteHeader } from "../../View";
import { ReturnUseBinPicks } from "../../Store/PickResult";
import { ControllerSheetNew } from "./ControllerSheet";
import { buttonDefs, headerSheet } from "./HeaderSheet";
import { ViewSteps } from "./ViewSteps";
import { ViewMainPicks } from "./ViewMainPicks";
import { PageSheet } from "./PageSheet";

const stepPick = '录入条件';
const stepPend = '批选待处理';
const stepSheet = '录入单据';
function sheetSteps(steps: string[]): SheetSteps {
    return new SheetSteps(steps, stepSheet);
};
export function PageSheetNew({ controller }: { controller: ControllerSheetNew }) {
    const { storeSheet: store } = controller;
    // const { sheetConsole } = store;
    const loaded = useAtomValue(store.atomLoaded);
    if (loaded === true) {
        return <PageSheet controller={controller} />;
    }
    const { mainStore, isPend, isMainPend } = store;
    const { entity } = mainStore;
    if (isMainPend === true) {
        return <PageMainPend controller={controller} />;
    }
    const { binPicks, rearPick } = entity;
    if (rearPick === undefined && (binPicks === undefined || binPicks.length === 0)) {
        if (isPend === true) {
            // sheetConsole.steps = sheetSteps([stepPend]);
            return <PageDirectPend controller={controller} />;
        }
        return <PageSheetDirect controller={controller} />;
    }
    if (isPend === true) {
        // sheetConsole.steps = sheetSteps([stepPick, stepPend]);
        return <PageStartPend controller={controller} />;
    }
    if (binPicks !== undefined) {
        // sheetConsole.steps = sheetSteps([stepPick]);
        return <PageStartPicks controller={controller} />;
    }
    return <PageSheetDirect controller={controller} />;
}

function PageMainPend({ controller }: { controller: ControllerSheetNew; }) {
    const { storeSheet: store } = controller;
    // const { sheetConsole } = store;
    // const { btnSubmit, btnExit } = buttons(sheetConsole);
    // const group0: ToolItem[] = [btnSubmit];
    // let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    async function onPickedNew(results: ReturnUseBinPicks) {
        await store.onPicked(results);
        await store.setSheetAsDraft();
        await store.binStore.saveDetailsDirect();
    }
    // header={pageHeader} back={null} top={top} right={right}>
    return <Page header="PageMainPend">
        {/*<ViewSteps sheetSteps={sheetConsole.steps} />*/}
        <ViewMainPicks subHeader="新开单据" controller={controller} onPicked={onPickedNew} />
    </Page>;
    /*
    const { caption } = store;
    return <Page header={caption + ' - 新开'}>
        PageMainPend
    </Page>;
    */
}

function PageSheetDirect({ controller }: { controller: ControllerSheetNew; }) {
    const modal = useModal();
    const { storeSheet } = controller;
    const { caption } = storeSheet;
    useEffectOnce(() => {
        (async function () {
            await nothingPicked(modal, controller);
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

function buttons(controller: ControllerSheetNew) {
    let btnSubmit = buttonDefs.submit(undefined, true);
    const navBack = () => controller.closeModal();
    let btnExit = buttonDefs.exit(navBack, false);
    return { btnSubmit, btnExit };
}

function PageStartPicks({ controller }: { controller: ControllerSheetNew; }) {
    // const { sheetConsole } = store;
    const { storeSheet, onPickedNew, steps } = controller;
    const { btnSubmit, btnExit } = buttons(controller);
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
        <ViewMainPicks subHeader="新开单据" controller={controller} onPicked={onPickedNew} />
    </Page>;
}

function PageStartPend({ controller }: { controller: ControllerSheetNew; }) {
    const { storeSheet } = controller;
    const { caption/*, sheetConsole*/ } = storeSheet;
    const subCaption = '批选待处理';
    const onPend = useCallback(async (results: ReturnUseBinPicks) => {
        await controller.onPicked(results);
        /*
        let added = await detailNew(store);
        if (added > 0) {
            await store.setSheetAsDraft();
        }
        */
    }, []);
    return <Page header={caption + ' - ' + subCaption}>
        {/*<ViewSteps sheetSteps={sheetConsole.steps} />*/}
        <ViewMainPicks subHeader={'批选条件'} controller={controller} onPicked={onPend} />
    </Page>;
}

function PageDirectPend({ controller }: { controller: ControllerSheetNew; }) {
    const modal = useModal();
    const { storeSheet } = controller;
    const { caption/*, sheetConsole*/ } = storeSheet;
    const subCaption = '批选待处理';
    useEffectOnce(() => {
        (async function () {
            await nothingPicked(modal, controller);
            let added: any; // = await detailNew(store);
            if (added > 0) {
                await controller.setSheetAsDraft();
            }
            else {
                await controller.discard();
                modal.close();
            }
        })();
    });
    return <Page header={caption + ' - ' + subCaption}>
        {/*<ViewSteps sheetSteps={sheetConsole.steps} />*/}
    </Page>;
}

async function nothingPicked(modal: Modal, controller: ControllerSheetNew) {
    const { storeSheet } = controller;
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
