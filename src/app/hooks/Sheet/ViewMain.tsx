import { SheetMain } from "./SheetStore";
import { BudEditing, EditBudInline, ViewSpecR } from "app/hooks";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "./ViewSheetTime";
import { BizBud } from "app/Biz";
import { setAtomValue } from "tonwa-com";

export function ViewMain({ main }: { main: SheetMain }) {
    const { no, entityMain, _binRow, binEditing } = main;
    const { i: budI, x: budX, props } = entityMain;
    const binRow = useAtomValue(_binRow);
    const { id: idBin, i, x, buds } = binRow;
    let { length } = props;
    let propRow: any[] = [];
    const propRowArr: any[][] = [propRow];
    const budEditings: BudEditing[] = [];
    for (let i = 0; i < length; i++) {
        let bizBud = props[i];
        let budEditing = new BudEditing(bizBud);
        budEditings.push(budEditing);
        let { id, caption, name } = bizBud;
        let value = buds[id];
        propRow.push(<div key={id} className="col-3">
            <div className="small text-secodary">{caption ?? name}</div>
            <div className="py-1"><EditBudInline budEditing={budEditing} id={idBin} value={value} onChanged={onBudChanged} /></div>
        </div>);
        if (i === length - 1) break;
        if (i % 4 === 3) {
            propRow = [];
            propRowArr.push(propRow);
        }
    }
    function onTrigger() {
        for (let be of budEditings) be.trigger(buds[be.bizBud.id]);
    }
    function onBudChanged(bud: BizBud, value: string | number) {
        buds[bud.id] = value;
        setAtomValue(_binRow, { ...binRow });
    }
    let viewRowArr: any;
    if (length > 0) {
        viewRowArr = propRowArr.map((row, index) => <div key={index} className="row py-3 border-bottom border-secondary-subtle">
            {row}
        </div>);
    }

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        const { caption, name } = bud;
        return <div className="col-3">
            <div className="small text-secondary">{caption ?? name}</div>
            <ViewSpecR id={value} />
        </div>
    }

    return <div className="tonwa-bg-gray-3 px-3 container">
        <div className="row py-3 border-bottom border-secondary-subtle">
            <div className="col-3">
                <div className="small text-secondary">单据编号</div>
                <div><b>{no}</b></div>
                <ViewSheetTime id={idBin} />
            </div>
            <ViewIdField bud={budI} value={i} />
            <ViewIdField bud={budX} value={x} />
        </div>
        {viewRowArr}
        <div><button onClick={onTrigger}>trigger</button></div>
    </div>;
}
