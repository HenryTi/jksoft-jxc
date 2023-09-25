import { useForm } from "react-hook-form";
import { Band, ButtonRight, FormRow, FormRowsView } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { Page, useModal } from "tonwa-app";
import { ChangeEvent, useRef, useState } from "react";
import { DetailRow } from "./SheetStore";
import { ButtonAsync, FA } from "tonwa-com";

const fieldValue = 'value';
const fieldPrice = 'price';
const fieldAmount = 'amount';

export function ModalInputRow({ row }: { row: DetailRow; }) {
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { item, value, price, amount } = row;
    const [hasValue, setHasValue] = useState(value != undefined);
    let valueDisabled: boolean = false;
    const { current: cur } = useRef({
        value, price, amount,
    });
    /*
    let newValue: number = value;
    let newPrice: number = price;
    let newAmount: number = amount;
    */

    function onClick() {
        closeModal('xxx yyy');
    }
    function buildFormRows(): FormRow[] {
        return [
            buildValueRow(value),
            buildPriceRow(price),
            buildAmountRow(amount),
        ];
    }

    function buildValueRow(value: number): FormRow {
        return { name: fieldValue, label: '数量', type: 'number', options: { value, disabled: valueDisabled } };
    }
    let priceDisabled: boolean = false;
    function buildPriceRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldPrice, label: '单价', type: 'number', options: { value, disabled: priceDisabled } };
    }
    let amountDisabled: boolean = true;
    function buildAmountRow(value: number, disabled: boolean = false): FormRow {
        return { name: fieldAmount, label: '金额', type: 'number', options: { value, disabled: amountDisabled } };
    }

    function onChange(evt: ChangeEvent<HTMLInputElement>) {
        const { value: valueInputText, name } = evt.target;
        let valueInput: number;
        if (valueInputText.trim().length === 0) {
            valueInput = undefined;
        }
        else {
            let v = Number(valueInputText);
            valueInput = Number.isNaN(v) === true ? undefined : v;
        }
        switch (name) {
            case fieldValue: onValueChange(valueInput); break;
            case fieldPrice: onPriceChange(valueInput); break;
        }
        setHasValue(cur.amount !== undefined && cur.price !== undefined && cur.value !== undefined);
    }
    function setAmountValue(value: number, price: number) {
        if (value === undefined || price === undefined) {
            // row.amount = undefined;
            cur.amount = undefined;
            setValue(fieldAmount, '');
            return;
        }
        cur.amount = value * price;
        // row.amount = amount;
        setValue(fieldAmount, cur.amount.toFixed(4));
    }
    function onValueChange(value: number) {
        // row.value = value;
        let p = getValues(fieldPrice) ?? cur.price;
        if (!p) return;
        cur.value = value;
        cur.price = p;
        setAmountValue(value, p);
    }
    function onPriceChange(value: number) {
        // row.price = value;
        let q = getValues(fieldValue) ?? value;
        if (!q) return;
        cur.value = q;
        cur.price = value;
        setAmountValue(q, value);
    }
    const options = { onChange, valueAsNumber: true };
    const formRows = buildFormRows();
    formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: hasValue === false } });

    async function onSubmit(data: any) {
        // const { value, price, amount } = data;
        Object.assign(row, cur);
        closeModal(true);
        // closeModal(data);
        // amount 字段disabled。setValue('amount'), 改变了input显示，但是取值没有改变。
        // 只能用下面变通
        /*
        let ret: SheetRow = {
            origin: undefined,
            details: [row],
        }
        closeModal(ret);
        */
    }

    async function onDel() {
        await row.delFromSection();
        closeModal();
    }

    const right = <ButtonAsync onClick={onDel} className="btn btn-sm btn-primary me-1">
        <FA name="trash" fixWidth={true} />
    </ButtonAsync>;
    return <Page header="输入明细" right={right}>
        <div className="pt-3 tonwa-bg-gray-2 mb-3 container">
            <Band>
                <ViewSpec id={item} />
            </Band>
        </div>
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>
}
