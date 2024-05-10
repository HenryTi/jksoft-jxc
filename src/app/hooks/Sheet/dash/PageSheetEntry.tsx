import { Page, PageSpinner } from "tonwa-app";
import { setAtomValue, useEffectOnce } from "tonwa-com";
import { RearPickResultType, ReturnUseBinPicks, SheetConsole, SheetSteps, SheetStore } from "../store";
import { useAtomValue } from "jotai";
import { PageSheet } from "./PageSheet";
import { useCallback } from "react";
import { useUqApp } from "app";
import { ToolItem } from "app/coms";
import { buttonDefs, headerSheet } from "../headerSheet";
import { ViewBinPicks } from "../binPick";
import { useDetailNew } from "../binEdit";
import { ViewSteps } from "./ViewSteps";

export function PageSheetEdit({ store, sheetId, readonly }: { store: SheetStore; sheetId: number; readonly?: boolean; }) {
    // const store = useSheetStore(entitySheet, sheetConsole);
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
    const { main, isPend } = store;
    const { entityBin } = main;
    const { binPicks, rearPick } = entityBin;
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

function PageSheetDirect({ store }: { store: SheetStore; }) {
    const onPicked = useOnPicked(store);
    const { caption } = store;
    useEffectOnce(() => {
        (async function () {
            let results: ReturnUseBinPicks = {
                namedResults: {
                    '%user': store.userProxy,
                    'user': store.userProxy,
                },
                rearBinPick: undefined,
                rearResult: [],
                rearPickResultType: RearPickResultType.scalar,
            };
            await onPicked(results);
            // let added = await detailNew();
            //if (added === true) {
            await store.setSheetAsDraft();
            //}
        })();
    });
    return <PageSpinner header={caption + ' 创建中...'} />
}

function useOnPicked(store: SheetStore) {
    const { sheetConsole, main } = store;
    async function onPicked(results: ReturnUseBinPicks) {
        let ret = await main.startFromPickResults(results);
        if (ret === undefined) {
            if (store.hasId() === false) {
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
    return useCallback(onPicked, []);
}

function useButtons(sheetConsole: SheetConsole) {
    let btnSubmit = buttonDefs.submit(undefined);
    const navBack = useCallback(async () => {
        sheetConsole.close();
    }, []);
    let btnExit = buttonDefs.exit(navBack, false);
    setAtomValue(btnSubmit.atomDisabled, true);
    return { btnSubmit, btnExit };
}

function PageStartPicks({ store }: { store: SheetStore; }) {
    const { sheetConsole } = store;
    const retUseOnPicked = useOnPicked(store);
    const { btnSubmit, btnExit } = useButtons(sheetConsole);
    const group0: ToolItem[] = [btnSubmit];
    let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    async function onPicked(results: ReturnUseBinPicks) {
        await retUseOnPicked(results);
        await store.setSheetAsDraft();
    }
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
        <ViewBinPicks subHeader="新开单据" sheetStore={store} onPicked={onPicked} />
    </Page>;
}

function PageStartPend({ store }: { store: SheetStore; }) {
    const onPicked = useOnPicked(store);
    const detailNew = useDetailNew(store);
    const { caption, sheetConsole } = store;
    const subCaption = '批选待处理';
    const onPend = useCallback(async (results: ReturnUseBinPicks) => {
        await onPicked(results);
        let added = await detailNew();
        if (added === true) {
            await store.setSheetAsDraft();
        }
    }, []);
    return <Page header={caption + ' - ' + subCaption}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
        <ViewBinPicks subHeader={'批选条件'} sheetStore={store} onPicked={onPend} />
    </Page>;
}

function PageDirectPend({ store }: { store: SheetStore; }) {
    const onPicked = useOnPicked(store);
    const detailNew = useDetailNew(store);
    const { caption, sheetConsole } = store;
    const subCaption = '批选待处理';
    useEffectOnce(() => {
        (async function () {
            let results: ReturnUseBinPicks = {
                namedResults: {
                    '%user': store.userProxy,
                    'user': store.userProxy,
                },
                rearBinPick: undefined,
                rearResult: [],
                rearPickResultType: RearPickResultType.scalar,
            };
            await onPicked(results);
            let added = await detailNew();
            if (added === true) {
                await store.setSheetAsDraft();
            }
        })();
    });
    return <Page header={caption + ' - ' + subCaption}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
    </Page>;
}
