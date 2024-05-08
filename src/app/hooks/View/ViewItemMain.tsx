import { EasyTime } from "tonwa-com";
import { Sheet } from "uqs/UqDefault";
import { ViewSpec } from "./ViewSpec";
import { ViewOperator } from "./ViewOperator";
import { Bin } from "app/tool";

export function ViewItemMain({ value, isMy }: { value: Sheet & Bin & { rowCount: number; }; isMy: boolean; }) {
    const { id, no, i, x, operator, rowCount } = value;
    let vNo: any, vRowCount: any;
    if (rowCount) {
        vNo = <b>{no}</b>;
        vRowCount = <>
            <b className="text-danger">{rowCount}</b>
            <span className="text-secondary ms-1">明细</span>
        </>;
    }
    else {
        vNo = <span>{no}</span>;
        vRowCount = <span className="text-body-tertiary small">无明细</span>;
    }
    return <div className="px-3 py-2">
        <div className="d-flex">
            <div>
                <div className="me-3 w-min-10c">{vNo}</div>
                {
                    isMy !== true ?
                        <div>
                            <small className="text-secondary">
                                <small className="text-secondary me-1">录单</small>
                                <ViewOperator id={operator} />
                            </small>
                        </div>
                        :
                        <div>{vRowCount}</div>
                }
            </div>
            {i > 0 && <div className="w-min-16c me-3"><ViewSpec id={i} /></div>}
            {x > 0 && <div className="w-min-16c me-3"><ViewSpec id={x} /></div>}
            <div className="flex-grow-1" />
            <small className="text-secondary"><EasyTime date={id / (1024 * 1024) * 60} /></small>
        </div>
    </div>;
}
