import { useAtomValue } from "jotai";
import { CoreDetail, Row, Section } from "../store";
import { FA, LMR, Sep } from "tonwa-com";
import { ViewSpec } from "app/hooks/View";
import React from "react";
import { useCoreDetailEdit } from "./useCoreDetailEdit";
import { BinRow, BizBud } from "app/Biz";
import { OwnedBuds } from "../../tool/tool";
import { useRowEdit } from "./rowEdit";
import { ViewBud } from "../../Bud";
import { BinEditing } from "../store";
import { Pencil, RowCols } from "app/hooks/tool";
import { ValRow } from "../tool";

export function ViewDetail({ detail, editable }: { detail: CoreDetail; editable: boolean; }) {
    const sections = useAtomValue(detail._sections);
    const { caption } = detail;
    let content: any;
    if (sections.length === 0) {
        content = <div className="p-3 small text-info">[ 无明细 ]</div>
    }
    else {
        content = <div>
            {sections.map(v => <ViewSection key={v.keyId} section={v} editable={editable} />)}
        </div>;
    }
    return <div>
        <div className="pt-2 pb-1 px-3 tonwa-bg-gray-1">{caption ?? '明细'}</div>
        {content}
    </div>
}

function ViewSection({ section, editable }: { section: Section; editable: boolean; }) {
    const { coreDetail: detail } = section;
    const { entityBin } = detail;
    const { x } = entityBin;
    const editSection = useCoreDetailEdit(detail);
    const rows = useAtomValue(section._rows);
    async function onClick() {
        let ret = await editSection(section, undefined);
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
                <div className="small text-secondary">分组</div>
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

    return content;
}

function ViewRow({ row, editable }: { row: Row; editable: boolean; }) {
    const rowEdit = useRowEdit();
    const { valRow, section: { coreDetail: { entityBin } } } = row;
    const { i: budI, x: budX, price: budPrice, amount: budAmount, buds: props } = entityBin;
    let { i, x, value, price, amount, buds } = valRow
    async function onEdit() {
        if (editable === false) return;
        const binEditing = new BinEditing(entityBin, valRow);
        // binEditing.setValues(binDetail);
        let ret = await rowEdit(binEditing);
        if (ret === true) {
            Object.assign(valRow, binEditing.valRow);
            await row.changed();
        }
    }
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="me-4">
            <small className="text-secondary me-2">{caption} :</small>
            {value}
        </div>;
    }
    if (value === undefined) {
        value = 0;
    }
    let cnEdit = editable === true ? 'cursor-pointer' : 'text-light';
    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        return <ViewSpec id={value} />;
    }
    let vPrice: any;
    if (budPrice !== undefined) {
        vPrice = <ViewValue caption={'单价'} value={budPrice.valueToContent(price)} />;
    }
    let vAmount: any;
    if (budAmount !== undefined) {
        vAmount = <ViewValue caption={'金额'} value={budAmount.valueToContent(amount)} />;
    }

    let colCount = 1;
    let cnCol: string = 'col ';
    if (budX !== undefined) {
        colCount++;
    }
    if (props.length > 0) {
        colCount++;
    }

    let colX: any;
    let colProps: any;
    if (budX !== undefined) {
        colX = <div className={cnCol}>
            <ViewIdField bud={budX} value={x} />
            <BinOwnedBuds bizBud={budX} valRow={valRow} />
        </div>;
    }
    if (props.length > 0) {
        colProps = <>
            {
                props.map((bud, index) => {
                    const { id, name, caption } = bud;
                    let v = buds[id];
                    // <small className="me-1 text-secondary">{caption ?? name} :</small>
                    return <ViewBud key={id} bud={bud} value={v} />;
                })}
        </>;
    }

    return <div className="py-2 border-bottom border-secondary">
        <div className="container">
            <RowCols>
                <ViewIdField bud={budI} value={i} />
                <BinOwnedBuds bizBud={budI} valRow={valRow} />
                {colX}
                {colProps}
            </RowCols>
        </div>
        <div className={'d-flex justify-content-end pt-2 '}>
            <div className="border-top border-secondary-subtle d-flex ps-2 pt-2 pb-1 align-items-center">
                {vPrice}
                {vAmount}
                <ViewValue caption={'数量'} value={<span className="fw-bold">{value}</span>} />
                <div className={cnEdit} onClick={onEdit}>
                    <Pencil />
                </div>
            </div>
        </div >
    </div>;
}

// atom field owns buds
export function BinOwnedBuds({ bizBud, valRow, noLabel }: { bizBud: BizBud, valRow: ValRow; noLabel?: boolean; }) {
    let { owned } = valRow;
    if (owned === undefined) return null;
    if (bizBud === undefined) return null;
    let values = owned[bizBud.id];
    return <OwnedBuds values={values} noLabel={noLabel} />;
}
