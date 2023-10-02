// import { ViewAtomSpec, ViewUom } from "./ViewAUS";
import { MutedSmall } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { PropsViewPendRow } from "app/hooks";

const cnCol = ' col ';
export function ViewPendRow({ value: pendItem, onItemSelect, selectedColl, coll }: PropsViewPendRow) {
    const uqApp = useUqApp();
    const { pend, i, sheet, no, value, pendValue } = pendItem;
    const htmlId = String(pend);
    const entitySheet = uqApp.biz.entities[sheet];
    let ed = coll[pend];
    let selected = ed !== undefined;

    function ViewAtomSpec({ id, className }: { id: number; className: string; }) {
        return <div>
            ViewAtomSpec {id} {className}
        </div>
    }
    function ViewUom({ id }: { id: number; }) {
        return <div>
            ViewUom({id})
        </div>
    }

    return <div className="form-check mx-3 my-2 d-flex">
        <input type="checkbox" className="form-check-input me-3"
            id={htmlId}
            disabled={selected}
            onChange={evt => onItemSelect(pendItem, evt.currentTarget.checked)}
            defaultChecked={selected || selectedColl[pend] !== undefined}
        />
        <label className="form-check-label container flex-grow-1" htmlFor={htmlId}>
            <div className="row">
                <ViewAtomSpec id={i} className={cnCol} />
                <div className={cnCol}>
                    <div className="text-break me-3">
                        <MutedSmall>{entitySheet.caption ?? entitySheet.name}编号</MutedSmall> {no}
                    </div>
                    <div>
                        <MutedSmall>在单</MutedSmall> {value}
                        <ViewUom id={i} />
                    </div>
                </div>
                <div className={cnCol + " flex-grow-1 text-end "}>
                    <MutedSmall>待处理</MutedSmall> {pendValue}<ViewUom id={i} />
                </div>
            </div>
        </label>
    </div>;
}
