import { EasyTime } from "tonwa-com";
import { ReturnGetSiteSheetList$page } from "uqs/UqDefault";
import { ViewSpec } from "./ViewSpec";
import { ViewOperator } from "./ViewOperator";

export function ViewItemMain({ value }: { value: ReturnGetSiteSheetList$page }) {
    const { id, no, i, x, operator } = value;
    return <div className="px-3 py-2">
        <div className="d-flex">
            <div>
                <div className="me-3 w-min-10c"><small className="text-secondary me-1">编号</small>{no}</div>
                <div>
                    <small className="text-secondary">
                        <small className="text-secondary me-1">录单</small>
                        <ViewOperator id={operator} />
                    </small>
                </div>
            </div>
            {i > 0 && <div className="w-min-16c me-3"><ViewSpec id={i} /></div>}
            {x > 0 && <div className="w-min-16c me-3"><ViewSpec id={x} /></div>}
            <div className="flex-grow-1" />
            <small className="text-secondary"><EasyTime date={id / (1024 * 1024) * 60} /></small>
        </div>
    </div>;
}
