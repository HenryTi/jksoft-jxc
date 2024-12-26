import { Page, PageSpinner, useModal } from "tonwa-app";
import { useEffectOnce } from "tonwa-com";
import { RearPickResultType, ReturnUseBinPicks, SheetConsole, SheetSteps, SheetStore } from "../store";
import { useAtomValue } from "jotai";
import { PageSheet } from "./PageSheet";
import { useCallback } from "react";
import { ToolItem } from "app/coms";
import { buttonDefs, headerSheet } from "../headerSheet";
import { ViewMainPicks } from "../binPick";
import { ViewSteps } from "./ViewSteps";
import { detailNew } from "../binEdit";

export function PageSheetEdit({ store, sheetId, readonly }: { store: SheetStore; sheetId: number; readonly?: boolean; }) {
    const loaded = useAtomValue(store.atomLoaded);
    useEffectOnce(() => {
        store.load(sheetId);
    });
    if (loaded === false) return <PageSpinner />;
    return <PageSheet store={store} readonly={readonly} />;
}

const stepPick = '录入条件';
const stepPend = '批选待处理';
const stepSheet = '录入单据';
function sheetSteps(steps: string[]): SheetSteps {
    return new SheetSteps(steps, stepSheet);
};
export function PageSheetNew({ store }: { store: SheetStore; }) {
    const { sheetConsole } = store;
    const loaded = useAtomValue(store.atomLoaded);
    if (loaded === true) {
        return <PageSheet store={store} />;
    }
    const { mainStore, isPend, isMainPend } = store;
    const { entity } = mainStore;
    if (isMainPend === true) {
        return <PageMainPend store={store} />;
    }
    const { binPicks, rearPick } = entity;
    if (rearPick === undefined && (binPicks === undefined || binPicks.length === 0)) {
        if (isPend === true) {
            sheetConsole.steps = sheetSteps([stepPend]);
            return <PageDirectPend store={store} />;
        }
        return <PageSheetDirect store={store} />;
    }
    if (isPend === true) {
        sheetConsole.steps = sheetSteps([stepPick, stepPend]);
        return <PageStartPend store={store} />;
    }
    if (binPicks !== undefined) {
        sheetConsole.steps = sheetSteps([stepPick]);
        return <PageStartPicks store={store} />;
    }
    return <PageSheetDirect store={store} />;
}

function PageMainPend({ store }: { store: SheetStore; }) {
    const { sheetConsole } = store;
    const { btnSubmit, btnExit } = buttons(sheetConsole);
    const group0: ToolItem[] = [btnSubmit];
    let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    async function onPickedNew(results: ReturnUseBinPicks) {
        await onPicked(store, results);
        await store.setSheetAsDraft();
        await store.binStore.saveDetailsDirect();
    }
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
        <ViewMainPicks subHeader="新开单据" sheetStore={store} onPicked={onPickedNew} />
    </Page>;
    /*
    const { caption } = store;
    return <Page header={caption + ' - 新开'}>
        PageMainPend
    </Page>;
    */
}

function PageSheetDirect({ store }: { store: SheetStore; }) {
    const { caption } = store;
    useEffectOnce(() => {
        (async function () {
            await nothingPicked(store);
            await store.setSheetAsDraft();
        })();
    });
    return <PageSpinner header={caption + ' 创建中...'} />
}

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

function buttons(sheetConsole: SheetConsole) {
    let btnSubmit = buttonDefs.submit(undefined, true);
    const navBack = () => sheetConsole.close();
    let btnExit = buttonDefs.exit(navBack, false);
    return { btnSubmit, btnExit };
}

function PageStartPicks({ store }: { store: SheetStore; }) {
    const { sheetConsole } = store;
    const { btnSubmit, btnExit } = buttons(sheetConsole);
    const group0: ToolItem[] = [btnSubmit];
    let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    async function onPickedNew(results: ReturnUseBinPicks) {
        await onPicked(store, results);
        await store.setSheetAsDraft();
    }
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
        <ViewMainPicks subHeader="新开单据" sheetStore={store} onPicked={onPickedNew} />
    </Page>;
}

function PageStartPend({ store }: { store: SheetStore; }) {
    const { caption, sheetConsole } = store;
    const subCaption = '批选待处理';
    const onPend = useCallback(async (results: ReturnUseBinPicks) => {
        await onPicked(store, results);
        let added = await detailNew(store);
        if (added > 0) {
            await store.setSheetAsDraft();
        }
    }, []);
    return <Page header={caption + ' - ' + subCaption}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
        <ViewMainPicks subHeader={'批选条件'} sheetStore={store} onPicked={onPend} />
    </Page>;
}

function PageDirectPend({ store }: { store: SheetStore; }) {
    const modal = useModal();
    const { caption, sheetConsole } = store;
    const subCaption = '批选待处理';
    useEffectOnce(() => {
        (async function () {
            await nothingPicked(store);
            let added = await detailNew(store);
            if (added > 0) {
                await store.setSheetAsDraft();
            }
            else {
                await store.discard();
                modal.close();
            }
        })();
    });
    return <Page header={caption + ' - ' + subCaption}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
    </Page>;
}

async function nothingPicked(store: SheetStore) {
    let { budsEditing: editing } = store.mainStore;
    let results: ReturnUseBinPicks = {
        editing,
        rearBinPick: undefined,
        rearResult: [],
        rearPickResultType: RearPickResultType.scalar,
    };
    await onPicked(store, results);
}
