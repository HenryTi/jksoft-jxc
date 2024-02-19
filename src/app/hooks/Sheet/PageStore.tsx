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
import { useCallback, useRef, useState } from "react";
import { PickFunc, useBinPicks } from "./binPick";
import { ButtonAsyncIcon } from "app/tool/ButtonAsyncIcon";

let locationState = 1;

async function startSheetStore(uqApp: UqApp, navigate: NavigateFunction, sheetStore: SheetStore, pick: PickFunc) {
    let ret = await sheetStore.start(pick);
    if (ret === undefined) {
        if (sheetStore.main.no === undefined) {
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

export function PageStore({ store, toolbar }: { store: SheetStore; toolbar: JSX.Element; }) {
    const { uq, caption, main, detail, divStore } = store;
    const uqApp = useUqApp();
    const pick = useBinPicks(main.entityMain);
    const { openModal, closeModal } = useModal();
    const navigate = useNavigate();
    const [editable, setEditable] = useState(true);
    const submitState = useAtomValue(divStore.atomSubmitState);

    async function onSubmit() {
        if (main.trigger() === false) return;
        setEditable(false);
        let { checkPend, checkBin } = await uq.SubmitSheet.submitReturns({ id: main.valRow.id });
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
        let { valRow: { id } } = main;
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.removeItem<{ id: number; }>(v => v.id === id) as any;
        }
    }
    async function onDiscardSheet() {
        let message = `${caption} ${main.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await store.discard();
            removeSheetFromCache();
            navigate(-1);
        }
    }

    let { id } = useAtomValue(main._valRow);

    function MainOnlyEdit() {
        let btnSubmit = <ButtonSubmit onClick={onSubmit} />;
        return <>
            <ViewMain main={main} popup={false} />
            <LMR className="px-3 py-3 border-top">
                {btnSubmit}
                {
                    editable === true && <>{id && <ButtonDiscard onClick={onDiscardSheet} />}</>
                }
            </LMR>
        </>;
    }

    function MainDetailEdit() {
        const addNew = useCoreDetailAdd(store);
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
        let btnSubmit: any; // , cnAdd: string;
        if (sections.length === 0 && submitState === SubmitState.hide) {
            // cnAdd = 'btn btn-primary me-3';
        }
        else {
            let disabled = (sections.length === 0 && submitState === SubmitState.none) || submitState === SubmitState.disable;
            btnSubmit = <ButtonSubmit onClick={onSubmit} disabled={disabled} />;
            // cnAdd = 'btn btn-outline-primary me-3';
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
                <ViewMain main={main} popup={false} />
                {vDetail}
                <LMR className="px-3 py-3 border-top tonwa-bg-gray-1">
                    {btnSubmit}
                    {
                        editable === true && <>
                            <ButtonDetail onClick={onAddRow} />
                            {id && <ButtonDiscard onClick={onDiscardSheet} />}
                        </>
                    }
                </LMR>
            </>;
        }
    }

    return <Page header={caption}>
        {toolbar}
        {detail === undefined ? <MainOnlyEdit /> : <MainDetailEdit />}
    </Page>
}

function ButtonSubmit({ onClick, disabled }: { onClick: () => Promise<void>; disabled?: boolean; }) {
    return <ButtonAsyncIcon onClick={onClick} disabled={disabled} icon="send-o">提交</ButtonAsyncIcon>
}

function ButtonDetail({ onClick }: { onClick: () => Promise<void> }) {
    return <ButtonAsyncIcon onClick={onClick} className="btn-outline-primary" icon="plus">明细</ButtonAsyncIcon>;
}

function ButtonDiscard({ onClick }: { onClick: () => Promise<void> }) {
    return <ButtonAsyncIcon onClick={onClick} className="btn-outline-warning" icon="trash-o">作废</ButtonAsyncIcon>;
}
