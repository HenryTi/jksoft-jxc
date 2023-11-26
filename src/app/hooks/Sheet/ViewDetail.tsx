import { useAtomValue } from "jotai";
import { BinDetail, CoreDetail, Row, Section } from "./SheetStore";
import { FA, LMR, Sep } from "tonwa-com";
import { ViewSpec } from "app/hooks/View";
import { useModal } from "tonwa-app";
// import { ModalInputRow } from "./ModalInputRow";
import React from "react";
import { useCoreDetailEdit } from "./useCoreDetailEdit";
import { BizBud } from "app/Biz";
import { RowStore } from "./binPick";
// import { useUqApp } from "app/UqApp";
// import { ViewBud } from "app/hooks";
import { OwnedBuds } from "../tool/tool";
import { useInputRow } from "./useInputRow";
import { ViewBud } from "../Bud";

export function ViewDetail({ detail, editable }: { detail: CoreDetail; editable: boolean; }) {
    const sections = useAtomValue(detail._sections);
    const { caption } = detail;
    return <div>
        <div className="py-1 px-3 tonwa-bg-gray-2">{caption ?? '明细'}</div>
        <div>
            {sections.map(v => <ViewSection key={v.keyId} section={v} editable={editable} />)}
        </div>
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

    return <div className="border-top container">
        {content}
    </div>
}

function ViewRow({ row, editable }: { row: Row; editable: boolean; }) {
    const { openModal } = useModal();
    const pickInput = useInputRow();
    const { props: binDetail, section: { coreDetail: { entityBin } } } = row;
    const { i: budI, x: budX, price: budPrice, amount: budAmount, props } = entityBin;
    let { i, x, value, price, amount, buds } = binDetail
    async function onEdit() {
        if (editable === false) return;
        const rowStore = new RowStore(entityBin);
        rowStore.setValues(binDetail);
        let ret = await pickInput(row, rowStore); // openModal(<ModalInputRow row={row} rowStore={rowStore} />);
        if (ret === true) {
            Object.assign(binDetail, rowStore.binDetail);
            await row.changed();
        }
    }
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex align-items-center">
            <div className="me-3 small text-secondary">{caption}</div>
            <div className="w-min-4c text-end">{value}</div>
        </div>;
    }
    if (value === undefined) {
        value = 0;
        // return null;
    }
    let cnEdit = editable === true ? 'cursor-pointer' : 'text-light';
    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        return <div>
            <ViewSpec id={value} />
        </div>
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
            <BinOwnedBuds bizBud={budX} binDetail={binDetail} />
        </div>;
    }
    if (props.length > 0) {
        colProps = <div className={cnCol}>
            <div className="d-flex flex-wrap">
                {
                    props.map((bud, index) => {
                        const { id, name, caption } = bud;
                        let v = buds[id];
                        return <div key={id} className="w-min-12c">
                            <small className="me-1 text-secondary">{caption ?? name} :</small>
                            <ViewBud key={index} bud={bud} value={v} />
                        </div>;
                    })}
            </div>
        </div>;
    }

    return <div className="py-2 align-items-stretch row">
        <div className={cnCol}>
            <ViewIdField bud={budI} value={i} />
            <BinOwnedBuds bizBud={budI} binDetail={binDetail} />
        </div>
        {colX}
        {colProps}
        <div className={cnCol + ' d-flex flex-column align-items-end justify-content-end'}>
            <div className={' flex-grow-1 ' + cnEdit} onClick={onEdit}>
                <FA name="pencil" className="text-info" fixWidth={true} />
            </div>
            <ViewValue caption={'数量'} value={<span className="fs-larger fw-bold">{value}</span>} />
            {vPrice}
            {vAmount}
        </div >
    </div>;
}

// atom field owns buds
export function BinOwnedBuds({ bizBud, binDetail }: { bizBud: BizBud, binDetail: BinDetail; }) {
    let { owned } = binDetail;
    if (owned === undefined) return null;
    if (bizBud === undefined) return null;
    let values = owned[bizBud.id];
    return <OwnedBuds values={values} />;
}
