import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { Page, useModal } from "tonwa-app";
import { ChangeEvent, useRef, useState } from "react";
import { DetailRow } from "./SheetStore";
import { ButtonAsync, FA, useEffectOnce } from "tonwa-com";
import { BizBud } from "app/Biz";
import { Calc, Cell } from "../../Calc";
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
    const { current: fields } = useRef<[string, number, BizBud, (value: number) => void, Cell][]>([]);
    const [calc, setCalc] = useState<Calc>();
    useEffectOnce(() => {
        const { entityDetail } = row.section.detail;
        const { value, price, amount } = row;
        const { value: valueBud, price: priceBud, amount: amountBud } = entityDetail;
        if (valueBud !== undefined) {
            fields.push([fieldValue, value, valueBud, value => row.value = value, undefined]);
        }
        if (priceBud !== undefined) {
            fields.push([fieldPrice, price, priceBud, value => row.price = value, undefined]);
        }
        if (amountBud !== undefined) {
            fields.push([fieldAmount, amount, amountBud, value => row.amount = value, undefined]);
        }
        let c = new Calc(uqApp);
        for (let field of fields) {
            let [fieldName, value, bud,] = field;
            let cell = c.initCell(fieldName, value, bud.defaultValue);
            field[4] = cell;
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
                const [fieldName, value, bud, , cell] = v;
                const { name, caption, defaultValue } = bud;
                return {
                    name: fieldName,
                    label: caption ?? name,
                    type: 'number',
                    options: { value, disabled: cell.fixed }
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
