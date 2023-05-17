import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ViewItemID } from "app/template";
import { EditingRow, GenDetail, GenEditing, SheetRow } from "app/template/Sheet";
import { IDView, Page, uqAppModal, useModal } from "tonwa-app";
import { Atom, Detail } from "uqs/UqDefault";
import { ChangeEvent, useState } from "react";
import { ModalSelectGoods } from "../../../Atom";
import { useUqApp } from "app/UqApp";
import { FA, LMR } from "tonwa-com";
import { useAtomValue } from "jotai";

const fieldQuantity = 'value';
const fieldPrice = 'v1';
const fieldAmount = 'v2';

export abstract class GenDetailQPA extends GenDetail {
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

    readonly selectItem = async (header?: string): Promise<Atom> => {
        const { openModal } = uqAppModal(this.uqApp);
        let ret = await openModal(<ModalSelectGoods />);
        return ret;
    }

    readonly selectTarget: (header?: string) => Promise<Atom> = undefined;

    readonly addRow = async (genEditing: GenEditing): Promise<SheetRow[]> => {
        let productAtom = await this.selectItem();
        let editingRow = this.editingRowFromAtom(productAtom);
        const { openModal } = uqAppModal(this.uqApp);
        let ret = await openModal(<this.PageDetail header={'新增明细'} editingRow={editingRow} />);
        return [ret];
    }

    protected editingRowFromAtom(atom: Atom): EditingRow {
        let row: Detail = {
            item: atom.id,
        } as Detail;
        let editingRow = new EditingRow(undefined, [row]);
        return editingRow;
    }

    readonly editRow = async (genEditing: GenEditing, editingRow: EditingRow): Promise<void> => {
        const { openModal } = uqAppModal(this.uqApp);
        let ret = await openModal(<this.PageDetail header="修改明细" editingRow={editingRow} />);
    }

    readonly ViewRow = ViewDetailQPA;

    protected PageDetail = ({ header, editingRow }: { header?: string; editingRow?: EditingRow; }): JSX.Element => {
        editingRow = editingRow ?? new EditingRow(undefined, undefined);
        const { atomDetails } = editingRow;
        let details = useAtomValue(atomDetails);
        let detail: Detail;
        if (details === undefined) {
            detail = {} as Detail;
        }
        else {
            detail = details[0];
        }
        const { value, v1: price, v2: amount, item } = detail;
        const { closeModal } = useModal();
        const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
        const [hasValue, setHasValue] = useState(value != undefined);
        function onChange(evt: ChangeEvent<HTMLInputElement>) {
            const { value, name } = evt.target;
            if (value.trim().length === 0) {
                (detail as any)[name] = undefined;
            }
            else {
                let v = Number(value);
                (detail as any)[name] = Number.isNaN(v) === true ? undefined : v;
            }
            switch (name) {
                case fieldQuantity: onQuantityChange(detail.value); break;
                case fieldPrice: onPriceChange(detail.v1); break;
            }
            const { v1: price, v2: amount, value: quantity } = detail;
            let hv = amount !== undefined && price !== undefined && quantity !== undefined;
            setHasValue(hv);
        }
        function setAmountValue(quantity: number, price: number) {
            if (quantity === undefined || price === undefined) {
                detail.v2 = undefined;
                setValue(fieldAmount, '');
            }
            let amount = quantity * price;
            detail.v2 = amount;
            setValue(fieldAmount, amount.toFixed(4));
        }
        function onQuantityChange(value: number) {
            detail.value = value;
            let p = getValues(fieldPrice) ?? price;
            if (!p) return;
            setAmountValue(value, p);
        }
        function onPriceChange(value: number) {
            detail.v1 = value;
            let q = getValues(fieldQuantity) ?? value;
            if (!q) return;
            setAmountValue(q, value);
        }
        const options = { onChange, valueAsNumber: true };
        const formRows = this.buildFormRows(detail);
        formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
        formRows.push({ type: 'submit', label: '提交', options: { disabled: hasValue === false } });

        async function onSubmit(data: any) {
            // closeModal(data);
            // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
            // 只能用下面变通
            let ret: SheetRow = {
                origin: undefined,
                details,
            }
            closeModal(ret);
        }
        const { caption, ViewItemTop } = this;
        return <Page header={header ?? caption}>
            <div className="mt-3"></div>
            <ViewItemTop item={item} />
            <form className="container" onSubmit={handleSubmit(onSubmit)}>
                <FormRowsView rows={formRows} register={register} errors={errors} />
            </form>
        </Page>;
    }
}

function ViewDetailQPA({ editingRow }: { editingRow: EditingRow; genEditing: GenEditing; }): JSX.Element {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { atomDetails } = editingRow;
    const details = useAtomValue(atomDetails);
    if (details === undefined || details.length === 0) {
        return <div>
            ViewDetailQPA editingRow rows === undefined || rows.length = 0;
        </div>
    }
    const { item, value, v1: price, v2: amount } = details[0];
    return <LMR className="px-3 py-2">
        <IDView uq={uq} id={item} Template={ViewItemID} />
        <div className="align-self-end text-end d-flex align-items-end">
            <div>
                <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount?.toFixed(4)}</span>
                <br />
                <small>数量:</small> <b>{value}</b>
            </div>
            <FA name="pencil-square-o" className="ms-3 text-info" />
        </div>
    </LMR>;
}
