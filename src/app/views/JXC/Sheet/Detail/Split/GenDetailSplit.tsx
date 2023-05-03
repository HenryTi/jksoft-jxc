import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ViewItemID } from "app/template";
import { GenDetail, EditingDetail, GenEditing } from "app/template/Sheet";
import { IDView, Page, uqAppModal, useModal } from "tonwa-app";
import { Atom, Detail } from "uqs/UqDefault";
import { ChangeEvent, useState } from "react";
import { useUqApp } from "app/UqApp";
import { FA, getAtomValue } from "tonwa-com";

const fieldQuantity = 'value';
const fieldPrice = 'v1';
const fieldAmount = 'v2';

export abstract class GenDetailSplit extends GenDetail {
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
        let { genPend } = genEditing.genSheetAct;
        if (genPend === undefined) {
            alert('genPend can not be undefined');
            return;
        }
        let editingDetails = getAtomValue(genEditing.atomDetails);
        let selected = await genPend.select(editingDetails);
        return selected;
    }

    protected editingDetailFromAtom(atom: Atom): Detail {
        let detail = { item: atom.id } as Detail;
        return detail;
    }

    async editRow(genEditing: GenEditing, detail: EditingDetail): Promise<void> {
        const { openModal } = uqAppModal(this.uqApp);
        let ret = await openModal(<this.PageDetail header="多行" />);
    }

    readonly ViewDetail = ViewDetailSplit;

    protected PageDetail = ({ header, detail }: { header?: string; detail?: Detail; }): JSX.Element => {
        detail = detail ?? {} as Detail;
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
            closeModal(detail);
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

function ViewDetailSplit({ editingDetail, genEditing }: { editingDetail: EditingDetail; genEditing: GenEditing; }): JSX.Element {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { rows } = editingDetail;
    const { origin } = editingDetail;
    const { item, value, v1: price, v2: amount } = origin;
    return <div>
        <div className="d-flex align-items-center tonwa-bg-gray-2 px-3 py-2">
            <IDView uq={uq} id={item} Template={ViewItemID} />
            <div className="text-end align-items-end flex-grow-1">
                <span><small>单价:</small> {price?.toFixed(4)} <small>金额:</small> {amount?.toFixed(4)}</span>
                <br />
                <small>数量:</small> <b>{value}</b>
            </div>
        </div>
        <div className="container">
            <div className="row">
                <div className="text-muted text-small text-end col-2 py-2">分行明细</div>
                <div className="text-end py-2 px-3 col">
                    <FA name="plus" />
                </div>
            </div>
        </div>
    </div>;
}
