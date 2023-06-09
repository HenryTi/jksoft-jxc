import { InputNumber } from "app/coms";
import { EditingRow, SheetRow } from "app/tool";
import { IDView } from "tonwa-app";
import { Atom, Detail } from "uqs/UqDefault";
import { FA, LMR, List } from "tonwa-com";
import { useAtomValue } from "jotai";
import { OptionsUseSheetDetail, UseSheetDetailReturn } from "app/hooks";
import { useUqApp } from "app/UqApp";
import { ViewAtomGoods, useBizAtomMetricSpec } from "../../../Atom";
import { UsePendFromSheetReturn } from "app/hooks/Sheet";

export interface OptionsUseDetailSplit extends OptionsUseSheetDetail {
    selectTarget: () => Promise<Atom>;
    selectPend: UsePendFromSheetReturn;
}

export function useDetailSplit(options: OptionsUseDetailSplit): UseSheetDetailReturn {
    const { detail, selectTarget, selectPend } = options;
    const uqApp = useUqApp();
    async function addRow(editingRows: EditingRow[]): Promise<SheetRow[]> {
        if (selectPend === undefined) {
            alert('selectPend can not be undefined');
            return;
        }
        let selected = await selectPend(editingRows);
        return selected;
    }

    function ViewRow({ editingRow, updateRow }: { editingRow: EditingRow; updateRow: (editingRow: EditingRow, details: Detail[]) => Promise<void>; }): JSX.Element {
        const { uq } = uqApp;
        const { origin } = editingRow;
        const { item, value, v1: price, v2: amount } = origin;
        const details = useAtomValue(editingRow.atomDetails);
        const onAddRow = async () => {
            let targetAtom = await selectTarget();
            if (targetAtom === undefined) {
                alert('GenDetail.selectTarget not defined');
                return;
            }
            let rowsSum = 0;
            for (let detail of details) { rowsSum += detail.value; }
            let detail: Detail = {
                id: undefined,
                base: undefined, // sheet.id,
                target: targetAtom.id,
                item,
                value: value - rowsSum,
                origin: origin.id,
                v1: undefined,
                v2: undefined,
                v3: undefined,
            };
            await updateRow(editingRow, [...details, detail]);
        }
        const ViewItem = ({ value: row }: { value: Detail }) => {
            const { target, item, value } = row;
            const onInputed = async (value: number) => {
                row.value = value;
            }
            return <LMR className="py-2 pe-5 ps-5">
                <div className="">
                    <IDView uq={uq} id={target} Template={ViewAtomGoods} />
                </div>
                <div>
                    <InputNumber onInputed={onInputed} defaultValue={value} />
                </div>
            </LMR>
        }

        const { viewAtom, viewMetricItem, viewSpec } = useBizAtomMetricSpec(item);
        return <div className="border rounded mx-2 my-3">
            <div className="container">
                <div className="row py-2 tonwa-bg-gray-2">
                    <div className="col ps-3">{viewAtom}</div>
                    <div className="col">{viewSpec}</div>
                    <div className="col pe-3 text-end align-items-end">
                        <span><small>单价:</small> {price?.toFixed(2)} <small>金额:</small> {amount?.toFixed(2)}</span>
                        <br />
                        <small>数量:</small> <span className="fs-5"><b>{value}</b> {viewMetricItem}</span>
                    </div>
                    <div className="col-1 text-end">
                        <button className="btn btn-sm btn-outline-primary" onClick={onAddRow}><FA name="plus" /></button>
                    </div>
                </div>
                <List items={details} ViewItem={ViewItem} none={null} />
            </div>
        </div>;
    }

    return {
        detail,
        ViewItemTemplate: ViewAtomGoods,
        ViewRow,
        addRow,
        editRow: undefined,
    };
}
