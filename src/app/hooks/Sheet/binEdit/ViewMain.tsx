import { SheetMain } from "../store";
import { BudEditing, EditBudInline, ViewSpecR } from "app/hooks";
import { useAtomValue } from "jotai";
import { ViewSheetTime } from "../ViewSheetTime";
import { BizBud } from "app/Biz";
import { FA, setAtomValue } from "tonwa-com";
import { BudCheckEditValue, BudCheckValue } from "tonwa-app";

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
        let labelRequired: any;
        if (required === true) {
            labelRequired = <span className="text-danger me-1">*</span>; // <FA name="star-o" className="small text-danger me-1" />;
        }
        let { id, caption, name } = bizBud;
        let value = buds[id];
        propRow.push(<div key={id} className="col">
            <div className={'ps-1 text-secondary'}>
                {labelRequired}
                <small>{caption ?? name}</small>
            </div>
            <div className="py-1"><EditBudInline budEditing={budEditing} id={idBin} value={value} onChanged={onBudChanged} /></div>
        </div>);
        if (i === length - 1) break;
        if (i % 4 === 3) {
            propRow = [];
            propRowArr.push(propRow);
        }
    }
    function onBudChanged(bud: BizBud, value: string | number | BudCheckValue) {
        buds[bud.id] = value as any;
        setAtomValue(_binRow, { ...binRow });
    }
    let viewRowArr: any;
    if (length > 0) {
        viewRowArr = propRowArr.map((row, index) => <div key={index} className="row py-1 row-cols-4">
            {row}
        </div>);
    }

    function ViewIdField({ bud, value }: { bud: BizBud; value: number }) {
        if (bud === undefined) return null;
        const { caption, name } = bud;
        return <div className="col">
            <div className="ps-1 small text-secondary">{caption ?? name}</div>
            <ViewSpecR id={value} />
        </div>
    }

    let cnBlock = 'd-flex border-bottom border-secondary-subtle bg-white container mt-2';
    let blockRight = <div className="w-min-12c w-max-12c"></div>;
    return <div className="tonwa-bg-gray-1">
        <div className={cnBlock + ' border-top '}>
            <div className="flex-fill row row-cols-4 py-3">
                <div className="col">
                    <div className="ps-1 small text-secondary">单据编号</div>
                    <div><span className="text-danger">{no}</span> &nbsp; <ViewSheetTime id={idBin} /></div>
                </div>
                <ViewIdField bud={budI} value={i} />
                <ViewIdField bud={budX} value={x} />
            </div>
            {blockRight}
        </div>
        <div className={cnBlock}>
            <div className="flex-fill py-2">
                {viewRowArr}
            </div>
            {blockRight}
        </div>
    </div>;
}
