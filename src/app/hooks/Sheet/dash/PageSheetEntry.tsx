import { Page, PageSpinner } from "tonwa-app";
import { setAtomValue, useEffectOnce } from "tonwa-com";
import { ReturnUseBinPicks, SheetConsole, SheetStore } from "../store";
import { useAtomValue } from "jotai";
import { PageSheet } from "./PageSheet";
import { useCallback } from "react";
import { useUqApp } from "app";
import { PageMoreCacheData, ToolItem } from "app/coms";
import { buttonDefs, headerSheet } from "../headerSheet";
import { ViewBinPicks } from "../binPick";
import { useDetailAdd } from "../binEdit";
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

export function PageSheetNew({ store }: { store: SheetStore; }) {
    const { sheetConsole } = store;
    const loaded = useAtomValue(store.atomLoaded);
    if (loaded === true) {
        return <PageSheet store={store} />;
    }
    if (store.isPend === true) {
        sheetConsole.steps = {
            steps: ['录入条件', '批选待处理'],
            end: "录入单据",
            step: 0,
        };
        return <PageStartPend store={store} />;
    }
    if (store.main.entityBin.binPicks !== undefined) {
        sheetConsole.steps = {
            steps: ['录入条件'],
            end: "录入单据",
            step: 0,
        };
        return <PageStartPicks store={store} />;
    }
    return <PageSheetDirect store={store} />;
}

function PageSheetDirect({ store }: { store: SheetStore; }) {
    const { caption } = store;
    useEffectOnce(() => {

    });
    return <PageSpinner header={caption + ' 创建中...'} />
}

function useOnPicked(store: SheetStore) {
    const uqApp = useUqApp();
    // const navigate = useNavigate();
    const { sheetConsole } = store;
    async function onPicked(results: ReturnUseBinPicks) {
        let ret = await store.main.startFromPickResults(results);
        if (ret === undefined) {
            if (store.hasId() === false) {
                // 还没有创建单据
                if (sheetConsole.steps === undefined) {
                    setTimeout(() => {
                        sheetConsole.close();
                    }, 100);
                }
                /*
                if (navigate !== undefined) {
                    setTimeout(() => {
                        navigate(-1);
                    }, 100);
                }
                */
            }
            return; // 已有单据，不需要pick. 或者没有创建新单据
        }
        // let { id, no } = ret;
        sheetConsole.onSheetAdded(store/*id, no*/);
        /*
        if (id > 0) {
            let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
            if (data) {
                const { id: entityId } = store.entitySheet;
                data.addItem({
                    id,
                    no,
                    entityId,
                });
            }
        }
        */
    }
    return useCallback(onPicked, []);
}

function useButtons(sheetConsole: SheetConsole) {
    //const navigate = useNavigate();
    let btnSubmit = buttonDefs.submit(undefined);
    const navBack = useCallback(async () => {
        sheetConsole.close();
        // navigate(-1);
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
        // setAtomValue(store.atomLoaded, true);
    }
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
        <ViewBinPicks subHeader="新开单据" sheetStore={store} onPicked={onPicked} />
    </Page>;
}

function PageStartPend({ store }: { store: SheetStore; }) {
    const onPicked = useOnPicked(store);
    const addNew = useDetailAdd(store);
    const { caption, sheetConsole } = store;
    const subCaption = '批选待处理';
    const onPend = useCallback(async (results: ReturnUseBinPicks) => {
        await onPicked(results);
        let added = await addNew();
        if (added === true) {
            await store.setSheetAsDraft();
            // setAtomValue(store.atomLoaded, true);
        }
    }, []);
    return <Page header={caption + ' - ' + subCaption}>
        <ViewSteps sheetSteps={sheetConsole.steps} />
        <ViewBinPicks subHeader={'批选条件'} sheetStore={store} onPicked={onPend} />
    </Page>;
}
