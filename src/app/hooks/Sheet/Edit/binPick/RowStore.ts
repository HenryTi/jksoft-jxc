import { FormRow } from "app/coms";
import { BinDetail } from "../SheetStore";
import { BizBud, BudDec, EntityBin, EnumBudType } from "app/Biz";
import { Calc, FormulaSetType, Formulas } from "../../../Calc";

abstract class Field {
    readonly name: string;
    readonly bud: BizBud;
    readonly binDetail: BinDetail;
    constructor(bud: BizBud, binDetail: BinDetail) {
        this.name = bud.name;
        this.bud = bud;
        this.binDetail = binDetail;
    }
    abstract getValue(): any;
    abstract setValue(v: any): void;
}

class FieldI extends Field {
    getValue(): any { return this.binDetail.i; }
    setValue(v: any) { this.binDetail.i = v; }
}

class FieldX extends Field {
    getValue(): any { return this.binDetail.x; }
    setValue(v: any) { this.binDetail.x = v; }
}

class FieldValue extends Field {
    getValue(): any { return this.binDetail.value; }
    setValue(v: any) { this.binDetail.value = v; }
}

class FieldPrice extends Field {
    getValue(): any { return this.binDetail.price; }
    setValue(v: any) { this.binDetail.price = v; }
}

class FieldAmount extends Field {
    getValue(): any { return this.binDetail.amount; }
    setValue(v: any) { this.binDetail.amount = v; }
}

class FieldBud extends Field {
    getValue(): any { return this.binDetail.buds[this.bud.id]; }
    setValue(v: any) { this.binDetail.buds[this.bud.id] = v; }
}

export class RowStore {
    private readonly fields: Field[];
    private readonly fieldColl: { [name: string]: Field } = {};
    private readonly calc: Calc;
    private readonly requiredFields: Field[] = [];
    readonly binDetail: BinDetail = { buds: {} } as any;
    constructor(bin: EntityBin) {
        this.fields = [];
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, props: budArr } = bin;

        let requiredFields = this.requiredFields;
        if (iBud !== undefined) {
            this.initField(new FieldI(iBud, this.binDetail), false);
        }
        if (xBud !== undefined) {
            this.initField(new FieldX(xBud, this.binDetail), false);
        }
        if (valueBud !== undefined) {
            this.initField(new FieldValue(valueBud, this.binDetail));
        }
        if (priceBud !== undefined) {
            this.initField(new FieldPrice(priceBud, this.binDetail));
        }
        if (amountBud !== undefined) {
            this.initField(new FieldAmount(amountBud, this.binDetail));
        }
        for (let bud of budArr) {
            this.initField(new FieldBud(bud, this.binDetail));
        }
        const formulas: Formulas = {};
        for (let i in this.fieldColl) {
            let f = this.fieldColl[i];
            let { name, bud } = f;
            this.fieldColl[name] = f;
            let { defaultValue } = bud;
            if (defaultValue !== undefined) {
                formulas[name] = defaultValue;
                if (defaultValue.endsWith('\ninit') === true) {
                    requiredFields.push(f);
                }
            }
            else {
                requiredFields.push(f);
            }
        }
        this.calc = new Calc(formulas, this.binDetail as any);
    }

    private initField(field: Field, onForm: boolean = true) {
        this.fieldColl[field.name] = field;
        if (onForm === true) this.fields.push(field);
    }

    init(picked: { [name: string]: any }) {
        this.calc.init(picked);
        // Object.assign(this.binDetail, this.calc.values);
    }

    setValues(binDetail: BinDetail) {
        Object.assign(this.binDetail, binDetail);
        this.calc.setValues(binDetail);
    }

    setValue(name: string, value: number | string, callback: (name: string, value: string | number) => void) {
        const c = (name: string, value: string | number) => {
            callback?.(name, value);
            (this.binDetail as any)[name] = value;
        }
        (this.binDetail as any)[name] = value;
        this.calc.setValue(name, value, c);

    }
    /*
    // 数据从界面设置到row props中
    setData(data: any) {
        for (let i in this.fieldColl) {
            let field = this.fieldColl[i];
            const { name } = field;
            let v = data[name];
            field.setValue(v);
        }
    }
    */
    get submitable(): boolean {
        let ret = true;
        for (let field of this.requiredFields) {
            let v = this.calc.values[field.name];
            if (v === undefined) return false;
        }
        return ret;
    }

    buildFormRows(): FormRow[] {
        return this.fields.map(v => {
            const { name, bud } = v;
            const { caption, budDataType } = bud;
            let setType = this.calc.formulaSetType(name);
            if (setType === FormulaSetType.show) return;
            let ret = {
                name,
                label: caption ?? name,
                type: 'number',
                options: { value: v.getValue(), disabled: setType === FormulaSetType.equ }
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
