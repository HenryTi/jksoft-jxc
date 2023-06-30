import { Band, FormRow, InputNumber } from "app/coms";
import { EditingRow, SheetRow } from "app/tool";
import { IDView } from "tonwa-app";
import { Atom, Detail } from "uqs/UqDefault";
import { FA, LMR, List, getAtomValue } from "tonwa-com";
import { useAtomValue } from "jotai";
import { Editing, OptionsUseSheetDetail, UseSheetDetailReturn } from "app/hooks";
import { useUqApp } from "app/UqApp";
import { GenGoodsHook, ViewAtomGoods } from "../../../Atom";
import { UsePendFromSheetReturn } from "app/hooks/Sheet";

/*
const fieldQuantity = 'value';
const fieldPrice = 'v1';
const fieldAmount = 'v2';
*/

export interface OptionsUseDetailSplit extends OptionsUseSheetDetail {
    selectTarget: () => Promise<Atom>;
    selectPend: UsePendFromSheetReturn;
}

export function useDetailSplit(options: OptionsUseDetailSplit): UseSheetDetailReturn {
    const { detail, selectTarget, selectPend } = options;
    const uqApp = useUqApp();
    /*
    const { uq } = uqApp;
    const caption = '明细';
    const itemCaption = '商品';

    // function ViewItemTemplate(): ({ value }: { value: any }) => JSX.Element { return ViewAtomGoods; }
    function ViewItemTop({ item }: { item: number }): JSX.Element {
        return <div className="container">
            <Band label={itemCaption}>
                <IDView uq={uq} id={item} Template={ViewAtomGoods} />
            </Band>
        </div>
    }

    function buildFormRows(detial: Detail): FormRow[] {
        let { value, v1: price, v2: amount } = detial;
        return [
            buildValueRow(value),
            buildPriceRow(price),
            buildAmountRow(amount),
        ];
    }

    let valueDisabled: boolean = false;
    function buildValueRow(value: number): FormRow {
        return { name: fieldQuantity, label: '数量', type: 'number', options: { value, disabled: valueDisabled } };
    }
    let priceDisabled: boolean = false;
    function buildPriceRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldPrice, label: '单价', type: 'number', options: { value, disabled: priceDisabled } };
    }
    let amountDisabled: boolean = true;
    function buildAmountRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldAmount, label: '金额', type: 'number', options: { value, disabled: amountDisabled } };
    }
    */
    async function addRow(editingRows: EditingRow[]): Promise<SheetRow[]> {
        // let { genPend } = genEditing.genSheetAct;
        if (selectPend === undefined) {
            alert('selectPend can not be undefined');
            return;
        }
        let selected = await selectPend(editingRows);
        return selected;
    }

    function editingRowFromAtom(atom: Atom): Detail {
        let detail = { item: atom.id } as Detail;
        return detail;
    }

    // readonly editRow: (genEditing: GenEditing, editingRow: EditingRow) => Promise<void> = undefined;

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
            // let sheet = getAtomValue(genEditing.atomSheet);
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
            // setAtomValue(editingRow.atomDetails, newDetails);
            // await genEditing.saveEditingRows([editingRow]);
            await updateRow(editingRow, [...details, detail]);
        }
        const ViewItem = ({ value: row }: { value: Detail }) => {
            const { target, item, value } = row;
            const onInputed = async (value: number) => {
                row.value = value;
            }
            return <LMR className="py-2 pe-3 ps-5">
                <div className="">
                    <IDView uq={uq} id={target} Template={ViewAtomGoods} />
                </div>
                <div>
                    <InputNumber onInputed={onInputed} defaultValue={value} />
                </div>
            </LMR>
        }
        return <div>
            <div className="d-flex align-items-center tonwa-bg-gray-2 px-3 py-2">
                <IDView uq={uq} id={item} Template={ViewAtomGoods} />
                <div className="text-end align-items-end flex-grow-1">
                    <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount?.toFixed(4)}</span>
                    <br />
                    <small>数量:</small> <b>{value}</b>
                </div>
            </div>
            <LMR className="py-2 ps-5 pe-3 tonwa-bg-gray-1">
                <div className="text-muted text-small">分行明细</div>
                <div className="text-end">
                    <button className="btn btn-sm btn-outline-primary" onClick={onAddRow}><FA name="plus" /></button>
                </div>
            </LMR>
            <List items={details} ViewItem={ViewItem} none={null} />
        </div>;
    }
    // const genAtomSpec = new GenGoodsHook(uqApp, 'Goods');
    return {
        detail,
        ViewItemTemplate: ViewAtomGoods,
        ViewRow,
        addRow,
        editRow: undefined,
        // genAtomSpec,
    };
}
