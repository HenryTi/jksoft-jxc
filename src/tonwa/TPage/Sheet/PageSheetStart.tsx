import { useCallback } from "react";
import { useAtomValue } from "jotai";
import { Page, PageSpinner, useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { SheetSteps, StoreSheet } from "../../Store";
import { Modal } from "../../UI";
import { ToolItem, ViewCurSiteHeader } from "../../View";
import { RearPickResultType, ReturnUseBinPicks } from "../../Store/PickResult";
import { buttonDefs, headerSheet } from "./HeaderSheet";
import { ViewSteps } from "./ViewSteps";
import { ViewMainPicks } from "./ViewMainPicks";
import { ControlSheetStart } from "../../Control";
import { BinEditing, FormBudsStore } from "../../Control/ControlBuds/BinEditing";
/*
const stepPick = '录入条件';
const stepPend = '批选待处理';
const stepSheet = '录入单据';
function sheetSteps(steps: string[]): SheetSteps {
    return new SheetSteps(steps, stepSheet);
};
export function PageSheetStart({ control }: { control: ControlSheetStart }) {
    const { storeSheet: store } = control;
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

function PageMainPend({ control }: { control: ControlSheetStart; }) {
    const { storeSheet: store, onMainPendPicked } = control;
    // const { sheetConsole } = store;
    // const { btnSubmit, btnExit } = buttons(sheetConsole);
    // const group0: ToolItem[] = [btnSubmit];
    // let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    // header={pageHeader} back={null} top={top} right={right}>
    return <Page header="PageMainPend">
        {<ViewSteps sheetSteps={sheetConsole.steps} />}
        <ViewMainPicks subHeader="新开单据" control={control} onPicked={onMainPendPicked} />
    </Page>;
}

function PageSheetDirect({ control }: { control: ControlSheetStart; }) {
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
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewSteps sheetSteps={steps} />
        <ViewMainPicks subHeader="新开单据" control={control} onPicked={onPickedNew} />
    </Page>;
}

function PageStartPend({ control }: { control: ControlSheetStart; }) {
    const { storeSheet } = control;
    const { caption } = storeSheet;
    const subCaption = '批选待处理';
    const onPend = useCallback(async (results: ReturnUseBinPicks) => {
        await control.onPickedNew(results);
    }, []);
    return <Page header={caption + ' - ' + subCaption}>
        {<ViewSteps sheetSteps={sheetConsole.steps} />}
        <ViewMainPicks subHeader={'批选条件'} control={control} onPicked={onPend} />
    </Page>;
}

function PageDirectPend({ control }: { control: ControlSheetStart; }) {
    const modal = useModal();
    const { storeSheet } = control;
    const { caption} = storeSheet;
    const subCaption = '批选待处理';
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
    return <Page header={caption + ' - ' + subCaption}>
        {<ViewSteps sheetSteps={sheetConsole.steps} />}
    </Page>;
}

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