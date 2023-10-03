import { useAtomValue } from "jotai";
import { DetailMain, DetailRow, DetailSection } from "./SheetStore";
import { FA, LMR, Sep } from "tonwa-com";
import { useInputSection } from "./useInputSection";
import { ViewSpec } from "app/hooks/View";
import { useModal } from "tonwa-app";
import { ModalInputRow } from "./ModalInputRow";
import React from "react";

export function ViewDetail({ detail, editable }: { detail: DetailMain; editable: boolean; }) {
    const sections = useAtomValue(detail._sections);
    const { caption } = detail;
    return <div>
        <div className="py-1 px-3 tonwa-bg-gray-2">{caption ?? '明细'}</div>
        <div>
            {sections.map(v => <ViewSection key={v.keyId} section={v} editable={editable} />)}
        </div>
    </div>
}

function ViewSection({ section, editable }: { section: DetailSection; editable: boolean; }) {
    const { detail } = section;
    const { entityDetail } = detail;
    const { x } = entityDetail;
    const inputSection = useInputSection(detail);
    const rows = useAtomValue(section._rows);
    async function onClick() {
        let ret = await inputSection(section);
    }

    let content: any;
    if (x === undefined) {
        let row = rows[0];
        if (row !== undefined) {
            content = <ViewRow row={row} editable={editable} />;
        }
    }
    else {
        content = <>
            <LMR className="tonwa-bg-gray-1 pt-1 px-3">
                <div>Section {section.keyId}</div>
                <button
                    className="btn btn-sm btn-link"
                    disabled={!editable}
                    onClick={onClick}
                ><FA name="plus" /></button>
            </LMR>
            {rows.map(v => <React.Fragment key={v.keyId}>
                <ViewRow row={v} editable={editable} />
                <Sep sep={2} />
            </React.Fragment>)}
        </>;
    }

    return <div className="border-top">
        {content}
    </div>
}

function ViewRow({ row, editable }: { row: DetailRow; editable: boolean; }) {
    const { openModal } = useModal();
    const { i, value, price, amount } = row
    const digits = 2;
    async function onEdit() {
        if (editable === false) return;
        let ret = await openModal(<ModalInputRow row={row} />);
        if (ret === true) {
            await row.changed();
        }
    }
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex align-items-center">
            <span className="me-3 small text-secondary">{caption}</span>
            <span className="w-min-4c">{value}</span>
        </div>;
    }
    if (value === undefined) return null;
    let cnEdit = editable === true ? 'cursor-pointer' : 'text-light';
    return <div className="d-flex ps-3 py-2 align-items-stretch">
        <div className="flex-grow-1">
            <ViewSpec id={i} />
        </div>
        <div className="text-end d-flex flex-column justify-content-end me-2">
            <ViewValue caption={'单价'} value={price.toFixed(digits)} />
            <ViewValue caption={'金额'} value={amount.toFixed(digits)} />
            <ViewValue caption={'数量'} value={<span className="fs-larger fw-bold">{value}</span>} />
        </div >
        <div className="text-end text-info d-flex flex-column">
            <div className={'ps-2 pe-3 ' + cnEdit} onClick={onEdit}><FA name="pencil" fixWidth={true} /></div>
        </div>
    </div >;
}