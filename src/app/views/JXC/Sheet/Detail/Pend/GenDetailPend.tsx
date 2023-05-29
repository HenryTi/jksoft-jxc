import { Band, FormRow, InputNumber } from "app/coms";
import { GenAtomSpec, ViewItemID } from "app/template";
import { GenDetail, GenEditing } from "app/template/Sheet";
import { EditingRow, SheetRow } from 'app/tool';
import { IDView } from "tonwa-app";
import { Atom, Detail } from "uqs/UqDefault";
import { useUqApp } from "app/UqApp";
import { getAtomValue } from "tonwa-com";
import { useAtomValue } from "jotai";
import { GenDetailGoods } from "../GenDetailGoods";
import { ViewAMSAtomSpec } from "../../ViewAMS";
import { GenGoods } from "app/views/JXC/Atom";

export abstract class GenDetailPend extends GenDetailGoods {
    get itemCaption(): string { return '商品' }
    get ViewItemTemplate(): ({ value }: { value: any }) => JSX.Element { return ViewItemID; }
    ViewItemTop = ({ item }: { item: number }): JSX.Element => {
        return <div className="container">
            <Band label={this.itemCaption}>
                <IDView uq={this.uq} id={item} Template={this.ViewItemTemplate} />
            </Band>
        </div>
    }
    /*
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
    */

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
    readonly ViewRow = ViewDetailPend;
}

//const cnCol4 = ' col-4 py-2 ';
const cnCol = ' col py-2 ';
function ViewDetailPend({ editingRow, genEditing }: { editingRow: EditingRow; genEditing: GenEditing; }): JSX.Element {
    const uqApp = useUqApp();
    const genGoods = uqApp.objectOf(GenGoods);
    // const { uq } = uqApp;
    const { atomDetails } = editingRow;
    const details = useAtomValue(atomDetails);
    const { origin } = editingRow;
    const { item, value: originValue, v1: price, v2: amount, pendValue } = origin;
    const row = details[0];
    const { value } = row;
    (row as any).$saveValue = value;

    const onInputed = async (valueInputed: number) => {
        let { $saveValue } = row as any;
        if (valueInputed !== $saveValue) {
            row.value = valueInputed;
            await genEditing.updateRow(editingRow, [row])
        }
    }
    return <div className="container">
        <div className="row">
            <ViewAMSAtomSpec id={item} genGoods={genGoods} className={cnCol} />
            <div className={" text-end " + cnCol}>
                <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount?.toFixed(4)}</span>
                <br />
                <small>数量:</small> <b>{originValue}</b>
            </div>
            <div className={cnCol + ' d-flex justify-content-end '}>
                <InputNumber onInputed={onInputed} defaultValue={value ?? pendValue} min={0} max={pendValue} />
            </div>
        </div>
    </div>;
}
