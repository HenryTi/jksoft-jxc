import { Band } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { ButtonAsync, List, LMR, Sep, useEffectOnce } from "tonwa-com";
import { GenSheetAct } from "./GenSheetAct";
import { GenProps } from "app/tool";

export function PageSheetAct({ Gen }: GenProps<GenSheetAct>) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const genSheetAct = uqApp.objectOf(Gen);
    const { caption, ViewRow, ViewTargetBand } = genSheetAct;
    const { current: genEditing } = useRef(genSheetAct.createEditing());
    const { onEditRow, onAddRow } = genEditing;
    const sheet = useAtomValue(genEditing.atomSheet);
    const rows = useAtomValue(genEditing.atomRows);
    const submitable = useAtomValue(genEditing.atomSubmitable);
    const isMine = useAtomValue(genEditing.atomIsMainSaved);
    const [visible, setVisible] = useState(true);
    const { openModal, closeModal } = useModal();
    const { id: paramId } = useParams();

    useEffectOnce(() => {
        (async function () {
            let sheetId = Number(paramId);
            if (Number.isNaN(sheetId) === true) {
                sheetId = undefined;
            }
            if (await genSheetAct.start(genEditing, sheetId) === false) {
                // 如无开单，直接退回
                navigate(-1);
            };
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
        return <ViewRow editingRow={value} genEditing={genEditing} />;
    }
    let viewTargetBand: JSX.Element;
    if (ViewTargetBand !== undefined) {
        viewTargetBand = <ViewTargetBand sheet={sheet} />;
    }
    return <Page header={caption}>
        <div className="pt-3 tonwa-bg-gray-3 container">
            <Band label={'编号'}>
                {sheet.no}
            </Band>
            {viewTargetBand}
        </div>
        {rows.length > 6 ? <>{vButtons}<Sep /></> : <Sep />}
        <List items={rows} ViewItem={ViewItemOfList} none={<None />} onItemClick={onEditRow} />
        <Sep />
        {vButtons}
    </Page>;
}
