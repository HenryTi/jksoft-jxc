import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { PartProps } from "app/template/Part";
import { DetailQPA } from "uqs/UqDefault";
import { ChangeEvent, useState } from "react";
import { Band, FormRow, FormRowsView } from "app/coms";
import { UqApp, useUqApp } from "../../../UqApp";
import { Part } from "../../../tool";
import { SheetBase } from "../EditingBase";
import { PartOrigin } from "./PartOrigin";

export abstract class PartDetail<D extends DetailQPA> extends Part {
    buildFormRows(detial: Partial<D>): FormRow[] {
        let { price, value, amount } = detial;
        return [
            this.buildValueRow(value),
            this.buildPriceRow(price),
            this.buildAmountRow(amount),
        ];
    }
    protected get valueDisabled(): boolean { return false; }
    protected buildValueRow(value: number): FormRow {
        return { name: 'value', label: '数量', type: 'number', options: { value, disabled: this.valueDisabled } };
    }
    protected get priceDisabled(): boolean { return false; }
    protected buildPriceRow(value: number, disabled: boolean = false): FormRow {
        return { name: 'price', label: '单价', type: 'number', options: { value, disabled: this.priceDisabled } };
    }
    protected get amountDisabled(): boolean { return true; }
    buildAmountRow(value: number, disabled: boolean = false): FormRow {
        return { name: 'amount', label: '金额', type: 'number', options: { value, disabled: this.amountDisabled } };
    }

    abstract get itemCaption(): string
    ViewItemTop = ({ item }: { item: number }): JSX.Element => {
        return <div className="container">
            <Band label={this.itemCaption} labelClassName="py-2 fw-bold">
                <IDView uq={this.uq} id={item} Template={this.ViewItemTemplate} />
            </Band>
        </div>
    }
    abstract get ViewItemTemplate(): ({ value }: { value: any }) => JSX.Element;
}

interface Props<D extends DetailQPA> extends PartProps<PartDetail<D>> {
    detail: Partial<D>;
    PartSheet: new (uqApp: UqApp) => PartOrigin<SheetBase, D>;
}

export function PageDetailQPA<D extends DetailQPA>({ detail, Part, PartSheet }: Props<D>) {
    const uqApp = useUqApp();
    const partSheet = uqApp.objectOf(PartSheet);
    const part = uqApp.objectOf(Part);
    const { value, price, amount, item } = detail;
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
        const { price, amount, value: quantity } = detail;
        let hv = amount !== undefined && price !== undefined && quantity !== undefined;
        setHasValue(hv);
        if (hasValue === false) return;
        switch (name) {
            case 'value': onQuantityChange(quantity); break;
            case 'price': onPriceChange(price); break;
        }
    }
    function setAmountValue(amount: number) {
        if (Number.isNaN(amount) === true) return;
        detail.amount = amount;
        setValue('amount', amount.toFixed(4));
    }
    function onQuantityChange(value: number) {
        detail.value = value;
        let p = getValues('price') ?? price;
        if (!p) return;
        setAmountValue(value * p);
    }
    function onPriceChange(value: number) {
        detail.price = value;
        let q = getValues('quantity') ?? value;
        if (!q) return;
        setAmountValue(value * q);
    }
    const options = { onChange, valueAsNumber: true };
    /*
    let formRows: FormRow[] = [
        { name: 'quantity', label: '数量', type: 'number', options: { ...options, value: quantity } },
        { name: 'price', label: '单价', type: 'number', options: { ...options, value: price ?? 1 } },
        { name: 'amount', label: '金额', type: 'number', options: { ...options, value: amount, disabled: true } },
        { type: 'submit', label: hasValue === true ? '提交' : '关闭' },
    ];
    */
    const formRows = part.buildFormRows(detail);
    formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: hasValue === false } });

    async function onSubmit(data: any) {
        // closeModal(data);
        // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
        // 只能用下面变通
        let { amount, price } = detail;

        let { quantity } = data;
        if (Number.isNaN(quantity) === false) {
            let value = { ...detail }; //, sheet: sheet.id };
            await partSheet.editing.setDetail(value);
        }
        closeModal({ ...data, amount, price });
    }
    const { caption, ViewItemTop } = part;
    return <Page header={caption}>
        <ViewItemTop item={item} />
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
