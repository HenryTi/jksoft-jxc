import { useForm } from "react-hook-form";
import { Band, FormRow, FormRowsView } from "app/coms";
import { ViewSpec } from "app/hooks/View";
import { Page, useModal } from "tonwa-app";
import { ChangeEvent, useRef, useState } from "react";
import { BinDetail, Row } from "./SheetStore";
import { ButtonAsync, FA, useEffectOnce } from "tonwa-com";
import { BizBud, BudDec, EntityBin, EnumBudType } from "app/Biz";
import { Calc, CalcCells, Cell } from "../../Calc";
// import { atom, useAtomValue } from "jotai";

const fieldI = 'i';
const fieldX = 'x';
const fieldValue = 'value';
const fieldPrice = 'price';
const fieldAmount = 'amount';

class RowStore {
    readonly calc: Calc;
    readonly fields: [string, number | string, BizBud, (value: number | string) => void][];
    readonly bin: EntityBin;
    readonly rowProps: BinDetail;
    readonly values: { [name: string]: () => any } = {};
    readonly requiredFields: string[] = [];
    constructor(bin: EntityBin, props: BinDetail, picked: { [name: string]: any }) {
        this.bin = bin;
        this.rowProps = props;
        this.fields = [];
        const { i, x, value, price, amount, buds: budValues } = props;
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, props: budArr } = bin;
        const calcCells: CalcCells = {};
        let fields = this.fields;
        let requiredFields = this.requiredFields;
        function setField(fieldName: string, fieldValue: string | number, bud: BizBud, set: (value: string | number) => void) {
            fields.push([fieldName, fieldValue, bud, set]);
            const { defaultValue } = bud;
            calcCells[fieldName] = { value: fieldValue, formula: defaultValue };
        }
        function setRequired(bud: BizBud) {
            const { name, defaultValue } = bud;
            if (defaultValue === undefined || defaultValue.endsWith('\ninit') === true) {
                requiredFields.push(name);
            }
        }
        if (iBud !== undefined) {
            this.values[fieldI] = () => this.rowProps.i;
            calcCells[fieldI] = { value: i, formula: iBud.defaultValue };
        }
        if (xBud !== undefined) {
            this.values[fieldX] = () => this.rowProps.x;
            calcCells[fieldX] = { value: x, formula: xBud.defaultValue };
        }
        if (valueBud !== undefined) {
            this.values[fieldValue] = () => this.rowProps.value;
            setField(fieldValue, value, valueBud, value => props.value = value as number);
            setRequired(valueBud);
        }
        if (priceBud !== undefined) {
            this.values[fieldPrice] = () => this.rowProps.price;
            setField(fieldPrice, price, priceBud, value => props.price = value as number);
            setRequired(priceBud);
        }
        if (amountBud !== undefined) {
            this.values[fieldAmount] = () => this.rowProps.amount;
            setField(fieldAmount, amount, amountBud, value => props.amount = value as number);
            setRequired(amountBud);
        }
        for (let bud of budArr) {
            const { name, id } = bud;
            let value = budValues[id];
            this.values[name] = () => this.rowProps.buds[id];
            setField(name, value, bud, value => {
                props.buds[id] = value;
            });
        }
        this.calc = new Calc(calcCells, picked);
    }

    // 数据从界面设置到row props中
    setData(data: any) {
        this.rowProps.i = data.i;
        this.rowProps.x = data.x;
        for (let field of this.fields) {
            const [name, , , set] = field;
            let v = data[name];
            set(v);
        }
    }

    getValue(name: string): number | string {
        let v = this.calc.getValue(name);
        return v ?? this.values[name]?.();
    }

    get submitable(): boolean {
        let ret = true;
        for (let field of this.requiredFields) {
            let v = this.calc.getValue(field);
            if (v === undefined) return false;
        }
        return ret;
    }

    buildFormRows(): FormRow[] {
        return this.fields.map(v => {
            const [fieldName, value, bud] = v;
            const { name, caption, budDataType } = bud;
            let cell = this.calc.getCell(fieldName);
            let ret = {
                name: fieldName,
                label: caption ?? name,
                type: 'number',
                options: { value: value ?? cell?.value, disabled: cell?.immutable }
            } as any;
            switch (budDataType.type) {
                case EnumBudType.char:
                case EnumBudType.str:
                    ret.type = 'text';
                    break;
                case EnumBudType.dec:
                    let step: string = '0.000001';
                    const { fraction } = budDataType as BudDec;
                    if (fraction !== undefined) {
                        step = String(1 / Math.pow(10, fraction));
                        ret.step = step;
                    }
                    ret.options.valueAsNumber = true;
                    break;
            }
            return ret;
        });
    }
}

export function ModalInputRow({ row, picked }: { row: Row; picked: { [name: string]: any } }) {
    const { closeModal } = useModal();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({ mode: 'onBlur' });
    const { props, section } = row;
    const { entityBin } = section.coreDetail;
    const { i: budI, x: budX } = entityBin;
    const { current: rowStore } = useRef(new RowStore(entityBin, props, picked));
    const { calc } = rowStore;
    if (picked !== undefined) calc.run(undefined);
    const [submitable, setSubmitable] = useState(rowStore.submitable);
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
        calc.setValue(name, valueInput);
        calc.run((name, value) => {
            if (name === '采购员备注') debugger;
            setValue(name, value);
        });
        setSubmitable(rowStore.submitable);
    }
    const options = { onChange };
    const formRows = rowStore.buildFormRows();
    formRows.forEach(v => (v as any).options = { ...(v as any).options, ...options });
    formRows.push({ type: 'submit', label: '提交', options: { disabled: submitable === false } });

    async function onSubmit(data: any) {
        rowStore.setData(data);
        closeModal(true);
    }

    async function onDel() {
        await row.delFromSection();
        closeModal();
    }
    const right = <ButtonAsync onClick={onDel} className="btn btn-sm btn-primary me-1">
        <FA name="trash" fixWidth={true} />
    </ButtonAsync>;
    function ViewIdField({ bud, value }: { bud: BizBud; value: number; }) {
        if (bud === undefined) return null;
        const { caption, name } = bud;
        return <Band label={caption ?? name} className="border-bottom py-2">
            <div className="px-3">
                <ViewSpec id={value} />
            </div>
        </Band>;
    }
    return <Page header="输入明细" right={right}>
        <div className="py-1 tonwa-bg-gray-2 mb-3 container">
            <ViewIdField bud={budI} value={rowStore.getValue('i') as number} />
            <ViewIdField bud={budX} value={rowStore.getValue('x') as number} />
        </div>
        <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <FormRowsView rows={formRows} register={register} errors={errors} />
        </form>
    </Page>;
}
