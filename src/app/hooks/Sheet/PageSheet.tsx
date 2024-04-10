import { Page, PageConfirm, useModal } from "tonwa-app";
import { DivStore, SheetStore, SubmitState } from "./store";
import { to62 } from "tonwa-com";
import { ViewDiv, ViewMain } from "./binEdit";
import { atom, useAtomValue } from "jotai";
import { useDetailAdd } from "./binEdit";
import { useNavigate } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { PageMoreCacheData } from "app/coms";
import { useCallback, useState } from "react";
import { PickFunc, useBinPicks } from "./binPick";
import { headerSheet, buttonDefs } from "./headerSheet";

export function PageSheet({ store, readonly }: { store: SheetStore; readonly?: boolean }) {
    const { uq, main, detail, divStore, caption } = store;
    const uqApp = useUqApp();
    const pick = useBinPicks(main.entityMain);
    const { openModal, closeModal } = useModal();
    const navigate = useNavigate();
    const [editable, setEditable] = useState(true);
    let submitState = useAtomValue(divStore.atomSubmitState);
    const addNew = useDetailAdd(store);
    const start = useStartSheetStore(store, pick);

    async function onSubmit() {
        if (main.trigger() === false) return;
        if (divStore.trigger() === false) return;
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
    let toolGroups: any[][], view: any;
    function mainOnlyEdit() {
        let btnSubmit = buttonDefs.submit(onSubmit);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, true, editable === false);
        toolGroups = [[btnPrint, btnSubmit], null, [btnDiscard]];
        view = <ViewMain store={store} popup={false} readOnly={readonly} />;
    }

    function mainDetailEdit() {
        async function startInputDetail() {
            let ret = await start();
            if (ret === undefined) {
                await addNew();
            }
        }
        async function onAddRow() {
            await addNew();
        }
        let submitHidden: boolean;
        submitHidden = false;
        let submitDisabled = atom(get => {
            submitState = get(divStore.atomSubmitState);
            return submitState === SubmitState.none || submitState === SubmitState.disable;
        });
        let btnSubmit = buttonDefs.submit(onSubmit, submitDisabled, submitHidden);
        let btnAddDetail = detail.entityBin.pend === undefined ?
            buttonDefs.addDetail(onAddRow) : buttonDefs.addPend(onAddRow);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, false, editable === false);
        toolGroups = [[btnAddDetail, btnPrint, btnSubmit], null, [btnDiscard]];
        if (id === 0) {
            view = <div className="p-3">
                <button className="btn btn-primary" onClick={startInputDetail}>开始录单</button>
            </div>;
        }
        const { divStore } = store;
        view = <>
            <ViewMain store={store} popup={false} readOnly={readonly} />
            <ViewBinDivs divStore={divStore} editable={editable} />
        </>;

        function ViewBinDivs({ divStore, editable }: { divStore: DivStore; editable: boolean; }) {
            const { valDivs } = divStore;
            const divs = useAtomValue(valDivs.atomValDivs);
            return <div className="tonwa-bg-gray-1 pt-3">
                {divs.length === 0 ?
                    <div className="mt-3 small text-body-tertiary p-3 bg-white border-top">
                        无明细
                    </div>
                    :
                    divs.map(v => {
                        const { id } = v;
                        const cn = 'mb-3 border-top border-bottom ' + (id < 0 ? 'border-warning' : 'border-primary-subtle');
                        return <div key={id} className={cn}>
                            <ViewDiv divStore={divStore} valDiv={v} readonly={readonly} />
                        </div>;
                    })}
            </div>
        }
    }

    if (detail === undefined) mainOnlyEdit();
    else mainDetailEdit();
    let { header, top, right } = headerSheet({ store, toolGroups, headerGroup });
    if (readonly === true) top = undefined;
    return <Page header={header} back={null} top={top} right={right}>
        {view}
    </Page>;
}

let locationState = 1;

function useStartSheetStore(sheetStore: SheetStore, pick: PickFunc) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    async function startSheetStore() {
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
    return useCallback(startSheetStore, []);
}
