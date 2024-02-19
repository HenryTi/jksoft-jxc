import { Page, useModal } from "tonwa-app";
import { ViewMain } from "./binEdit";
import { useCoreDetailAdd } from "./binEdit";
import { useNavigate } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useState } from "react";
import { ViewBinPicks, ReturnUseBinPicks } from "./binPick";
import { PageStore } from "./PageStore";
import { useSheet } from "./useSheet";

export function PageSheetNew() {
    /*
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    // const sheetId = from62(id);
    const { current: sheetStore } = useRef(new SheetStore(
        uq,
        biz,
        entitySheet,
        undefined
    ));
    */
    const modal = useModal();
    const uqApp = useUqApp();
    const [sheetId, setSheetId] = useState(undefined);
    const returnUseSheet = useSheet();
    const { sheetStore, toolbar } = returnUseSheet;

    const navigate = useNavigate();
    const addDetail = useCoreDetailAdd(sheetStore);
    //const pick = useBinPicks(entitySheet.main);
    //const startCallback = useCallback(async function () {
    // let sheetStore = ;
    // await sheetStore.load();
    // await startSheetStore(uqApp, navigate, sheetStore, pick);
    // let ret = await modal.open(<PageBinPicks sheetStore={sheetStore} rearPickResultType={RearPickResultType.array} />);
    /*
    if (ret === undefined) {
        setSheetStore(null);
        return;
    }
    */
    // setSheetStore(sheetStore);
    //}, []);
    //useEffectOnce(() => {
    //    startCallback();
    //});
    async function onPicked(results: ReturnUseBinPicks) {
        let ret = await sheetStore.main.startFromPickResults(results);
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
            setSheetId(id);
        }
        await addDetail();
    }
    const { header, back, buttons: { submit, discard, exit } } = returnUseSheet;
    if (sheetId === undefined) {
        const { main } = sheetStore;
        let d = new Date().toISOString();
        let index = d.indexOf('T');
        main.no = `${d.substring(0, index)}-0000`;
        submit.disabled = true;
        discard.hidden = true;
        if (sheetStore.isPend() === true) {
            const subCaption = '批选待处理';
            let vSelectBatch = <div className="px-3 py-3 d-flex border-bottom">
                <button className="btn btn-outline-primary" onClick={onPick}>
                    {subCaption}
                </button>
            </div>;
            return <Page header={header} back={back}>
                <div className="tonwa-bg-gray-1">
                    {toolbar}
                    {vSelectBatch}
                    <ViewMain main={main} popup={false} readOnly={true} />
                    <div className="px-3 py-3 border-top border-bottom my-3 bg-white">
                        <small className="text-secondary text-opacity-50">无明细</small>
                    </div>
                </div>
            </Page>;
            function onPick() {
                modal.open(<Page header={header + ' - ' + subCaption}>
                    <ViewBinPicks subHeader={'批选条件'} sheetStore={sheetStore} onPicked={onPicked} />
                </Page>);
            }
        }
        else {
            return <Page header={header + ' - 开单'} back={back}>
                {toolbar}
                <ViewBinPicks subHeader={'开单条件'} sheetStore={sheetStore} onPicked={onPicked} />
            </Page>;
        }
    }
    else {
        submit.disabled = false;
        discard.hidden = false;
        return <PageStore store={sheetStore} toolbar={toolbar} />;
    }
}
