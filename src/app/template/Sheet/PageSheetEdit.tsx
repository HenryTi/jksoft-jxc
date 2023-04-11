import { Band } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { ButtonAsync, List, LMR, Sep } from "tonwa-com";
import { Sheet } from "uqs/UqDefault";
import { GenProps } from "app/tool";
import { GenSheet } from "./GenSheet";

interface PageSheetEditProps extends GenProps<GenSheet> {
    sheet: Sheet;
    onAddRow: () => Promise<void>;
    onEditRow: (detail: any) => Promise<void>;
}

export function PageSheetEdit({ Gen, onEditRow, onAddRow }: PageSheetEditProps) {
    const uqApp = useUqApp();
    const navigate = useNavigate();
    const gen = uqApp.objectOf(Gen);
    const { genEditing: editing, caption
        , ViewItemEditRow, ViewTargetBand
    } = gen;
    const sheet = useAtomValue(editing.atomSheet);
    const rows = useAtomValue(editing.atomRows);
    const submitable = useAtomValue(editing.atomSubmitable);
    const isMine = useAtomValue(editing.atomIsMine);
    const [visible, setVisible] = useState(true);
    const { openModal, closeModal } = useModal();
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
            await editing.discard();
            navigate(-1);
        }
    }
    const button = <LMR className="px-3 py-2">
        {btnSubmit}
        {visible === true && <>
            <button className={cnAdd} onClick={onAddRow}>增加明细</button>
            {isMine === true && <button className={'btn btn-outline-primary'} onClick={onRemoveSheet}>作废</button>}
        </>}
    </LMR>;
    async function onSubmit() {
        setVisible(false);
        await editing.bookSheet(undefined);
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
        return <ViewItemEditRow row={value} Gen={Gen} />;
    }
    return <Page header={caption}>
        <div className="py-2 tonwa-bg-gray-3 container">
            <Band label={'编号'}>
                {sheet.no}
            </Band>
            <ViewTargetBand sheet={sheet as any} />
        </div>
        {rows.length > 6 ? <>{button}<Sep /></> : <Sep />}
        <List items={rows} ViewItem={ViewItemOfList} none={<None />} onItemClick={onEditRow} />
        <Sep />
        {button}
    </Page>;
}
