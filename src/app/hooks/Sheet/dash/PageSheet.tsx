import { Page, PageConfirm, useModal } from "tonwa-app";
import { SheetStore, SubmitState } from "../store";
import { detailNew, ViewDiv, ViewMain } from "../binEdit";
import { atom, useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { headerSheet, buttonDefs } from "../headerSheet";
import { ViewReaction } from "app/hooks/View/ViewReaction";
import { FA, getAtomValue, setAtomValue, SpinnerSmall, theme } from "tonwa-com";
import { ToolItem } from "app/coms";
import { PAV } from "../binEdit/ViewDiv/tool";
import { BizBud } from "app/Biz";
import { useReactToPrint } from "react-to-print";

export function PageSheet({ store, readonly }: { store: SheetStore; readonly?: boolean; }) {
    const { uq, mainStore, binStore, caption, sheetConsole, atomReaction, atomSubmitState } = store;
    const modal = useModal();
    const [editable, setEditable] = useState(true);
    let submitState = useAtomValue(atomSubmitState);
    const ref = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => ref.current,
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
        let sheetId = mainStore.valRow.id;
        await binStore.deleteAllRemoved();
        let { checkPend, checkBin } = await uq.SubmitSheet.submitReturns({ id: sheetId });
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

    let { id } = useAtomValue(mainStore._valRow);
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
        const { entity: entityBin } = binStore;
        async function startInputDetail() {
            // let ret = await start();
            let ret = await startSheetStore(store);
            if (ret === undefined) {
                await detailNew(store);
            }
        }
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
        toolGroups = [[btnAddDetail, btnPrint, btnSubmit], reaction, null, [btnDiscard]];
        if (id === 0) {
            view = <div className="p-3">
                <button className="btn btn-primary" onClick={startInputDetail}>开始录单</button>
            </div>;
        }
        function ViewSum() {
            const sum = useAtomValue(store.atomSum);
            if (sum === undefined) return null;
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
            const valDivs = useAtomValue(valDivsRoot.getAtomValDivs());
            const waiting = useAtomValue(atomWaiting);
            let length = valDivs.length;
            for (let i = 0; i < length; i++) {
                let valDiv = valDivs[i];
                let { valRow } = valDiv;
                if (valRow.id === undefined) debugger;
                if (valDiv.id === undefined) debugger;
            }
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
                        if (id === undefined) debugger;
                        const cn = 'border-top border-bottom ' + (id < 0 ? 'border-warning' : 'border-primary-subtle');
                        return <div key={id} className={cn}>
                            <ViewDiv binStore={binStore} valDiv={v} readonly={readonly} index={index + 1} />
                        </div>;
                    })}
                {viewWaiting}
            </div>
        }
        view = <div ref={ref}>
            <ViewMain store={store} popup={false} readOnly={readonly} />
            <ViewBinDivs />
            <ViewSum />
        </div>;
    }

    if (binStore === undefined) mainOnlyEdit();
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
