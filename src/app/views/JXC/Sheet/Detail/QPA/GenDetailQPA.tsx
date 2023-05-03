import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ViewItemID } from "app/template";
import { EditingDetail, GenDetail, GenEditing } from "app/template/Sheet";
import { IDView, Page, uqAppModal, useModal } from "tonwa-app";
import { Atom, Detail } from "uqs/UqDefault";
import { ChangeEvent, useState } from "react";
import { ModalSelectProduct } from "../../../Atom";
import { useUqApp } from "app/UqApp";
import { FA, LMR } from "tonwa-com";

const fieldQuantity = 'value';
const fieldPrice = 'v1';
const fieldAmount = 'v2';

export abstract class GenDetailQPA extends GenDetail {
    get itemCaption(): string { return '产品' }
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

    async addRow(genEditing: GenEditing): Promise<EditingDetail[]> {
        const { openModal } = uqAppModal(this.uqApp);
        let productAtom = await openModal(<ModalSelectProduct />);
        let editingDetail = this.editingDetailFromAtom(productAtom);
        let ret = await openModal(<this.PageDetail header={'新增明细'} editingDetail={editingDetail} />);
        return [ret];
    }

    protected editingDetailFromAtom(atom: Atom): EditingDetail {
        let row: Detail = {
            item: atom.id,
        } as Detail;
        let editingDetail = {
            rows: [row],
        } as EditingDetail;
        return editingDetail;
    }

    async editRow(genEditing: GenEditing, detail: EditingDetail): Promise<void> {
        const { openModal } = uqAppModal(this.uqApp);
        let ret = await openModal(<this.PageDetail header="修改明细" editingDetail={detail} />);
    }

    readonly ViewDetail = ViewDetailQPA;

    protected PageDetail = ({ header, editingDetail }: { header?: string; editingDetail?: EditingDetail; }): JSX.Element => {
        editingDetail = editingDetail ?? {} as EditingDetail;
        let { rows } = editingDetail;
        if (rows === undefined) {
            rows = editingDetail.rows = [{} as Detail];
        }
        let row = rows[0];
        const { value, v1: price, v2: amount, item } = row;
        const { closeModal } = useModal();
        const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
        const [hasValue, setHasValue] = useState(value != undefined);
        function onChange(evt: ChangeEvent<HTMLInputElement>) {
            const { value, name } = evt.target;
            if (value.trim().length === 0) {
                (row as any)[name] = undefined;
            }
            else {
                let v = Number(value);
                (row as any)[name] = Number.isNaN(v) === true ? undefined : v;
            }
            switch (name) {
                case fieldQuantity: onQuantityChange(row.value); break;
                case fieldPrice: onPriceChange(row.v1); break;
            }
            const { v1: price, v2: amount, value: quantity } = row;
            let hv = amount !== undefined && price !== undefined && quantity !== undefined;
            setHasValue(hv);
        }
        function setAmountValue(quantity: number, price: number) {
            if (quantity === undefined || price === undefined) {
                row.v2 = undefined;
                setValue(fieldAmount, '');
            }
            let amount = quantity * price;
            row.v2 = amount;
            setValue(fieldAmount, amount.toFixed(4));
        }
        function onQuantityChange(value: number) {
            row.value = value;
            let p = getValues(fieldPrice) ?? price;
            if (!p) return;
            setAmountValue(value, p);
        }
        function onPriceChange(value: number) {
            row.v1 = value;
            let q = getValues(fieldQuantity) ?? value;
            if (!q) return;
            setAmountValue(q, value);
        }
        const options = { onChange, valueAsNumber: true };
        const formRows = this.buildFormRows(row);
        formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
        formRows.push({ type: 'submit', label: '提交', options: { disabled: hasValue === false } });

        async function onSubmit(data: any) {
            // closeModal(data);
            // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
            // 只能用下面变通
            closeModal(editingDetail);
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

function ViewDetailQPA({ editingDetail }: { editingDetail: EditingDetail; genEditing: GenEditing; }): JSX.Element {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { rows } = editingDetail;
    if (rows === undefined || rows.length === 0) {
        return <div>
            ViewDetailQPA editingDetail rows === undefined || rows.length = 0;
        </div>
    }
    const { item, value, v1: price, v2: amount } = rows[0];
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
