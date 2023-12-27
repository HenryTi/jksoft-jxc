import { Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { SheetStore, SubmitState } from "./store";
import { ButtonAsync, FA, LMR, from62, to62, useEffectOnce } from "tonwa-com";
import { ViewBinDivs, ViewMain } from "./binEdit";
import { ViewDetail } from "./binEdit";
import { useAtomValue } from "jotai";
import { useCoreDetailAdd } from "./binEdit";
import { NavigateFunction, useLocation, useNavigate, useParams } from "react-router-dom";
import { UqApp, useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useCallback, useState } from "react";
import { EntitySheet } from "app/Biz";
import { PickFunc, useBinPicks } from "./binPick/useBinPicks";

let locationState = 1;
export function PageSheetEdit() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const sheetId = from62(id);
    const [sheetStore, setSheetStore] = useState<SheetStore>();
    const location = useLocation();
    const navigate = useNavigate();
    const pick = useBinPicks(entitySheet.main);
    /*
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
        startSheetStore(uqApp, navigate, sheetStore, pick);
    }, [location.state]);
    */
    useEffectOnce(() => {
        (async function () {
            let sheetStore = new SheetStore(
                uq,
                biz,
                entitySheet,
                id === undefined ? undefined : sheetId
            );
            await sheetStore.load();
            await startSheetStore(uqApp, navigate, sheetStore, pick);
            setSheetStore(sheetStore);
        })()
    });
    if (sheetStore === undefined) return <PageSpinner header="..." />;
    return <PageStore store={sheetStore} />;
}

async function startSheetStore(uqApp: UqApp, navigate: NavigateFunction, sheetStore: SheetStore, pick: PickFunc) {
    let ret = await sheetStore.start(pick);
    if (ret === undefined) {
        if (sheetStore.main.no === undefined) {
            // 还没有创建单据
            // if (navigate !== undefined) navigate(-1);
        }
        return; // 已有单据，不需要pick. 或者没有创建新单据
    }
    let { id, no, target } = ret;
    if (id > 0) {
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            const { id: entityId } = sheetStore.entitySheet;
            data.addItem({
                id,
                no,
                target,
                entityId,
            });
        }
    }
}

function PageStore({ store }: { store: SheetStore; }) {
    const { uq, caption, main, detail, divStore } = store;
    const uqApp = useUqApp();
    // divStore.namedResults = undefined;
    const pick = useBinPicks(main.entityMain);
    const { openModal, closeModal } = useModal();
    const navigate = useNavigate();
    const [editable, setEditable] = useState(true);
    const submitState = useAtomValue(divStore.atomSubmitState);

    async function onSubmit() {
        if (main.trigger() === false) return;
        setEditable(false);
        let { checkPend, checkBin } = await uq.SubmitSheet.submitReturns({ id: main.binRow.id });
        if (checkPend.length + checkBin.length > 0) {
            alert('pendOverflow:' + JSON.stringify(checkPend) + JSON.stringify(checkBin));
            return;
        }
        removeSheetFromCache();
        setEditable(true);
        uqApp.autoRefresh?.();
        let ret = await openModal<boolean>(<Page header="提交成功" back="none">
            <div className="p-3">
                {caption} <b>{main.no}</b> 已提交 {JSON.stringify(checkPend)} {JSON.stringify(checkBin)}
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
    async function onRemoveSheet() {
        let message = `${caption} ${main.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await store.discard();
            removeSheetFromCache();
            navigate(-1);
        }
    }

    let { id } = useAtomValue(main._binRow);

    function MainOnlyEdit() {
        let btnSubmit = <ButtonAsync className="btn btn-primary me" onClick={onSubmit}>提交</ButtonAsync>;
        return <>
            <ViewMain main={main} />
            <LMR className="px-3 py-3 border-top">
                {btnSubmit}
                {
                    editable === true && <>
                        {id && <button className={'btn btn-outline-primary'} onClick={onRemoveSheet}>作废</button>}
                    </>
                }
            </LMR>
        </>;
    }

    function MainDetailEdit() {
        const addNew = useCoreDetailAdd(detail);
        const start = useCallback(async function () {
            startSheetStore(uqApp, navigate, store, pick);
        }, []);
        async function startInputDetail() {
            let ret = await start();
            if (ret === undefined) {
                await addNew();
            }
        }
        async function onAddRow() {
            let ret = await addNew();
        }
        let sections = useAtomValue(detail._sections);
        let btnSubmit: any, cnAdd: string;
        if (sections.length === 0 && submitState === SubmitState.hide) {
            cnAdd = 'btn btn-primary me-3';
        }
        else {
            let disabled = (sections.length === 0 && submitState === SubmitState.none) || submitState === SubmitState.disable;
            btnSubmit = <ButtonAsync className="btn btn-primary me" onClick={onSubmit} disabled={disabled}>提交</ButtonAsync>;
            cnAdd = 'btn btn-outline-primary me-3';
        }
        if (id === 0) {
            return <div className="p-3">
                <button className="btn btn-primary" onClick={startInputDetail}>开始录单</button>
            </div>;
        }
        else {
            const { divStore } = store;
            const { binDiv } = divStore;
            let vDetail: any;
            if (binDiv.div === undefined) {
                vDetail = <ViewDetail detail={detail} editable={editable} />;
            }
            else {
                vDetail = <ViewBinDivs divStore={divStore} editable={editable} />;
            }
            return <>
                <ViewMain main={main} />
                {vDetail}
                <LMR className="px-3 py-3 border-top tonwa-bg-gray-1">
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
    }

    return <Page header={caption}>
        {detail === undefined ? <MainOnlyEdit /> : <MainDetailEdit />}
    </Page>
}
