import { Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { SheetStore, useSheetStore } from "./SheetStore";
import { usePick } from "app/hooks/BizPick";
import { ButtonAsync, FA, LMR, from62, useEffectOnce } from "tonwa-com";
import { ViewMain } from "./ViewMain";
import { ViewDetail } from "./ViewDetail";
import { useAtomValue } from "jotai";
import { useInputSection } from "./useInputSection";
import { useNavigate, useParams } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useCallback, useRef, useState } from "react";
import { EntitySheet } from "app/Biz";

export function PageSheetEdit() {
    const { uq, biz } = useUqApp();
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const sheetId = from62(id);
    const [sheetStore, setSheetStore] = useState<SheetStore>();
    useEffectOnce(() => {
        (async function () {
            let sheetStore = new SheetStore(
                uq,
                biz,
                entitySheet,
                id === undefined ? undefined : sheetId
            );
            await sheetStore.load();
            setSheetStore(sheetStore);
        })();
    });
    if (sheetStore === undefined) return <PageSpinner />;
    return <PageStore store={sheetStore} />;
}

function PageStore({ store }: { store: SheetStore; }) {
    const { caption, main, detail } = store;
    const uqApp = useUqApp();
    const pick = usePick();
    const { openModal } = useModal();
    const navigate = useNavigate();

    const inputSection = useInputSection(detail);
    const start = useCallback(async function () {
        let ret = await main.start(pick);
        if (ret === undefined) return; // 已有单据，不需要pick
        let { id, no, target } = ret;
        if (id > 0) {
            let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
            if (data) {
                const { phrase } = store.entitySheet;
                data.addItem({
                    id,
                    no,
                    target,
                    phrase,
                });
            }
        }
    }, []);
    useEffectOnce(() => {
        start();
    });

    async function onSubmit() {

    }
    async function onAddRow() {
        let ret = await inputSection();
    }
    async function onRemoveSheet() {
        let message = `${caption} ${main.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            let id = await store.discard();
            removeSheetFromCache(id);
            navigate(-1);
        }
        function removeSheetFromCache(sheetId: number) {
            let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
            if (data) {
                data.removeItem<{ id: number; }>(v => v.id === sheetId) as any;
            }
        }
    }

    let sections = useAtomValue(detail._sections);
    let btnSubmit: any, cnAdd: string;
    if (sections.length === 0) {
        cnAdd = 'btn btn-primary me-3';
    }
    else {
        btnSubmit = <ButtonAsync className="btn btn-primary" onClick={onSubmit} disabled={sections.length === 0}>提交</ButtonAsync>;
        cnAdd = 'btn btn-outline-primary me-3';
    }
    console.log('PageSheetEdit');
    let content: any;
    let id = useAtomValue(main._id);
    if (id === 0) {
        content = <div className="p-3">
            <button className="btn btn-primary" onClick={start}>开始录单</button>
        </div>;
    }
    else {
        content = <>
            <ViewMain main={main} />
            <ViewDetail detail={detail} />
            <LMR className="px-3 py-3 border-top">
                <button className={cnAdd} onClick={onAddRow}>
                    <FA name="plus" className="me-1" />
                    明细
                </button>
                {id && <button className={'btn btn-outline-primary'} onClick={onRemoveSheet}>作废</button>}
            </LMR>
        </>;
    }
    return <Page header={caption}>
        {content}
    </Page>
}
