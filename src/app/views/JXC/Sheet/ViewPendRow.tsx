import { ViewAMSAtomSpec, ViewAMSMetric } from "./ViewAMS";
import { MutedSmall } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { PropsViewPendRow } from "app/hooks";

const cnCol = ' col ';
export function ViewPendRow({ value: pendItem, onItemSelect, selectedColl, coll }: PropsViewPendRow) {
    const uqApp = useUqApp();
    const { pend, item, sheet, no, value, pendValue } = pendItem;
    const htmlId = String(pend);
    const gSheet = uqApp.gSheets[sheet];
    let ed = coll[pend];
    let selected = ed !== undefined;
    return <div className="form-check mx-3 my-2 d-flex">
        <input type="checkbox" className="form-check-input me-3"
            id={htmlId}
            disabled={selected}
            onChange={evt => onItemSelect(pendItem, evt.currentTarget.checked)}
            defaultChecked={selected || selectedColl[pend] !== undefined}
        />
        <label className="form-check-label container flex-grow-1" htmlFor={htmlId}>
            <div className="row">
                <ViewAMSAtomSpec id={item} className={cnCol} />
                <div className={cnCol}>
                    <div className="text-break me-3">
                        <MutedSmall>{gSheet.caption ?? 'sheet caption'}编号</MutedSmall> {no}
                    </div>
                    <div>
                        <MutedSmall>在单</MutedSmall> {value}
                        <ViewAMSMetric id={item} />
                    </div>
                </div>
                <div className={cnCol + " flex-grow-1 text-end "}>
                    <MutedSmall>待处理</MutedSmall> {pendValue}<ViewAMSMetric id={item} />
                </div>
            </div>
        </label>
    </div>;
}
