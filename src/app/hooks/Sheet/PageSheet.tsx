import { Page, PageConfirm, useModal } from "tonwa-app";
import { SheetStore, SubmitState } from "./store";
import { to62 } from "tonwa-com";
import { ViewBinDivs, ViewMain } from "./binEdit";
import { ViewDetail } from "./binEdit";
import { useAtomValue } from "jotai";
import { useCoreDetailAdd } from "./binEdit";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { UqApp, useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useCallback, useState } from "react";
import { PickFunc, useBinPicks } from "./binPick";
import { useSheetHeader } from "./useSheetStore";
import { headerSheet, buttonDefs } from "./headerSheet";

export function PageSheet({ store }: { store: SheetStore; }) {
    let { header, top, view, right } = useSheetView(store);
    return <Page header={header} back={null} top={top} right={right}>
        {view}
    </Page>
}

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

function useSheetView(store: SheetStore) {
    const { uq, main, detail, divStore } = store;
    const { header, back } = useSheetHeader(store);
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
                {header} <b>{main.no}</b> 已提交 {JSON.stringify(checkPend)} {JSON.stringify(checkBin)}
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={closeModal}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={() => closeModal(true)}>新建{header}</button>
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
        let message = `${header} ${main.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await store.discard();
            removeSheetFromCache();
            navigate(-1);
        }
    }
    async function onExit() {
        navigate(-1);
    }
    function onPrint() {
        alert('正在实现中...');
    }

    let { id } = useAtomValue(main._valRow);
    let btnPrint = buttonDefs.print(onPrint);
    let btnExit = buttonDefs.exit(onExit, false);
    let headerGroup = [btnExit];

    function mainOnlyEdit() {
        let btnSubmit = buttonDefs.submit(onSubmit);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, true, editable === false);
        let toolGroups = [[btnPrint, btnSubmit], null, [btnDiscard]];
        return {
            toolGroups,
            view: <ViewMain main={main} popup={false} />
        };
    }

    function mainDetailEdit() {
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
        let submitDisabled: boolean = true, submitHidden: boolean;
        if (sections.length === 0 && submitState === SubmitState.hide) {
            submitHidden = true;
        }
        else {
            submitHidden = false;
            let disabled = (sections.length === 0 && submitState === SubmitState.none) || submitState === SubmitState.disable;
            submitDisabled = disabled;
        }
        let btnSubmit = buttonDefs.submit(onSubmit, submitDisabled, submitHidden);
        let btnAddDetail = buttonDefs.addDetail(onAddRow);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, false, editable === false);
        let toolGroups = [[btnAddDetail, btnPrint, btnSubmit], null, [btnDiscard]];
        if (id === 0) {
            return {
                toolGroups,
                view: <div className="p-3">
                    <button className="btn btn-primary" onClick={startInputDetail}>开始录单</button>
                </div>
            };
        }
        const { divStore } = store;
        const { binDiv } = divStore;
        return {
            toolGroups,
            view: <>
                <ViewMain main={main} popup={false} />
                {
                    binDiv.div === undefined ?
                        <ViewDetail detail={detail} editable={editable} />
                        :
                        <ViewBinDivs divStore={divStore} editable={editable} />
                }
            </>
        };
    }

    const { toolGroups, view } = (detail === undefined ? mainOnlyEdit() : mainDetailEdit());
    return {
        ...headerSheet({ store, toolGroups, headerGroup }),
        view: view,
    };
}
