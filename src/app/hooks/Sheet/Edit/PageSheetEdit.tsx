import { Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { CoreDetail, SheetStore } from "./SheetStore";
import { PickFunc, usePick } from "app/hooks/BizPick";
import { ButtonAsync, FA, LMR, from62, getAtomValue, to62, useEffectOnce, wait } from "tonwa-com";
import { ViewMain } from "./ViewMain";
import { ViewDetail } from "./ViewDetail";
import { useAtomValue } from "jotai";
import { useCoreDetailAdd } from "./useCoreDetailAdd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { UqApp, useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useCallback, useEffect, useRef, useState } from "react";
import { BinPick, EntitySheet } from "app/Biz";
import { NamedResults, PickResultType, ReturnUseBinPicks, useBinPicks } from "./binPick/useBinPicks";

let locationState = 1;
export function PageSheetEdit() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const sheetId = from62(id);
    const [sheetStore, setSheetStore] = useState<SheetStore>();
    const location = useLocation();
    const pick = useBinPicks(entitySheet.main);
    useEffect(() => {
        // 重新开始新建一个单据
        if (!location.state) return;
        let sheetStore = new SheetStore(
            uq,
            biz,
            entitySheet,
            undefined,
        );
        setSheetStore(sheetStore);
        startSheetStore(uqApp, sheetStore, pick);
    }, [location.state]);
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
        })()
    });
    if (sheetStore === undefined) return <PageSpinner header="..." />;
    return <PageStore store={sheetStore} />;
}

async function startSheetStore(uqApp: UqApp, sheetStore: SheetStore, pick: (pickResultType: PickResultType) => Promise<ReturnUseBinPicks>) {
    let ret = await sheetStore.start(pick);
    if (ret === undefined) return; // 已有单据，不需要pick. 或者没有创建新单据
    let { id, no, target } = ret;
    if (id > 0) {
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            const { phrase } = sheetStore.entitySheet;
            data.addItem({
                id,
                no,
                target,
                phrase,
            });
        }
    }
}

function PageStore({ store }: { store: SheetStore; }) {
    const { uq, caption, main, detail } = store;
    const uqApp = useUqApp();
    const pick = useBinPicks(main.entityMain);
    const { openModal, closeModal } = useModal();
    const navigate = useNavigate();
    const [editable, setEditable] = useState(true);

    const addNew = useCoreDetailAdd(detail);
    const start = useCallback(async function () {
        startSheetStore(uqApp, store, pick);
    }, []);
    useEffectOnce(() => {
        start();
    });

    async function onSubmit() {
        setEditable(false);
        await wait(3000);
        let retSubmit = await uq.SubmitSheet.submit({ id: main.binRow.id })
        removeSheetFromCache();
        setEditable(true);
        uqApp.autoRefresh?.();
        let ret = await openModal<boolean>(<Page header="提交成功" back="none">
            <div className="p-3">
                {caption} <b>{main.no}</b> 已提交 {JSON.stringify(retSubmit)}
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={closeModal}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={() => closeModal(true)}>新建{caption}</button>
            </div>
        </Page>);
        if (ret === true) {
            const { entitySheet } = store;
            navigate(`/sheet/${to62(entitySheet.id)}`, { replace: true, state: locationState++ });
        }
        else {
            navigate(-1);
        }
    }

    function removeSheetFromCache() {
        let { binRow: { id } } = main;
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.removeItem<{ id: number; }>(v => v.id === id) as any;
        }
    }

    async function onAddRow() {
        let ret = await addNew();
    }
    async function onRemoveSheet() {
        let message = `${caption} ${main.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await store.discard();
            removeSheetFromCache();
            navigate(-1);
        }
    }

    let sections = useAtomValue(detail._sections);
    let btnSubmit: any, cnAdd: string;
    if (sections.length === 0) {
        cnAdd = 'btn btn-primary me-3';
    }
    else {
        btnSubmit = <ButtonAsync className="btn btn-primary me" onClick={onSubmit} disabled={sections.length === 0}>提交</ButtonAsync>;
        cnAdd = 'btn btn-outline-primary me-3';
    }
    let content: any;
    let { id } = useAtomValue(main._binRow);
    async function startInputDetail() {
        let ret = await start();
        if (ret === undefined) {
            await addNew();
        }
    }
    if (id === 0) {
        content = <div className="p-3">
            <button className="btn btn-primary" onClick={startInputDetail}>开始录单</button>
        </div>;
    }
    else {
        content = <>
            <ViewMain main={main} />
            <ViewDetail detail={detail} editable={editable} />
            <LMR className="px-3 py-3 border-top">
                {btnSubmit}
                {
                    editable === true && <>
                        <button className={cnAdd} onClick={onAddRow}>
                            <FA name="plus" className="me-1" />
                            明细
                        </button>
                        {id && <button className={'btn btn-outline-primary'} onClick={onRemoveSheet}>作废</button>}
                    </>
                }
            </LMR>
        </>;
    }
    return <Page header={caption}>
        {content}
    </Page>
}
