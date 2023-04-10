import { useForm } from "react-hook-form";
import { IDView, Page, useModal } from "tonwa-app";
import { GenProps } from "app/tool";
import { Detail } from "uqs/UqDefault";
import { ChangeEvent, useState } from "react";
import { Band, FormRow, FormRowsView } from "app/coms";
import { UqApp, useUqApp } from "../../../UqApp";
import { Gen } from "../../../tool";
import { GenOrigin } from "./GenOrigin";

const fieldQuantity = 'value';
const fieldPrice = 'v1';
const fieldAmount = 'v2';

export abstract class GenDetail extends Gen {
    readonly caption = '明细';
    readonly bizEntityName = undefined as string;
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

    abstract get itemCaption(): string
    ViewItemTop = ({ item }: { item: number }): JSX.Element => {
        return <div className="container">
            <Band label={this.itemCaption}>
                <IDView uq={this.uq} id={item} Template={this.ViewItemTemplate} />
            </Band>
        </div>
    }
    abstract get ViewItemTemplate(): ({ value }: { value: any }) => JSX.Element;
}

interface Props extends GenProps<GenDetail> {
    detail: Detail;
    GenSheet: new (uqApp: UqApp) => GenOrigin;
}

export function PageDetailQPA({ detail, Gen, GenSheet }: Props) {
    const uqApp = useUqApp();
    const genSheet = uqApp.objectOf(GenSheet);
    const gen = uqApp.objectOf(Gen);
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
        setAmountValue(value, q);
    }
    const options = { onChange, valueAsNumber: true };
    const formRows = gen.buildFormRows(detail);
    formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: hasValue === false } });

    async function onSubmit(data: any) {
        // closeModal(data);
        // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
        // 只能用下面变通
        let { v1: price, v2: amount } = detail;

        let { quantity } = data;
        if (Number.isNaN(quantity) === false) {
            let value = { ...detail }; //, sheet: sheet.id };
            await genSheet.editing.setDetail(value);
        }
        closeModal({ ...data, amount, price });
    }
    const { caption, ViewItemTop } = gen;
    return <Page header={caption}>
        <div className="mt-3"></div>
        <ViewItemTop item={item} />
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
