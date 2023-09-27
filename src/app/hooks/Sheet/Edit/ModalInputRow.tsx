import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { Page, useModal } from "tonwa-app";
import { ChangeEvent, useState } from "react";
import { DetailRow } from "./SheetStore";
import { ButtonAsync, FA, useEffectOnce } from "tonwa-com";
import { BizBud } from "app/Biz";
import { Calc } from "../../Calc";
import { useAtomValue } from "jotai";
import { useUqApp } from "app/UqApp";

const fieldValue = 'value';
const fieldPrice = 'price';
const fieldAmount = 'amount';

export function ModalInputRow({ row }: { row: DetailRow; }) {
    const uqApp = useUqApp();
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, getValues, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { item } = row;
    const fields: [string, number, BizBud, (value: number) => void][] = (function () {
        const { entityDetail } = row.section.detail;
        const { value, price, amount } = row;
        const { value: valueBud, price: priceBud, amount: amountBud } = entityDetail;
        let ret: [string, number, BizBud, (value: number) => void][] = [];
        if (valueBud !== undefined) {
            ret.push([fieldValue, value, valueBud, value => row.value = value]);
        }
        if (priceBud !== undefined) {
            ret.push([fieldPrice, price, priceBud, value => row.price = value]);
        }
        if (amountBud !== undefined) {
            ret.push([fieldAmount, amount, amountBud, value => row.amount = value]);
        }
        return ret;
    })();
    const [calc, setCalc] = useState<Calc>();
    useEffectOnce(() => {
        let c = new Calc(uqApp);
        for (let [fieldName, value, bud] of fields) {
            c.initCell(fieldName, value, bud.defaultValue);
        }
        setCalc(c);
        c.refreshHasValue();
    });
    if (calc === undefined) return null;
    return <V />;

    function V() {
        const hasValue = useAtomValue(calc._hasValue);

        function buildFormRows(): FormRow[] {
            return fields.map(v => {
                const [fieldName, value, bud] = v;
                const { name, caption, defaultValue } = bud;
                return {
                    name: fieldName,
                    label: caption ?? name,
                    type: 'number',
                    options: { value, disabled: defaultValue !== undefined }
                };
            });
        }
        async function onChange(evt: ChangeEvent<HTMLInputElement>) {
            const { value: valueInputText, name } = evt.target;
            let valueInput: number;
            if (valueInputText.trim().length === 0) {
                valueInput = undefined;
            }
            else {
                let v = Number(valueInputText);
                valueInput = Number.isNaN(v) === true ? undefined : v;
            }
            await calc.setCellValue(name, valueInput, (name, value) => {
                setValue(name, value?.toFixed(4));
            });
            calc.refreshHasValue();
        }
        const options = { onChange, valueAsNumber: true };
        const formRows = buildFormRows();
        formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
        formRows.push({ type: 'submit', label: '提交', options: { disabled: hasValue === false } });

        async function onSubmit(data: any) {
            for (let f of fields) {
                let [name, , , set] = f;
                set(calc.getCellValue(name))
            }
            closeModal(true);
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
        </Page>;
    }
}
