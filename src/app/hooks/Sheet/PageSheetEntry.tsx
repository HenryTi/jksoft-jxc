import dayjs from "dayjs";
import { Page, PageSpinner } from "tonwa-app";
import { from62, setAtomValue, to62, useEffectOnce } from "tonwa-com";
import { ReturnUseBinPicks, SheetStore, useSheetStore } from "./store";
import { useNavigate, useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { PageSheet } from "./PageSheet";
import { useCallback } from "react";
import { useUqApp } from "app";
import { PageMoreCacheData, ToolItem } from "app/coms";
import { buttonDefs, headerSheet } from "./headerSheet";
import { ViewBinPicks } from "./binPick";
import { useDetailAdd } from "./binEdit";

export function pathSE(phrase: number | string) {
    function sheetInPath(phrase: number | string) {
        if (typeof phrase === 'string') {
            if (phrase !== ':sheet') debugger;
            return phrase;
        }
        return to62(phrase);
    }
    return `se/${sheetInPath(phrase)}`;
}

export function PageSEEdit() {
    const store = useSheetStore();
    const loaded = useAtomValue(store.atomLoaded);
    const { id } = useParams();
    const sheetId = from62(id);
    useEffectOnce(() => {
        store.load(sheetId);
    });

    if (loaded === false) return <PageSpinner />;
    return <PageSheet store={store} />;
}

export function PageSENew() {
    const store = useSheetStore();
    const loaded = useAtomValue(store.atomLoaded);
    if (loaded === true) {
        return <PageSheet store={store} />;
    }
    if (store.isPend === true) {
        return <PageStartPend store={store} />;
    }
    if (store.main.entityMain.binPicks !== undefined) {
        return <PageStartPicks store={store} />;
    }
    return <PageSheetDirect store={store} />;
}

function useStartingNO(store: SheetStore) {
    const { main } = store;
    main.no = dayjs(new Date()).format('YYYYMMDD0000');
}

function PageSheetDirect({ store }: { store: SheetStore; }) {
    // no pick, directly create NO
    // useStartingNO(store);
    const { caption } = store;
    useEffectOnce(() => {

    });
    return <PageSpinner header={caption + ' 创建中...'} />
    /*
    return <Page header={caption}>
        <div className="tonwa-bg-gray-1">
            <ViewMain store={store} popup={false} readOnly={true} />
            <div className="px-3 py-3 border-top border-bottom my-3 bg-white">
                <small className="text-secondary text-opacity-50">无明细</small>
            </div>
        </div>
    </Page>;
    */
}

function useOnPicked(store: SheetStore) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    async function onPicked(results: ReturnUseBinPicks) {
        let ret = await store.main.startFromPickResults(results);
        if (ret === undefined) {
            if (store.hasId() === false) {
                // 还没有创建单据
                if (navigate !== undefined) {
                    setTimeout(() => {
                        navigate(-1);
                    }, 100);
                }
            }
            return; // 已有单据，不需要pick. 或者没有创建新单据
        }
        let { id, no } = ret;
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
            // setSheetId(id);
            // setAtomValue(atomSheetId, id);
        }
        // await addDetail();
    }
    return useCallback(onPicked, []);
}

function useButtons() {
    const navigate = useNavigate();
    let btnSubmit = buttonDefs.submit(undefined);
    const navBack = useCallback(async () => {
        navigate(-1);
    }, []);
    let btnExit = buttonDefs.exit(navBack, false);
    setAtomValue(btnSubmit.atomDisabled, true);
    return { btnSubmit, btnExit };
}

function PageStartPicks({ store }: { store: SheetStore; }) {
    const onPicked = useOnPicked(store);
    const { btnSubmit, btnExit } = useButtons();
    const group0: ToolItem[] = [btnSubmit];
    let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    return <Page header={pageHeader} back={null} top={top} right={right}>
        <ViewBinPicks subHeader="开单" sheetStore={store} onPicked={onPicked} />
    </Page>;
}

function PageStartPend({ store }: { store: SheetStore; }) {
    // const modal = useModal();
    const onPicked = useOnPicked(store);
    const addNew = useDetailAdd(store);
    const { caption } = store;
    const subCaption = '批选待处理';
    const onPend = useCallback(async (results: ReturnUseBinPicks) => {
        await onPicked(results);
        await addNew();
    }, []);
    return <Page header={caption + ' - ' + subCaption}>
        <ViewBinPicks subHeader={'批选条件'} sheetStore={store} onPicked={onPend} />
    </Page>
    /*
    useStartingNO(store);
    const { btnSubmit, btnExit } = useButtons();
    const group0: ToolItem[] = [btnSubmit];
    function onPick() {
        async function onPendParamsPicked(results: ReturnUseBinPicks) {
            await onPicked(results);
            modal.close();
        }
        modal.open(<Page header={caption + ' - ' + subCaption}>
            <ViewBinPicks subHeader={'批选条件'} sheetStore={store} onPicked={onPendParamsPicked} />
        </Page>);
    }
    group0.unshift(buttonDefs.batchSelect(onPick));
    const subCaption = '批选待处理';
    let footer = <div className="px-3 py-2">footer</div>;
    let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    return <Page header={pageHeader} back={null} top={top} footer={footer} right={right}>
        <div className="tonwa-bg-gray-1">
            <ViewMain store={store} popup={false} readOnly={true} />
            <div className="px-3 py-3 border-top border-bottom my-3 bg-white">
                <small className="text-secondary text-opacity-50">无明细</small>
            </div>
        </div>
    </Page>;
    */
}
