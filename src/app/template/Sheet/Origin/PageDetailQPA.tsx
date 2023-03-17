import { Part } from "app/template/Part";
import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { PartProps } from "app/template/Part";
import { UqApp, useUqApp } from "app/UqApp";
import { SheetPurchase, DetailQPA } from "uqs/JsTicket";
import { ChangeEvent, useState } from "react";
import { Band, FormRow, FormRowsView } from "app/coms";
import { FA, LMR } from "tonwa-com";
import { PartSheet } from "../PartSheet";
import { ViewProduct } from "app/views/JCX/IDProduct";
import { SheetBase } from "../EditingBase";

export abstract class PartDetail<D extends DetailQPA> extends Part {
    buildFormRows(detial: Partial<D>): FormRow[] {
        let { price, quantity, amount } = detial;
        return [
            this.buildQuantityRow(quantity),
            this.buildPriceRow(price),
            this.buildAmountRow(amount),
        ];
    }
    protected get quantityDisabled(): boolean { return false; }
    protected buildQuantityRow(value: number): FormRow {
        return { name: 'quantity', label: '数量', type: 'number', options: { value, disabled: this.quantityDisabled } };
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
    PartSheet: new (uqApp: UqApp) => PartSheet<SheetBase, D>;
}

export function PageDetailQPA<D extends DetailQPA>({ detail, Part, PartSheet }: Props<D>) {
    const uqApp = useUqApp();
    const { uq } = uqApp.partOf(PartSheet);
    const part = uqApp.partOf(Part);
    const { quantity, price, amount, item } = detail;
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const [hasValue, setHasValue] = useState(quantity != undefined);
    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value, name } = evt.target;
        let v = Number(value);
        switch (name) {
            case 'quantity': onQuantityChange(v); break;
            case 'price': onPriceChange(v); break;
        }
        setHasValue(!Number.isNaN(v));
    }
    function setAmountValue(amount: number) {
        detail.amount = amount;
        setValue('amount', amount.toFixed(4));
    }
    function onQuantityChange(value: number) {
        detail.quantity = value;
        let p = getValues('price') ?? price;
        if (!p) return;
        setAmountValue(value * p);
    }
    function onPriceChange(value: number) {
        let q = getValues('quantity') ?? quantity;
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
    formRows.push({ type: 'submit', label: hasValue === true ? '提交' : '关闭' });

    async function onSubmit(data: any) {
        // closeModal(data);
        // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
        // 只能用下面变通
        let { amount, price } = detail;
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
