import { SheetMain } from "../store";
import { BudEditing, EditBudInline, ViewSpecR } from "app/hooks";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "../ViewSheetTime";
import { BizBud } from "app/Biz";
import { setAtomValue } from "tonwa-com";
import { BudCheckEditValue } from "tonwa-app";

export function ViewMain({ main }: { main: SheetMain }) {
    const { no, entityMain, _binRow, budEditings } = main;
    const { i: budI, x: budX } = entityMain;
    const binRow = useAtomValue(_binRow);
    const { id: idBin, i, x, buds } = binRow;
    let { length } = budEditings;
    let propRow: any[] = [];
    const propRowArr: any[][] = [propRow];
    for (let i = 0; i < length; i++) {
        let budEditing = budEditings[i];
        const { bizBud, required } = budEditing;
        const cn = required === true ? ' text-primary ' : ' text-secodary ';
        let { id, caption, name } = bizBud;
        let value = buds[id];
        propRow.push(<div key={id} className="col">
            <div className={'ps-2 small ' + cn}>{caption ?? name}</div>
            <div className="py-1"><EditBudInline budEditing={budEditing} id={idBin} value={value} onChanged={onBudChanged} /></div>
        </div>);
        if (i === length - 1) break;
        if (i % 4 === 3) {
            propRow = [];
            propRowArr.push(propRow);
        }
    }
    function onBudChanged(bud: BizBud, value: string | number | BudCheckEditValue) {
        buds[bud.id] = value as any;
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
        return <div className="col">
            <div className="small text-secondary">{caption ?? name}</div>
            <ViewSpecR id={value} />
        </div>
    }

    return <div className="tonwa-bg-gray-3 container d-flex">
        <div className="flex-fill">
            <div className="row row-cols-4 py-3 border-bottom border-secondary-subtle">
                <div className="col">
                    <div className="small text-secondary">单据编号</div>
                    <div><span className="text-danger">{no}</span> &nbsp; <ViewSheetTime id={idBin} /></div>
                </div>
                <ViewIdField bud={budI} value={i} />
                <ViewIdField bud={budX} value={x} />
            </div>
            {viewRowArr}
        </div>
        <div className="w-min-8c w-max-8c">
        </div>
    </div>;
}
