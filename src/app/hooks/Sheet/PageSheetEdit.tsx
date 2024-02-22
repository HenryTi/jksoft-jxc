import { SheetStore } from "./store";
import { useEffectOnce } from "tonwa-com";
import { NavigateFunction } from "react-router-dom";
import { UqApp, useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useCallback } from "react";
import { PickFunc } from "./binPick";
import { useSheetStore } from "./useSheetStore";
import { Page, PageSpinner } from "tonwa-app";
import { PageSheet } from "./PageSheet";
import { useAtomValue } from "jotai";

let locationState = 1;
export function PageSheetEdit() {
    // const uqApp = useUqApp();
    // const { uq, biz } = uqApp;
    /*
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const sheetId = from62(id);
    const { current: sheetStore } = useRef(new SheetStore(
        uq,
        biz,
        entitySheet,
        sheetId
    ));
    */
    const sheetStore = useSheetStore();
    const loaded = useAtomValue(sheetStore.atomLoaded);
    const startCallback = useCallback(async function () {
        await sheetStore.load();
    }, []);
    useEffectOnce(() => {
        startCallback();
    });
    if (loaded === false) return <PageSpinner />;
    return <PageSheet store={sheetStore} />;
    /*
    let { view, toolbar } = useSheetView(sheetStore);
    return <Page header={header} back={back}>
        {toolbar}
        {view}
    </Page>
    */
    // return <PageStore store={sheetStore} toolbar={toolbar} />;
}

async function startSheetStore(uqApp: UqApp, navigate: NavigateFunction, sheetStore: SheetStore, pick: PickFunc) {
    let ret = await sheetStore.start(pick);
    if (ret === undefined) {
        if (sheetStore.hasId() === false) {
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
            const { id: entityId } = sheetStore.entitySheet;
            data.addItem({
                id,
                no,
                entityId,
            });
        }
    }
}
