import {
    BinRow, BizBud, EntityBin, BinRowValuesTool,
    ValueSetType
} from "app/Biz";
import { BinStore } from "./BinStore";
import { SheetStore } from "./SheetStore";
import { ValDivBase } from "./ValDiv";
import { NamedResults } from "./NamedResults";
import { ValRow } from "./tool";
import { BudsEditing } from "app/hooks/BudsEditing";
import { ViewBud, ViewBudUIType } from "app/hooks";
import { BinPicksEditing } from "../binPick";

export abstract class BinBudsEditing extends BudsEditing<BinRow> {
    readonly values: ValRow = { buds: {} } as any;
    readonly entityBin: EntityBin;
    readonly sheetStore: SheetStore;
    iValue: number;
    iBase: number;
    xValue: number;
    xBase: number;
    onDel: () => Promise<void>;

    constructor(sheetStore: SheetStore, bin: EntityBin, buds: BizBud[], initBinRow?: BinRow) {
        super(sheetStore.modal, sheetStore.biz, buds);
        this.sheetStore = sheetStore;
        this.entityBin = bin;
        this.budValuesTool = new BinRowValuesTool(this, bin, buds);
        if (initBinRow !== undefined) {
            this.setValues(initBinRow);
        }
    }

    private setValues(binRow: BinRow) {
        Object.assign(this.values, binRow);
        let obj = new Proxy(binRow, this.entityBin.proxyHandler());
        this.addNamedValues(undefined, obj);
    }

    protected override setBudObjectValue(bud: BizBud, result: { id: number; base: number; }) {
        switch (bud.name) {
            case 'i': this.iValue = result.id; this.iBase = result.base; break;
            case 'x': this.xValue = result.id; this.xBase = result.base; break;
        }
    }

    protected setBudValue(bud: BizBud, value: any) {
        this.budValuesTool.setBudValue(bud, this.values, value);
    }

    buildShowBuds(excludeBuds?: { [id: number]: boolean }): any[] {
        let ret: any[] = [];
        for (let field of this.fields) {
            const bud = field;
            const { valueSetType } = bud;
            if (this.budValuesTool.has(field) !== true || valueSetType !== ValueSetType.equ) continue;
            const { id } = bud;
            if (excludeBuds !== undefined) {
                if (excludeBuds[id] === true) continue;
            }
            let value = this.budValuesTool.getBudValue(field, this.values);
            if (value === null || value === undefined) continue;
            ret.push(<ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} store={this.sheetStore} />);
        }
        return ret;
    }
}

export class DivEditing extends BinBudsEditing {
    readonly divStore: BinStore;
    readonly valDiv: ValDivBase;
    constructor(divStore: BinStore, valDiv: ValDivBase, namedResults?: NamedResults) {
        const { binDiv, valRow } = valDiv;
        super(divStore.sheetStore, divStore.entity, binDiv.buds, valRow);
        this.divStore = divStore;
        this.valDiv = valDiv;
        // 这里先强行设iBase和xBase from pend
        this.initNamedResults(namedResults);
        this.setValueDefault(valDiv);
    }

    private initNamedResults(namedResults: NamedResults) {
        if (namedResults === undefined) return;
        this.addNamedParams(namedResults);
        let pendValues = namedResults['pend'];
        if (pendValues === undefined) return;
        let { i, x, iBase, xBase } = pendValues;
        this.iValue = i;
        this.xValue = x;
        if (this.iBase === undefined) {
            if (iBase === undefined) {
                let specValues = namedResults['spec'];
                if (specValues !== undefined) {
                    iBase = specValues.base;
                }
            }
            this.iBase = iBase;
        }
        this.xBase = xBase;
    }

    private setValueDefault(valDiv: ValDivBase) {
        const { value: budValue } = this.entityBin;
        if (budValue === undefined) return;
        if (this.budValuesTool.has(budValue) === false) return;
        if (this.budValuesTool.getBudValue(budValue, this.values) !== undefined) return;
        let pendLeft = this.divStore.getPendLeft(valDiv);
        if (pendLeft === undefined) return;
        this.budValuesTool.setBudValue(budValue, this.values, pendLeft);
    }

    buildViewBuds() {
        return this.budValuesTool.fields.map(field => {
            const bud = field;
            const { id } = bud;
            let value = this.budValuesTool.getBudValue(field, this.values);
            if (value === null || value === undefined) return null;
            return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} store={this.sheetStore} />;
        })
    }

    protected getOnPick(bud: BizBud): (() => void | Promise<void>) {
        let { onPicks } = this.entityBin;
        let pick = onPicks[bud.id];
        if (pick === undefined) return;
        if (this.namedResults === undefined) {
            debugger;
        }
        return async () => {
            let binPicksEditing = new BinPicksEditing(this.divStore.sheetStore, this.entityBin);
            await binPicksEditing.runBinPick(pick);
        };
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
