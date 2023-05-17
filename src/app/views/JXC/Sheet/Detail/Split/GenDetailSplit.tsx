import { Band, FormRow, InputNumber } from "app/coms";
import { ViewItemID } from "app/template";
import { GenDetail, EditingRow, GenEditing, SheetRow } from "app/template/Sheet";
import { IDView } from "tonwa-app";
import { Atom, Detail } from "uqs/UqDefault";
import { FA, LMR, List, getAtomValue, setAtomValue } from "tonwa-com";
import { useAtomValue } from "jotai";

const fieldQuantity = 'value';
const fieldPrice = 'v1';
const fieldAmount = 'v2';

export abstract class GenDetailSplit extends GenDetail {
    get itemCaption(): string { return '商品' }
    get ViewItemTemplate(): ({ value }: { value: any }) => JSX.Element { return ViewItemID; }
    ViewItemTop = ({ item }: { item: number }): JSX.Element => {
        return <div className="container">
            <Band label={this.itemCaption}>
                <IDView uq={this.uq} id={item} Template={this.ViewItemTemplate} />
            </Band>
        </div>
    }

    buildFormRows(detial: Detail): FormRow[] {
        let { value, v1: price, v2: amount } = detial;
        return [
            this.buildValueRow(value),
            this.buildPriceRow(price),
            this.buildAmountRow(amount),
        ];
    }
    protected get valueDisabled(): boolean { return false; }
    protected buildValueRow(value: number): FormRow {
        return { name: fieldQuantity, label: '数量', type: 'number', options: { value, disabled: this.valueDisabled } };
    }
    protected get priceDisabled(): boolean { return false; }
    protected buildPriceRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldPrice, label: '单价', type: 'number', options: { value, disabled: this.priceDisabled } };
    }
    protected get amountDisabled(): boolean { return true; }
    buildAmountRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldAmount, label: '金额', type: 'number', options: { value, disabled: this.amountDisabled } };
    }

    readonly selectItem: (header?: string) => Promise<Atom> = undefined;
    readonly selectTarget: (header?: string) => Promise<Atom> = undefined;

    readonly addRow = async (genEditing: GenEditing): Promise<SheetRow[]> => {
        let { genPend } = genEditing.genSheetAct;
        if (genPend === undefined) {
            alert('genPend can not be undefined');
            return;
        }
        let editingRows = getAtomValue(genEditing.atomRows);
        let selected = await genPend.select(editingRows);
        return selected;
    }

    protected editingRowFromAtom(atom: Atom): Detail {
        let detail = { item: atom.id } as Detail;
        return detail;
    }

    readonly editRow: (genEditing: GenEditing, editingRow: EditingRow) => Promise<void> = undefined;

    readonly ViewRow = ({ editingRow, genEditing }: { editingRow: EditingRow; genEditing: GenEditing; }): JSX.Element => {
        const { uq } = this.uqApp;
        const { origin } = editingRow;
        const { item, value, v1: price, v2: amount } = origin;
        const details = useAtomValue(editingRow.atomDetails);
        const onAddRow = async () => {
            let targetAtom = await this.selectTarget();
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
            await genEditing.updateRow(editingRow, [...details, detail]);
        }
        const ViewRow = ({ value: row }: { value: Detail }) => {
            const { target, item, value } = row;
            const onInputed = async (value: number) => {
                row.value = value;
            }
            return <LMR className="py-2 pe-3 ps-5">
                <div className="">
                    <IDView uq={this.uq} id={target} Template={ViewItemID} />
                </div>
                <div>
                    <InputNumber onInputed={onInputed} defaultValue={value} />
                </div>
            </LMR>
        }
        return <div>
            <div className="d-flex align-items-center tonwa-bg-gray-2 px-3 py-2">
                <IDView uq={uq} id={item} Template={ViewItemID} />
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
            <List items={details} ViewItem={ViewRow} none={null} />
        </div>;
    }
}
