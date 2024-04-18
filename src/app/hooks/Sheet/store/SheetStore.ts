import { EntitySheet, EntityBin, Biz, EntityPend, BinRow, BizBud } from "app/Biz";
import { ParamSaveDetail, UqExt } from "uqs/UqDefault";
import { Atom, WritableAtom, atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { PickFunc, RearPickResultType, ReturnUseBinPicks } from "./NamedResults";
import { Calc, Formulas } from "app/hooks/Calc";
import { BudsColl, budValuesFromProps } from "../../tool";
import { BudEditing } from "../../Bud";
import { ValRow } from "./tool";
import { DivStore } from "./DivStore";
import { useParams } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { useRef } from "react";
import { PickStates, SheetConsole } from "./SheetConsole";

abstract class KeyIdObject {
    private static __keyId = 0;
    readonly keyId: number;
    constructor() {
        this.keyId = ++KeyIdObject.__keyId;
    }
}

abstract class BaseObject extends KeyIdObject {
    readonly sheetStore: SheetStore;
    constructor(sheetStore: SheetStore) {
        super();
        this.sheetStore = sheetStore;
    }
}

export class SheetMain extends BaseObject {
    readonly budEditings: BudEditing[];
    readonly entityMain: EntityBin;
    readonly _valRow = atom<ValRow>({ buds: {} } as ValRow);
    get valRow() { return getAtomValue(this._valRow) }
    no: string;

    constructor(sheetStore: SheetStore) {
        super(sheetStore);
        let { main } = sheetStore.entitySheet;
        this.entityMain = main;
        this.budEditings = main.buds.map(v => new BudEditing(v));
    }

    // return: true: new sheet created
    async start(pick: PickFunc) {
        const row = this.valRow;
        const { id } = row;
        if (id > 0) return;
        const pickResults = await pick(this.sheetStore, RearPickResultType.scalar);
        let ret = await this.startFromPickResults(pickResults);
        setAtomValue(this.sheetStore.atomLoaded, true);
        return ret;
    }

    async startFromPickResults(pickResults: ReturnUseBinPicks) {
        if (pickResults === undefined) return;
        const row = this.valRow;
        const { i, x, buds: mainProps } = this.entityMain;
        const formulas: Formulas = [];
        function getFormulaText(text: string) {
            if (text === undefined) return;
            let parts = text.split('\n');
            return parts[0];
        }
        if (i !== undefined) {
            formulas.push(['i', getFormulaText(i.defaultValue ?? 'i$pick')]);
        }
        if (x !== undefined) {
            formulas.push(['x', getFormulaText(x.defaultValue ?? 'x$pick')]);
        }
        for (let mp of mainProps) {
            formulas.push([mp.name, getFormulaText(mp.defaultValue)]);
        }
        let { namedResults, rearBinPick: lastBinPick, rearResult: lastResult } = pickResults;
        const calc = new Calc(formulas, namedResults);
        calc.addValues(lastBinPick.name, lastResult[0]);
        const { results: calcResults } = calc;
        if (i !== undefined) {
            row.i = calcResults.i as number;
        }
        if (x !== undefined) {
            row.x = calcResults.x as number;
        }
        for (let mp of mainProps) {
            let v = calcResults[mp.name];
            if (v === undefined) continue;
            row.buds[mp.id] = v;
        }
        setAtomValue(this._valRow, row);
        return await this.createIfNotExists();
    }

    private async createIfNotExists() {
        const row = this.valRow;
        let { id: sheetId, i, x } = row;
        if (sheetId > 0) {
            // setAtomValue(this.sheetStore.atomLoaded, true);
            return {
                id: sheetId,
                no: this.no,
                i,
                x,
            };
        }
        let ret = await this.sheetStore.saveSheet(this.valRow);
        let { id, no } = ret;
        row.id = id;
        setAtomValue(this._valRow, { ...row });
        this.no = no;
        // setAtomValue(this.sheetStore.atomLoaded, true);
        return Object.assign(ret, { i, ...row });
    }

    setValue(value: any) {
        const { no } = value;
        this.no = no;
        setAtomValue(this._valRow, value);
    }

    setId(id: number) {
        let row = this.valRow;
        setAtomValue(this._valRow, { ...row, id });
    }

    trigger() {
        let ok = true;
        const { buds } = this.valRow;
        for (let be of this.budEditings) {
            if (be.trigger(buds[be.bizBud.id]) === false) ok = false;
        }
        return ok;
    }
}

export interface SheetRow extends ValRow {
    no: string;
}

export interface PendRow {
    pend: number;               // pend id
    origin: number;
    detail: BinRow;
    value: number;
    mid: any[];
}

class Detail extends BaseObject {
    readonly entityBin: EntityBin;
    readonly caption: string;
    constructor(sheetStore: SheetStore, entityBin: EntityBin, caption: string) {
        super(sheetStore);
        this.entityBin = entityBin;
        this.caption = caption ?? entityBin.caption;
    }
}

// 多余的Detail，只能手工输入
export class ExDetail extends Detail {
}

export class SheetStore extends KeyIdObject {
    readonly uq: UqExt;
    readonly biz: Biz;
    readonly entitySheet: EntitySheet;
    readonly sheetConsole: SheetConsole;
    readonly main: SheetMain;
    readonly detail: Detail;
    readonly detailExs: ExDetail[] = [];
    readonly caption: string;
    readonly backIcon = 'file-text-o';
    readonly isPend: boolean;
    readonly budsColl: BudsColl = {};
    readonly divStore: DivStore;
    readonly atomLoaded = atom(false);

    constructor(entitySheet: EntitySheet, sheetConsole: SheetConsole) {
        super();
        const { biz } = entitySheet;
        const { uq } = biz;
        this.uq = uq;
        this.biz = biz;
        this.entitySheet = entitySheet;
        this.sheetConsole = sheetConsole;
        this.main = new SheetMain(this);
        const { details } = this.entitySheet;
        let len = details.length;
        if (len > 0) {
            const { bin: detail, caption } = details[0];
            this.detail = new Detail(this, detail, caption);
            this.isPend = this.detail.entityBin.pend !== undefined;
        }
        for (let i = 1; i < len; i++) {
            const { bin: detail, caption } = details[i];
            this.detailExs.push(new ExDetail(this, detail, caption));
        }
        this.caption = entitySheet.caption ?? entitySheet.name;
        this.divStore = new DivStore(this, this.detail.entityBin);
        sheetConsole.picks = new PickStates(
            { '%sheet': new Proxy(this.main.valRow, this.main.entityMain.proxyHandler()) },
            undefined,
            0
        );
    }

    async load(sheetId: number) {
        let { main, details } = await this.loadBinData(sheetId);
        if (main === undefined) return;
        this.main.setValue(main);
        this.divStore.load(details);
        setAtomValue(this.atomLoaded, true);
    }

    async setValRow(valRow: ValRow) {
        const { id: binId } = valRow;
        await this.loadBinData(binId);
        this.divStore.setValRow(valRow);
    }

    hasId() {
        return this.main.valRow?.id !== undefined;
    }

    // whole sheet or row detail
    private async loadBinData(binId: number) {
        let { main, details, props } = await this.uq.GetSheet.query({ id: binId });
        const budsColl = budValuesFromProps(props);
        Object.assign(this.budsColl, budsColl);
        let mainRow = main[0];
        if (mainRow !== undefined) {
            (mainRow as any).buds = budsColl[binId] ?? {};
        }
        for (let row of details) {
            const { id } = row;
            (row as any).buds = budsColl[id] ?? {};
        }
        return { main: mainRow, details };
    }

    async discard() {
        // 作废草稿单据
        let { valRow: { id } } = this.main;
        if (id >= 0) {
            await this.uq.RemoveDraft.submit({ id });
            return id;
        }
    }
    async start(pick: PickFunc) {
        let ret = await this.main.start(pick);
        if (ret !== undefined) return ret;
    }

    async saveProp(id: number, bud: number, int: number, dec: number, str: string) {
        await this.uq.SaveBudValue.submit({ phraseId: bud, id, int, dec, str });
    }

    async uqGetPend(entityPend: EntityPend, params: any, pendId: number) {
        let ret = await this.uq.GetPend.page({ pendEntity: entityPend.id, params, pendId }, undefined, 100);
        return ret;
    }

    async delDetail(id: number) {
        await this.uq.DeleteBin.submit({ id });
    }

    private getPropArr(valRow: ValRow, buds: BizBud[]) {
        const { buds: budsValues } = valRow;
        let propArr: [number, string | number, number][] = [];
        for (let bud of buds) {
            let { id, budDataType } = bud;
            let value = (budsValues as any)[id];
            if (value === undefined) continue;
            propArr.push([id, value, budDataType.type]);
        }
        return propArr;
    }

    async saveSheet(valRow: ValRow) {
        let propArr = this.getPropArr(valRow, this.main.entityMain.buds);
        let { id: sheetId, i, x } = valRow;
        const { uq, entitySheet } = this;
        let ret = await uq.SaveSheet.submit({
            phrase: entitySheet.id,
            no: undefined,
            i: i === 0 ? undefined : i,
            x: x === 0 ? undefined : x,
            value: undefined,
            price: undefined,
            amount: undefined,
            props: propArr,
        });
        let { id, no } = ret;
        return { id, no };
    }

    async saveDetail(entityBin: EntityBin, buds: BizBud[], valRow: ValRow) {
        let { id, i, x, value, price, amount, pend, origin } = valRow;
        let propArr = this.getPropArr(valRow, buds);
        let param: ParamSaveDetail = {
            base: this.main.valRow.id,
            phrase: entityBin.id,
            id,
            i,
            x,
            value,
            price,
            amount,
            origin,
            pend,
            props: propArr,
        };
        let retSaveDetail = await this.uq.SaveDetail.submitReturns(param);
        id = retSaveDetail.ret[0].id;
        return id;
    }

    notifyRowChange() {
        this.sheetConsole.sheetRowCountChanged(this);
    }

    async setSheetAsDraft() {
        await this.uq.SetSheetPreToDraft.submit({ id: this.main.valRow.id });
        setAtomValue(this.atomLoaded, true);
    }
}

export function useSheetEntity() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    return entitySheet;
}
/*
export function useSheetStore(entitySheet: EntitySheet, sheetConsole: SheetConsole) {
    const refSheetStore = useRef(new SheetStore(entitySheet, sheetConsole));
    return refSheetStore.current;
}
*/
