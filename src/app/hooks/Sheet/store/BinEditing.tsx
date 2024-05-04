import { RegisterOptions } from "react-hook-form";
import { FormRow } from "app/coms";
import {
    BinRow, BizBud, BudAtom, BudDec, BudRadio
    , EntityBin, EnumBudType, ValueSetType,
    BinRowValues,
    BudValues,
    BudValuesBase
} from "app/Biz";
import { Calc, CalcResult, Formulas } from "../../Calc";
import { DivStore } from "./DivStore";
import { SheetStore } from "./SheetStore";
import { ValDivBase } from "./ValDiv";
import { NamedResults } from "./NamedResults";
import { getDays } from "app/tool";
import { ValRow } from "./tool";
import { BudEditing, EditBudInline, ViewBud, ViewBudUIType } from "app/hooks";
import { AtomColl, LabelBox } from "app/hooks/tool";
import { BudCheckValue } from "tonwa-app";
import { BudsEditingBase } from "app/hooks/BudsEditing";

export abstract class BinBudsEditing extends BudsEditingBase<BinRow, BinRowValues> {
    readonly values: ValRow = { buds: {} } as any;
    readonly entityBin: EntityBin;
    readonly sheetStore: SheetStore;
    // protected binRowValues: BinRowValues;
    iValue: number;
    iBase: number;
    xValue: number;
    xBase: number;
    onDel: () => Promise<void>;

    constructor(sheetStore: SheetStore, bin: EntityBin, buds: BizBud[], initBinRow?: BinRow) {
        super(buds, initBinRow);
        this.sheetStore = sheetStore;
        this.entityBin = bin;
        this.budValues = new BinRowValues(bin, buds);
        if (initBinRow !== undefined) {
            this.setValues(initBinRow);
        }
    }

    protected createCalc(): Calc {
        return new Calc(this.formulas, this.values as any);
    }

    private setValues(binRow: BinRow) {
        Object.assign(this.values, binRow);
        let obj = new Proxy(binRow, this.entityBin.proxyHandler());
        this.calc.addValues(undefined, obj);
    }

    protected override setBudObjectValue(bud: BizBud, result: { id: number; base: number; }) {
        switch (bud.name) {
            case 'i': this.iValue = result.id; this.iBase = result.base; break;
            case 'x': this.xValue = result.id; this.xBase = result.base; break;
        }
    }

    protected setBudValue(bud: BizBud, value: any) {
        this.budValues.setBudValue(bud, this.values, value);
    }
}

export class DivEditing extends BinBudsEditing {
    readonly divStore: DivStore;
    readonly valDiv: ValDivBase;
    constructor(divStore: DivStore, valDiv: ValDivBase, namedResults?: NamedResults) {
        const { binDiv, valRow } = valDiv;
        super(divStore.sheetStore, divStore.entityBin, binDiv.buds, valRow);
        this.divStore = divStore;
        this.valDiv = valDiv;
        this.setNamedParams(namedResults);
        this.setValueDefault(valDiv);
    }

    private setValueDefault(valDiv: ValDivBase) {
        const { budValue } = this.budValues;
        if (budValue === undefined) return;
        if (this.budValues.getBudValue(budValue, this.values) !== undefined) return;
        let pendLeft = this.divStore.getPendLeft(valDiv);
        if (pendLeft === undefined) return;
        this.budValues.setBudValue(budValue, this.values, pendLeft);
    }
}

// 跟当前行相关的编辑，计算，状态
export class BinEditing extends BinBudsEditing {
    constructor(sheetStore: SheetStore, bin: EntityBin, initValRow?: ValRow) {
        const { i: iBud, x: xBud, value: valueBud, price: priceBud, amount: amountBud, buds: budArr } = bin;
        let buds: BizBud[] = [];
        if (iBud !== undefined) buds.push(iBud);
        if (xBud !== undefined) buds.push(xBud);
        if (valueBud !== undefined) buds.push(valueBud);
        if (priceBud !== undefined) buds.push(priceBud);
        if (amountBud !== undefined) buds.push(amountBud);
        if (budArr !== undefined) buds.push(...budArr);
        super(sheetStore, bin, buds, initValRow);
    }
}
