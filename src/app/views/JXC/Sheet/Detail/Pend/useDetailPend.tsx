import { Band, InputNumber } from "app/coms";
import { EditingRow, SheetRow } from 'app/tool';
import { IDView } from "tonwa-app";
import { Atom, Detail } from "uqs/UqDefault";
import { useUqApp } from "app/UqApp";
import { useAtomValue } from "jotai";
import { ViewAMSAtomSpec } from "../../ViewAMS";
import { ViewAtomGoods } from "app/views/JXC/Atom";
import { OptionsUseSheetDetail, UseSheetDetailReturn } from "app/hooks";

export interface OptionsUseDetailPend extends OptionsUseSheetDetail {
    selectPend: (editingRows: EditingRow[]) => Promise<SheetRow[]>;
}

export function useDetailPend(options: OptionsUseDetailPend): UseSheetDetailReturn {
    const { detail, selectPend } = options;
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const itemCaption = '商品';
    // function ViewItemTemplate(): ({ value }: { value: any }) => JSX.Element { return ViewAtomGoods; }
    function ViewItemTop({ item }: { item: number }): JSX.Element {
        return <div className="container">
            <Band label={itemCaption}>
                <IDView uq={uq} id={item} Template={ViewAtomGoods} />
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

    async function addRow(editingRows: EditingRow[]): Promise<SheetRow[]> {
        if (selectPend === undefined) {
            alert('genPend can not be undefined');
            return;
        }
        let selected = await selectPend(editingRows);
        return selected;
    }

    function editingRowFromAtom(atom: Atom): Detail {
        let detail = { item: atom.id } as Detail;
        return detail;
    }
    //const cnCol4 = ' col-4 py-2 ';
    const cnCol = ' col py-2 ';
    function ViewDetailPend({ editingRow, updateRow }: { editingRow: EditingRow; updateRow: (editingRow: EditingRow, details: Detail[]) => Promise<void>; }): JSX.Element {
        const uqApp = useUqApp();
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
                await updateRow(editingRow, [row])
            }
        }
        return <div className="container">
            <div className="row">
                <ViewAMSAtomSpec id={item} className={cnCol} />
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
    // const genAtomSpec = new GenGoodsHook(uqApp, 'Goods');
    return {
        detail,
        ViewItemTemplate: ViewAtomGoods,
        ViewRow: ViewDetailPend,
        addRow,
        editRow: undefined,
        // genAtomSpec,
    };
}

