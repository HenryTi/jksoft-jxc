import { EasyTime } from "tonwa-com";
import { Sheet } from "uqs/UqDefault";
import { ViewOperator } from "./ViewOperator";
import { Bin } from "app/tool";
import { SheetStore } from "../../Store";
import { RowCols } from "../tool";
import { ViewBud } from "..";

export function ViewItemMain({ value, isMy, store }: { value: Sheet & Bin & { rowCount: number; }; isMy: boolean; store: SheetStore; }) {
    const { entity } = store;
    const { main } = entity;
    const { i: IBud, x: XBud, primeBuds } = main;
    const { id: binId, no, i, x, operator, rowCount } = value;
    const vTime = <span className="me-3"><EasyTime date={binId / (1024 * 1024) * 60} /></span>;
    let vNo: any, vRowCount: any;
    if (rowCount) {
        vNo = <b>{no}</b>;
        vRowCount = <>
            {vTime}
            <b className="text-danger">{rowCount}</b>
            <span className="text-secondary ms-1">明细</span>
        </>;
    }
    else {
        vNo = <span>{no}</span>;
        vRowCount = <>
            {vTime}
            <span className="text-body-tertiary small">无明细</span>
        </>;
    }
    let vPrimeBuds: any[];
    if (primeBuds !== undefined) {
        vPrimeBuds = primeBuds.map(v => {
            const { id } = v;
            const bin = store.getCacheBudProps(binId);
            if (bin === undefined) {
                return null;
                // 没有内容，应该null
                // return <LabelBox key={id} label={v.caption} className="mb-1">-</LabelBox>;
            }
            const value = bin[id];
            return <ViewBud key={id} bud={v} value={value} store={store} />;
        });
    }
    return <div className="px-3 py-2">
        <RowCols>
            <div className="mb-1">
                <div className="me-3 w-min-10c text-primary fw-bold">{vNo}</div>
                {
                    isMy !== true ?
                        <div>
                            <small className="text-secondary">
                                {vTime}
                                <small className="text-secondary me-1">录单</small>
                                <ViewOperator id={operator} />
                            </small>
                        </div>
                        :
                        <div>{vRowCount}</div>
                }
                <small className="text-secondary"></small>
            </div>

            {i > 0 && <ViewBud bud={IBud} value={i} store={store} />}
            {x > 0 && <ViewBud bud={XBud} value={x} store={store} />}
            {vPrimeBuds}
        </RowCols>
    </div>;
}
