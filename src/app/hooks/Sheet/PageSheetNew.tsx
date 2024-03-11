import { Page, useModal } from "tonwa-app";
import { ViewMain } from "./binEdit";
import { useCoreDetailAdd } from "./binEdit";
import { useNavigate } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData, ToolItem } from "app/coms";
import { useRef, useState } from "react";
import { ViewBinPicks, ReturnUseBinPicks } from "./binPick";
import { useSheetHeader, useSheetStore } from "./useSheetStore";
import { headerSheet, buttonDefs } from "./headerSheet";
import { SheetStore } from "./store";
import { PageSheet } from "./PageSheet";
import { WritableAtom, atom, useAtomValue } from "jotai";
import { setAtomValue } from "tonwa-com";

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
    const { current: atomSheetId } = useRef(atom(undefined as number)); // useState(undefined);
    const store = useSheetStore();
    const sheetId = useAtomValue(atomSheetId);
    //const { sheetStore, toolbar } = returnUseSheet;

    if (sheetId !== undefined) return <PageSheet store={store} />;
    return <SheetNew store={store} atomSheetId={atomSheetId} />;
}

function SheetNew({ store, atomSheetId }: { store: SheetStore; atomSheetId: WritableAtom<number, any, any> }) {
    const modal = useModal();
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const addDetail = useCoreDetailAdd(store);
    const { header, back } = useSheetHeader(store);
    let btnSubmit = buttonDefs.submit(undefined);
    let btnExit = buttonDefs.exit(async () => navigate(-1), false);
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
            setAtomValue(atomSheetId, id);
        }
        await addDetail();
    }
    const { main } = store;
    let d = new Date().toISOString();
    let index = d.indexOf('T');
    main.no = `${d.substring(0, index)}-0000`;
    setAtomValue(btnSubmit.atomDisabled, true);
    // let toolbar = <Toolbar groups={[[btnSubmit], null, [btnExit]]} />;
    const group0: ToolItem[] = [btnSubmit];
    let { header: pageHeader, top, right } = headerSheet({ store, toolGroups: [group0], headerGroup: [btnExit] });
    if (store.isPend() === true) {
        group0.unshift(buttonDefs.batchSelect(onPick));
        const subCaption = '批选待处理';
        let footer = <div className="px-3 py-2">footer</div>;
        return <Page header={pageHeader} back={null} top={top} footer={footer} right={right}>
            <div className="tonwa-bg-gray-1">
                <ViewMain main={main} popup={false} readOnly={true} />
                <div className="px-3 py-3 border-top border-bottom my-3 bg-white">
                    <small className="text-secondary text-opacity-50">无明细</small>
                </div>
            </div>
        </Page>;
        function onPick() {
            modal.open(<Page header={header + ' - ' + subCaption}>
                <ViewBinPicks subHeader={'批选条件'} sheetStore={store} onPicked={onPicked} />
            </Page>);
        }
    }
    else if (store.main.entityMain.binPicks !== undefined) {
        return <Page header={pageHeader} back={null} top={top} right={right}>
            <ViewBinPicks subHeader="开单" sheetStore={store} onPicked={onPicked} />
        </Page>;
    }
    else {
        return <PageSheet store={store} />;
    }
}
