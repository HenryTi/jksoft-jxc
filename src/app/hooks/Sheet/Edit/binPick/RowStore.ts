import { FormRow } from "app/coms";
import { BinDetail } from "../SheetStore";
import { BizBud, BudDec, EntityBin, EnumBudType } from "app/Biz";
import { Calc, CalcCells } from "../../../Calc";

const fieldI = 'i';
const fieldX = 'x';
const fieldValue = 'value';
const fieldPrice = 'price';
const fieldAmount = 'amount';

export class RowStore {
    readonly calc: Calc;
    readonly fields: [string, number | string, BizBud, (value: number | string) => void][];
    readonly bin: EntityBin;
    readonly rowProps: BinDetail;
    readonly values: { [name: string]: () => any } = {};
    readonly requiredFields: string[] = [];
    constructor(bin: EntityBin, binDetail: BinDetail, picked: { [name: string]: any }) {
        this.bin = bin;
        this.rowProps = binDetail;
        this.fields = [];
        const { i, x, value, price, amount, buds: budValues } = binDetail;
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
            setField(fieldValue, value, valueBud, value => binDetail.value = value as number);
            setRequired(valueBud);
        }
        if (priceBud !== undefined) {
            this.values[fieldPrice] = () => this.rowProps.price;
            setField(fieldPrice, price, priceBud, value => binDetail.price = value as number);
            setRequired(priceBud);
        }
        if (amountBud !== undefined) {
            this.values[fieldAmount] = () => this.rowProps.amount;
            setField(fieldAmount, amount, amountBud, value => binDetail.amount = value as number);
            setRequired(amountBud);
        }
        for (let bud of budArr) {
            const { name, id } = bud;
            let value = budValues[id];
            this.values[name] = () => this.rowProps.buds[id];
            setField(name, value, bud, value => {
                binDetail.buds[id] = value;
            });
        }
        this.calc = new Calc(calcCells, picked);
    }

    // 数据从界面设置到row props中
    setData(data: any) {
        this.rowProps.i = this.getValue('i') as number;
        this.rowProps.x = this.getValue('x') as number;
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

    getValues() {
        let ret: { [name: string]: any } = {};
        for (let i in this.values) {
            ret[i] = this.getValue(i);
        }
        return ret;
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
