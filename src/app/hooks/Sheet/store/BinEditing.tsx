import {
    BinRow, BizBud, EntityBin, BinRowValuesTool,
    ValueSetType,
    BudValuesToolBase,
    BinPick,
    PickAtom,
    PickSpec,
    PickQuery,
    PickPend,
    Entity,
    PickOptions
} from "app/Biz";
import { BinStore } from "./BinStore";
import { SheetStore } from "./SheetStore";
import { ValDivBase } from "./ValDiv";
import { RearPickResultType } from "./PickResult";
import { ValRow } from "./ValRow";
import { BudsEditing } from "app/hooks/BudsEditing";
import { PickResult, ViewBud, ViewBudUIType } from "app/hooks";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { BizPhraseType } from "uqs/UqDefault";
import { pickFromAtom } from "../binPick/pickFromAtom";
import { pickFromSpec } from "../binPick/pickFromSpec";
import { pickFromQuery, pickFromQueryScalar } from "app/hooks/Query";
import { pickFromPend } from "../binPick/pickFromPend";
import { atom } from "jotai";
import { pickFromOptions } from "../binPick/pickFromOptions";
// import { SheetEditing } from "../binPick";

export class BinBudsEditing extends BudsEditing<ValRow> {
    // readonly values: ValRow = { buds: {} } as any;
    readonly atomChanging = atom(0);
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
        this.setBudValuesTool(new BinRowValuesTool(/*this, */bin, buds));
        const { userProxy, mainProxy } = sheetStore;
        this.setNamedValues(undefined, {
            'user': userProxy,
            '%user': userProxy,
            '%sheet': mainProxy,
        });
        if (initBinRow !== undefined) {
            this.setValues(initBinRow);
        }
    }

    get store() { return this.sheetStore; }

    getEntityFromId(id: number): Entity {
        const ret = this.sheetStore.getCacheAtom(id);
        if (ret === undefined) {
            debugger;
            return;
        }
        const { atom, entityID } = ret;
        return entityID;
    }

    protected createBudValuesTool(): BudValuesToolBase<ValRow> {
        return new BinRowValuesTool(/*this, */this.entityBin, this.buds);
    }

    private setValues(binRow: BinRow) {
        Object.assign(this.values, binRow);
        let obj = new Proxy(binRow, this.entityBin.proxyHandler());
        this.setNamedValues(undefined, obj);
    }

    protected override setBudObjectValue(bud: BizBud, result: { id: number; base: number; }) {
        switch (bud.name) {
            case 'i': this.iValue = result.id; this.iBase = result.base; break;
            case 'x': this.xValue = result.id; this.xBase = result.base; break;
        }
    }

    buildShowBuds(excludeBuds?: { [id: number]: boolean }): any[] {
        let ret: any[] = [];
        for (let field of this.fields) {
            const bud = field;
            const { valueSetType } = bud;
            // if (this.budValuesTool.has(field) !== true || valueSetType !== ValueSetType.equ) continue;
            if (this.hasBud(field) !== true || valueSetType !== ValueSetType.equ) continue;
            const { id } = bud;
            if (excludeBuds !== undefined) {
                if (excludeBuds[id] === true) continue;
            }
            // let value = this.budValuesTool.getBudValue(field, this.values);
            let value = this.getBudValue(field);
            if (value === null || value === undefined) continue;
            ret.push(<ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} store={this.sheetStore} />);
        }
        return ret;
    }

    setChanging() {
        setAtomValue(this.atomChanging, getAtomValue(this.atomChanging) + 1);
    }

    async runBinPick1(binPick: BinPick) {
        const { name, fromPhraseType } = binPick;
        if (fromPhraseType === undefined) return; // break;
        let pickResult: PickResult = await this.switchPhraseType(binPick);
        if (pickResult === undefined) return;
        this.setNamedValues(name, pickResult);
        return pickResult;
    }

    private async switchPhraseType(pick: BinPick) {
        let pickResult: PickResult;
        switch (pick.fromPhraseType) {
            default: break;
            /*
            case BizPhraseType.any:
                pickResult = this.getBudComposingValue(pick);
                break;
            */
            case BizPhraseType.atom:
                pickResult = await pickFromAtom(this, pick as PickAtom);
                break;
            case BizPhraseType.fork:
                pickResult = await pickFromSpec(this, pick as PickSpec);
                break;
            case BizPhraseType.query:
                pickResult = await pickFromQueryScalar(this, pick as PickQuery);
                break;
            case BizPhraseType.options:
                pickResult = await pickFromOptions(this.modal, pick as PickOptions);
                break;
        }
        return pickResult;
    }

    async runBinPickRear(binStore: BinStore, rearPick: BinPick, rearPickResultType: RearPickResultType) {
        const { fromPhraseType } = rearPick;
        switch (fromPhraseType) {
            default: break;
            case BizPhraseType.query:
                if (rearPickResultType === RearPickResultType.array) {
                    return await pickFromQuery(this, rearPick as PickQuery, rearPickResultType);
                }
                break;
            case BizPhraseType.pend:
                return await pickFromPend(binStore, this, rearPick as PickPend);
        }
        let pickResult = await this.switchPhraseType(rearPick);
        if (pickResult !== undefined) return pickResult;
    }

    /*
    getOnPick(bud: BizBud): (() => number | Promise<number>) {
        let { onPicks } = this.entityBin;
        let pick = onPicks[bud.id];
        if (pick === undefined) return;
        return async () => {
            let ret = await this.runBinPick(pick);
            let retId = (ret as any).id;
            return retId;
        };
    }
    */
    getPick(bud: BizBud) {
        let { onPicks } = this.entityBin;
        let pick = onPicks[bud.id];
        return pick;
    }
}

export class DivEditing extends BinBudsEditing {
    readonly binStore: BinStore;
    readonly valDiv: ValDivBase;
    constructor(binStore: BinStore, valDiv: ValDivBase, namedResults?: any) {
        const { binDiv, valRow } = valDiv;
        const { sheetStore, entity } = binStore;
        super(sheetStore, entity, binDiv.buds, valRow);
        this.binStore = binStore;
        this.valDiv = valDiv;
        // 这里先强行设iBase和xBase from pend
        this.initNamedResults(namedResults);
        this.setValueDefault(valDiv);
    }

    setPendResult(pendResult: object) {
        if (pendResult === undefined) return;
        this.setNamedValues('pend', pendResult);
        this.setNamedValues('%pend', pendResult);
        let pendValues = this.getNameValues('pend') as any; // namedResults['pend'];
        if (pendValues === undefined) return;
        let { i, x, iBase, xBase } = pendValues;
        this.iValue = i;
        this.xValue = x;
        if (this.iBase === undefined) {
            if (iBase === undefined) {
                let specValues = this.getNameValues('spec') as any; // namedResults['spec'];
                if (specValues !== undefined) {
                    iBase = specValues.base;
                }
            }
            this.iBase = iBase;
        }
        this.xBase = xBase;
    }

    private initNamedResults(namedResults: any) {
        if (namedResults === undefined) return;
        this.addNamedParams(namedResults);
        this.setPendResult(namedResults);
        /*
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
        */
    }

    private setValueDefault(valDiv: ValDivBase) {
        const { value: budValue } = this.entityBin;
        if (budValue === undefined) return;
        if (this.hasBud(budValue) === false) return;
        if (this.getBudValue(budValue) !== undefined) return;
        let pendLeft = this.binStore.getPendLeft(valDiv);
        if (pendLeft === undefined) return;
        this.setBudValue(budValue, pendLeft);
    }

    buildViewBuds() {
        let buds = this.getBuds();
        return buds.map(bud => {
            const { id } = bud;
            let value = this.getBudValue(bud);
            if (value === null || value === undefined) return null;
            return <ViewBud key={id} bud={bud} value={value} uiType={ViewBudUIType.inDiv} store={this.sheetStore} />;
        })
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
