import { Page, PageConfirm, useModal } from "tonwa-app";
import { SheetStore, SubmitState, upload } from "../store";
import { detailNew, ViewDiv, ViewMain } from "../binEdit";
import { atom, useAtomValue } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import { headerSheet, buttonDefs } from "../headerSheet";
import { ViewReaction } from "app/hooks/View/ViewReaction";
import { env, FA, getAtomValue, setAtomValue, SpinnerSmall, theme } from "tonwa-com";
import { Toolbar, ToolItem } from "app/coms";
import { PAV } from "../binEdit/ViewDiv/tool";
import { BizBud } from "app/Biz";
import { useReactToPrint } from "react-to-print";
import { download } from "app/tool";
import { useSiteRole } from "app/views/Site/useSiteRole";

export function PageSheet({ store, readonly }: { store: SheetStore; readonly?: boolean; }) {
    const { uq, mainStore, binStore, caption, sheetConsole, atomReaction, atomSubmitState } = store;
    const modal = useModal();
    const [editable, setEditable] = useState(true);
    let submitState = useAtomValue(atomSubmitState);
    let useSiteRoleReturn = useSiteRole();
    let { isOwner, isAdmin } = useSiteRoleReturn.userSite;
    const refPrint = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => refPrint.current,
    });
    async function onSubmit() {
        function checkTrigger() {
            if (mainStore.trigger() === false) return false;
            if (binStore !== undefined) {
                if (binStore.trigger() === false) return false;
            }
            return true;
        }

        if (checkTrigger() === false) {
            setAtomValue(atomReaction, <><FA name="bell-o" className="text-danger me-2" />请检查数据！</>);
            return;
        }
        setEditable(false);
        await binStore.deleteAllRemoved();
        /*
        let sheetId = mainStore.valRow.id;
        let { checkPend, checkBin } = await uq.SubmitSheet.submitReturns({ id: sheetId });
        */
        let { checkPend, checkBin } = await store.submit();
        if (checkPend.length + checkBin.length > 0) {
            let error: string = '';
            if (checkPend.length > 0) {
                error += `checkPend: ${JSON.stringify(checkPend)}\n`;
            }
            if (checkBin.length > 0) {
                error += `checkBin: ${JSON.stringify(checkBin)}\n`;
            }
            // alert(error);
            store.setSubmitError(checkPend, checkBin);
            return;
        }
        setEditable(true);

        await sheetConsole.onSubmited(store);
    }

    async function onDiscardSheet() {
        let message = `${caption} ${mainStore.no} 真的要作废吗？`;
        let ret = await modal.open(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await store.discard();
            sheetConsole.discard(mainStore.valRow.id);
        }
    }
    async function onExit() {
        sheetConsole.close();
    }
    function onPrint() {
        handlePrint();
        // alert('正在实现中...');
    }
    function onDownload() {
        download('sss', 'file', 'csv');
    }
    function onUpload() {
        upload();
    }

    // let { id } = useAtomValue(mainStore._valRow);
    let btnPrint = buttonDefs.print(onPrint);
    let btnDownload = buttonDefs.download(onDownload);
    let btnUpload = buttonDefs.upload(onUpload);
    let btnExit = buttonDefs.exit(onExit, false);
    let headerGroup = [btnExit];
    let toolGroups: (ToolItem[] | JSX.Element)[];
    let reaction = <ViewReaction atomContent={atomReaction} />;

    function mainOnlyEdit() {
        let btnSubmit = buttonDefs.submit(onSubmit);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, true, editable === false);
        toolGroups = [[btnPrint, btnSubmit], reaction, null, [btnDiscard]];
    }

    function mainDetailEdit() {
        const { entity: entityBin } = binStore;
        async function onAddRow() {
            await detailNew(store);
        }
        let submitHidden: boolean;
        submitHidden = false;
        let submitDisabled = (function () {
            submitState = getAtomValue(atomSubmitState);
            return submitState === SubmitState.none || submitState === SubmitState.disable;
        })();
        let btnSubmit = buttonDefs.submit(onSubmit, submitDisabled, submitHidden);
        let btnAddDetail = entityBin.pend === undefined ?
            buttonDefs.addDetail(onAddRow) : buttonDefs.addPend(onAddRow);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, false, editable === false);
        let leftGroup = [btnAddDetail];
        if (env.isMobile === false) {
            leftGroup.push(btnUpload);
        }
        leftGroup.push(btnPrint, btnSubmit);
        toolGroups = [leftGroup, reaction, null, [btnDiscard]];
    }

    if (binStore === undefined) mainOnlyEdit();
    else mainDetailEdit();
    let { header, top, right } = headerSheet({ store, toolGroups, headerGroup });
    if (readonly === true) {
        async function onSubmitDebug() {
            let { checkPend, checkBin, logs } = await store.submitDebug();
            let error: string = '';
            if (checkPend.length + checkBin.length > 0) {
                if (checkPend.length > 0) {
                    error += `checkPend: ${JSON.stringify(checkPend)}\n`;
                }
                if (checkBin.length > 0) {
                    error += `checkBin: ${JSON.stringify(checkBin)}\n`;
                }
                // alert(error);
                // store.setSubmitError(checkPend, checkBin);
                // return;
            }
            modal.open(<Page header="调试结果">
                <div className="px-3 py-2">
                    <FA className="text-danger me-2" name="info-circle" />
                    <span className="text-info">写账过程自动回滚。只保留LOG语句的结果。</span>
                </div>
                {error.length > 0 && <div className="m-3">
                    <div>错误：</div>
                    <div>{error}</div>
                </div>}
                <div className="m-3">
                    {logs.map(v => {
                        return <div key={v.id}>
                            <pre>{JSON.stringify(v.value, undefined, 4)}</pre>
                        </div>;
                    })}
                </div>
            </Page>)
        }
        let btnSubmitDebug = buttonDefs.submitDebug(onSubmitDebug);
        let leftGroup: any[] = [];
        if (isAdmin === true) leftGroup.push(btnSubmitDebug);
        let toolGroups = [leftGroup, reaction, null, [btnDownload, btnPrint]];
        top = <Toolbar groups={toolGroups} />;
    }
    return <Page header={header} back={null}
        top={top}
        right={right}
    >
        <ViewSheetContent store={store} readonly={readonly} />
        <ViewSheetPrint store={store} refPrint={refPrint} />
    </Page>;
}

function ViewSheetPrint({ store, refPrint }: { store: SheetStore; refPrint: React.Ref<HTMLDivElement> }) {
    const __html = `<div class="text-center">${store.caption}</div>`;
    return <div className="d-none">
        <div ref={refPrint} className="print-container" style={{ margin: "0", padding: "0" }}>
            <div className="border-bottom px-3 py-2 mb-1 fs-larger text-center border-dark">{store.caption}</div>
            <div dangerouslySetInnerHTML={{ __html }} />
            <ViewSheetContent store={store} readonly={true} />
        </div>
    </div>;
}

function ViewSheetContent({ store, readonly }: { store: SheetStore; readonly: boolean; }) {
    const { binStore } = store;
    if (binStore === undefined) {
        return <ViewMain store={store} popup={false} readOnly={readonly} />
    }
    function ViewSum() {
        const sum = useAtomValue(store.atomSum);
        if (sum === undefined) return null;
        const { entity: entityBin } = binStore;
        const { sumAmount, sumValue } = sum;
        const { amount: budAmount, value: budValue } = entityBin;
        const { value: cnValue, amount: cnAmount } = theme;
        let viewAmount: any, viewValue: any;
        function viewNumber(cn: string, bud: BizBud, val: number) {
            return <>
                <div className="ms-3" />
                <PAV className={cn} bud={bud} val={val} />
            </>
        }
        if (budAmount === undefined) {
            if (budValue === undefined) return null;
        }
        else {
            viewAmount = viewNumber(cnAmount, budAmount, sumAmount);
        }
        if (budValue !== undefined) {
            viewValue = viewNumber(cnValue, budValue, sumValue);
        }
        return <div className="d-flex ps-3 pe-5 py-3 justify-content-end">
            <div className="me-3">合计</div>
            {viewAmount}
            {viewValue}
        </div>;
    }
    function ViewBinDivs() {
        const { valDivsRoot, atomWaiting } = binStore;
        const valDivs = useAtomValue(valDivsRoot.atomValDivs);
        const waiting = useAtomValue(atomWaiting);
        let viewWaiting: any;
        if (waiting === true) {
            viewWaiting = <div className="px-3 py-2"><SpinnerSmall /></div>;
        }
        return <div className="tonwa-bg-gray-1 pt-3">
            {valDivs.length === 0 ?
                <div className="mt-3 small text-body-tertiary p-3 bg-white border-top">
                    无明细
                </div>
                :
                valDivs.map((v, index) => {
                    const { id } = v;
                    if (id === undefined) return null;// debugger;
                    const cn = 'border-top border-bottom ' + (id < 0 ? 'border-warning' : 'border-primary-subtle');
                    return <React.Fragment key={id}>
                        <div className="page-break" />
                        <div className={cn}>
                            <ViewDiv binStore={binStore} valDiv={v} readonly={readonly} index={index + 1} />
                        </div>
                    </React.Fragment>;
                })}
            {viewWaiting}
        </div>
    }
    return <div>
        <ViewMain store={store} popup={false} readOnly={readonly} />
        <ViewBinDivs />
        <ViewSum />
    </div>;
}

export async function startSheetStore(sheetStore: SheetStore) {
    const { sheetConsole } = sheetStore;
    let ret = await sheetStore.start();
    if (ret === undefined) {
        if (sheetStore.mainStore.no === undefined) {
            // 还没有创建单据
            sheetConsole.close();
        }
        return; // 已有单据，不需要pick. 或者没有创建新单据
    }
    sheetConsole.onSheetAdded(sheetStore);
}
