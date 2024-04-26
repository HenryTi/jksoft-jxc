import { Page, PageConfirm, useModal } from "tonwa-app";
import { SheetStore, SubmitState } from "../store";
import { ViewDiv, ViewMain } from "../binEdit";
import { atom, useAtomValue } from "jotai";
import { useDetailNew } from "../binEdit";
// import { useUqApp } from "app/UqApp";
import { useCallback, useState } from "react";
import { PickFunc, useBinPicks } from "../binPick";
import { headerSheet, buttonDefs } from "../headerSheet";
import { ViewReaction } from "app/hooks/View/ViewReaction";
import { FA, setAtomValue } from "tonwa-com";
import { ToolItem } from "app/coms";

export function PageSheet({ store, readonly }: { store: SheetStore; readonly?: boolean; }) {
    const { uq, main, divStore, caption, sheetConsole, atomReaction, atomSubmitState } = store;
    const pick = useBinPicks();
    const modal = useModal();
    const [editable, setEditable] = useState(true);
    let submitState = useAtomValue(atomSubmitState);
    const detailNew = useDetailNew(store);
    // main.entityBin, 
    const start = useStartSheetStore(store, pick);

    async function onSubmit() {
        if (main.trigger() === false || divStore.trigger() === false) {
            setAtomValue(atomReaction, <><FA name="bell-o" className="text-danger me-2" />请检查数据！</>);
            return;
        }
        setEditable(false);
        let sheetId = main.valRow.id;
        let { checkPend, checkBin } = await uq.SubmitSheet.submitReturns({ id: sheetId });
        if (checkPend.length + checkBin.length > 0) {
            alert('pendOverflow:' + JSON.stringify(checkPend) + JSON.stringify(checkBin));
            return;
        }
        setEditable(true);

        await sheetConsole.onSubmited(store);
        /*
        // removeSheetFromCache();
        sheetConsole.removeFromCache(sheetId);
        uqApp.autoRefresh?.();
        let ret = await openModal<boolean>(<Page header="提交成功" back="none">
            <div className="p-3">
                {caption} <b>{main.no}</b> 已提交
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={closeModal}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={() => closeModal(true)}>新建{caption}</button>
            </div>
        </Page>);
        if (ret === true) {
            sheetConsole.restart();
        }
        else {
            sheetConsole.close();
            // navigate(-1);
        }
        */
    }

    /*
    function removeSheetFromCache() {
        let { valRow: { id } } = main;
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.removeItem<{ id: number; }>(v => v.id === id) as any;
        }
    }
    */

    async function onDiscardSheet() {
        let message = `${caption} ${main.no} 真的要作废吗？`;
        let ret = await modal.open(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await store.discard();
            sheetConsole.discard(main.valRow.id);
            // removeSheetFromCache();
            // navigate(-1);
        }
    }
    async function onExit() {
        sheetConsole.close();
        // navigate(-1);
    }
    function onPrint() {
        alert('正在实现中...');
    }

    let { id } = useAtomValue(main._valRow);
    let btnPrint = buttonDefs.print(onPrint);
    let btnExit = buttonDefs.exit(onExit, false);
    let headerGroup = [btnExit];
    let toolGroups: (ToolItem[] | JSX.Element)[], view: any;
    let reaction = <ViewReaction atomContent={atomReaction} />;

    function mainOnlyEdit() {
        let btnSubmit = buttonDefs.submit(onSubmit);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, true, editable === false);
        toolGroups = [[btnPrint, btnSubmit], reaction, null, [btnDiscard]];
        view = <ViewMain store={store} popup={false} readOnly={readonly} />;
    }

    function mainDetailEdit() {
        const { entityBin } = divStore;
        async function startInputDetail() {
            let ret = await start();
            if (ret === undefined) {
                await detailNew();
            }
        }
        async function onAddRow() {
            await detailNew();
        }
        let submitHidden: boolean;
        submitHidden = false;
        let submitDisabled = atom(get => {
            submitState = get(atomSubmitState);
            return submitState === SubmitState.none || submitState === SubmitState.disable;
        });
        let btnSubmit = buttonDefs.submit(onSubmit, submitDisabled, submitHidden);
        let btnAddDetail = entityBin.pend === undefined ?
            buttonDefs.addDetail(onAddRow) : buttonDefs.addPend(onAddRow);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, false, editable === false);
        toolGroups = [[btnAddDetail, btnPrint, btnSubmit], reaction, null, [btnDiscard]];
        if (id === 0) {
            view = <div className="p-3">
                <button className="btn btn-primary" onClick={startInputDetail}>开始录单</button>
            </div>;
        }
        function ViewBinDivs() {
            const { valDivsRoot } = divStore;
            const valDivs = useAtomValue(valDivsRoot.atomValDivs);
            let length = valDivs.length;
            for (let i = 0; i < length; i++) {
                let valDiv = valDivs[i];
                let { valRow } = valDiv;
                if (valRow.id === undefined) debugger;
                if (valDiv.id === undefined) debugger;
            }
            return <div className="tonwa-bg-gray-1 pt-3">
                {valDivs.length === 0 ?
                    <div className="mt-3 small text-body-tertiary p-3 bg-white border-top">
                        无明细
                    </div>
                    :
                    valDivs.map(v => {
                        const { id } = v;
                        if (id === undefined) debugger;
                        const cn = 'border-top border-bottom ' + (id < 0 ? 'border-warning' : 'border-primary-subtle');
                        return <div key={id} className={cn}>
                            <ViewDiv divStore={divStore} valDiv={v} readonly={readonly} />
                        </div>;
                    })}
            </div>
        }
        view = <>
            <ViewMain store={store} popup={false} readOnly={readonly} />
            <ViewBinDivs />
        </>;
    }

    if (divStore === undefined) mainOnlyEdit();
    else mainDetailEdit();
    let { header, top, right } = headerSheet({ store, toolGroups, headerGroup });
    if (readonly === true) top = undefined;
    return <Page header={header} back={null}
        top={top}
        right={right}
    >
        {view}
    </Page>;
}

// let locationState = 1;

function useStartSheetStore(sheetStore: SheetStore, pick: PickFunc) {
    // const uqApp = useUqApp();
    // const navigate = useNavigate();
    const { sheetConsole } = sheetStore;
    async function startSheetStore() {
        let ret = await sheetStore.start(pick);
        if (ret === undefined) {
            if (sheetStore.main.no === undefined) {
                // 还没有创建单据
                sheetConsole.close();
                /*
                if (navigate !== undefined) {
                    setTimeout(() => {
                        navigate(-1);
                    }, 100);
                }
                */
            }
            return; // 已有单据，不需要pick. 或者没有创建新单据
        }
        //let { id, no } = ret;
        sheetConsole.onSheetAdded(sheetStore/*id, no*/);
        /*
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
        */
    }
    return useCallback(startSheetStore, []);
}
