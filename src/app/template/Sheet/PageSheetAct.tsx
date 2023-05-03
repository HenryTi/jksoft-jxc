import { Band } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";
import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { ButtonAsync, List, LMR, Sep, setAtomValue, useEffectOnce } from "tonwa-com";
import { GenSheetAct } from "./GenSheetAct";
import { GenProps } from "app/tool";
import { Sheet } from "uqs/UqDefault";

export function PageSheetAct({ Gen }: GenProps<GenSheetAct>) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const gen = uqApp.objectOf(Gen);
    const { caption, genSheet, genDetail, genStart } = gen;
    const { genMain } = genSheet;
    const { current: genEditing } = useRef(gen.createEditing());
    const { onEditRow, onAddRow } = genEditing;
    const { ViewTargetBand } = genMain;
    const sheet = useAtomValue(genEditing.atomSheet);
    const rows = useAtomValue(genEditing.atomDetails);
    const submitable = useAtomValue(genEditing.atomSubmitable);
    const isMine = useAtomValue(genEditing.atomIsMine);
    const [visible, setVisible] = useState(true);
    const { openModal, closeModal } = useModal();
    const { id: paramId } = useParams();

    useEffectOnce(() => {
        (async function () {
            genEditing.reset();
            let sheetId = Number(paramId);
            if (Number.isNaN(sheetId) === false) {
                await genEditing.load(sheetId);
                return;
            }
            if (genStart === undefined) {
                // 直接开单
                setAtomValue(genEditing.atomSheet, {} as Sheet);
                setAtomValue(genEditing.atomDetails, []);
            }
            else {
                let ret = await genStart.start();
                if (ret === undefined) {
                    navigate(-1);
                    return;
                }
                let { sheet, editingDetails } = ret;
                if (editingDetails.length === 0) {
                    navigate(-1);
                    return;
                }
                setAtomValue(genEditing.atomSheet, sheet);
                setAtomValue(genEditing.atomDetails, editingDetails);
                genEditing.refreshSubmitable();
                await genEditing.saveSheet()
                await Promise.all(editingDetails.map(v => genEditing.saveEditingDetail(v)));
            }
        })();
    });

    if (sheet === undefined || rows === undefined) {
        return <Page header={caption}>
            <PageSpinner />
        </Page>
    }

    function None() {
        return <div className="small text-muted px-3 py-3">[ 无明细 ]</div>;
    }

    let btnSubmit: any, cnAdd: string;
    if (rows.length === 0) {
        cnAdd = 'btn btn-primary me-3';
    }
    else {
        btnSubmit = <ButtonAsync className="btn btn-primary" onClick={onSubmit} disabled={!submitable}>提交</ButtonAsync>;
        cnAdd = 'btn btn-outline-primary me-3';
    }
    async function onRemoveSheet() {
        let message = `${caption} ${sheet.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await genEditing.discard();
            navigate(-1);
        }
    }
    const vButtons = <LMR className="my-3 px-3 py-2">
        {btnSubmit}
        {visible === true && <>
            <button className={cnAdd} onClick={onAddRow}>增加明细</button>
            {isMine === true && <button className={'btn btn-outline-primary'} onClick={onRemoveSheet}>作废</button>}
        </>}
    </LMR>;
    async function onSubmit() {
        setVisible(false);
        await genEditing.bookAct();
        setVisible(true);
        function addDetailOnOk() {
            closeModal();
            onAddRow();
        }
        await openModal(<Page header="提交成功" back="none">
            <div className="p-3">
                {caption} <b>{sheet.no}</b> 已提交
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={closeModal}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={addDetailOnOk}>新建{caption}</button>
            </div>
        </Page>);
        navigate(-1);
    }
    function ViewItemOfList({ value }: { value: any }) {
        return <genDetail.ViewDetail editingDetail={value} genEditing={genEditing} />;
    }
    return <Page header={caption}>
        <div className="pt-3 tonwa-bg-gray-3 container">
            <Band label={'编号'}>
                {sheet.no}
            </Band>
            <ViewTargetBand sheet={sheet as any} />
        </div>
        {rows.length > 6 ? <>{vButtons}<Sep /></> : <Sep />}
        <List items={rows} ViewItem={ViewItemOfList} none={<None />} onItemClick={onEditRow} />
        <Sep />
        {vButtons}
    </Page>;
}
