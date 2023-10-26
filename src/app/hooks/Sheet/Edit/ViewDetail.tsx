import { useAtomValue } from "jotai";
import { CoreDetail, Row, Section } from "./SheetStore";
import { FA, LMR, Sep } from "tonwa-com";
import { ViewSpec } from "app/hooks/View";
import { useModal } from "tonwa-app";
import { ModalInputRow } from "./ModalInputRow";
import React from "react";
import { useCoreDetailEdit } from "./useCoreDetailEdit";
import { BizBud } from "app/Biz";
import { RowStore } from "./binPick";

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
    const edit = useCoreDetailEdit(detail);
    const rows = useAtomValue(section._rows);
    async function onClick() {
        let ret = await edit(section, undefined);
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

    return <div className="border-top">
        {content}
    </div>
}

function ViewRow({ row, editable }: { row: Row; editable: boolean; }) {
    const { openModal } = useModal();
    const { props: binDetail, section: { coreDetail: { entityBin } } } = row;
    const { i: budI, x: budX, price: budPrice, value: budValue, amount: budAmount } = entityBin;
    let { i, x, value, price, amount } = binDetail
    async function onEdit() {
        if (editable === false) return;
        const rowStore = new RowStore(entityBin, binDetail, undefined);
        let ret = await openModal(<ModalInputRow row={row} rowStore={rowStore} />);
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
    return <div className="py-2 align-items-stretch row">
        <div className="col-4">
            <div className="ps-3">
                <ViewIdField bud={budI} value={i} />
            </div>
        </div>
        <div className="col-4">
            <div className="ps-3">
                <ViewIdField bud={budX} value={x} />
            </div>
        </div>
        <div className="col-3">
            <div className="pe-3 text-end d-flex flex-column align-items-end">
                <ViewValue caption={'数量'} value={<span className="fs-larger fw-bold">{value}</span>} />
                {vPrice}
                {vAmount}
            </div>
        </div >
        <div className="col-1">
            <div className="text-end text-info d-flex flex-column ">
                <div className={'ps-2 pe-3 ' + cnEdit} onClick={onEdit}><FA name="pencil" fixWidth={true} /></div>
            </div>
        </div>
    </div >;
}