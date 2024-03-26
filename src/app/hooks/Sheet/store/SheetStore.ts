import { EntitySheet, EntityBin, Biz, EnumBudType, EntityPend, BinRow, BizBud } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { ParamSaveDetail, ReturnGetPendRetSheet, UqExt } from "uqs/UqDefault";
import { WritableAtom, atom } from "jotai";
import { from62, getAtomValue, setAtomValue } from "tonwa-com";
import { PickFunc, RearPickResultType, ReturnUseBinPicks } from "./NamedResults";
import { Calc, Formulas } from "app/hooks/Calc";
import { budValuesFromProps } from "../../tool";
import { BudEditing } from "../../Bud";
import { ValRow } from "./tool";
import { DivStore } from "./DivStore";

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
        return await this.startFromPickResults(pickResults);
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

    async createIfNotExists() {
        const row = this.valRow;
        let { id: sheetId, i, x } = row;
        if (sheetId > 0) {
            setAtomValue(this.sheetStore.atomLoaded, true);
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
        setAtomValue(this.sheetStore.atomLoaded, true);
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
    cols: any[];
}

abstract class DetailBase extends BaseObject {
    readonly entityBin: EntityBin;
    readonly caption: string;
    constructor(sheetStore: SheetStore, entityBin: EntityBin, caption: string) {
        super(sheetStore);
        this.entityBin = entityBin;
        this.caption = caption ?? entityBin.caption;
    }

    abstract addRowValues(rowValues: any): void;
}

export class CoreDetail extends DetailBase {
    readonly _sections = atom<Section[]>([]);
    origin: {
        main: SheetMain;
        rows: Row[];
    }

    addRowValues(rowValues: any[]) {
        const sections = getAtomValue(this._sections);
        for (let rowValue of rowValues) {
            this.addRowValue(sections, rowValue);
        }
        setAtomValue(this._sections, [...sections]);
    }

    setRowValues(rowValues: any[]) {
        const sections = getAtomValue(this._sections);
        for (let section of sections) {
            section.setRowValues(rowValues);
        }
    }

    private addRowValue(sections: Section[], rowValue: ValRow) {
        const { i, x, value, pend } = rowValue;
        if (i === undefined || value === undefined) return;
        let detailSection: Section;
        if (x) {
            let index = sections.findIndex(v => v.i === i);
            if (index < 0) {
                detailSection = new Section(this);
                detailSection.i = i;
                sections.push(detailSection);
            }
            else {
                detailSection = sections[index];
            }
        }
        else {
            detailSection = new Section(this);
            sections.push(detailSection);
        }
        let row = new Row(detailSection);
        row.setValue(rowValue);
        detailSection.addRow(row);
        this.sheetStore.addPendRow(pend, row);
        return row;
    }

    addSection(detailSection: Section) {
        const sections = getAtomValue(this._sections);
        setAtomValue(this._sections, [...sections, detailSection]);
    }

    async delEmptySection(section: Section) {
        if (section.isEmpty === false) return;
        let sections = getAtomValue(this._sections);
        let index = sections.findIndex(v => v === section);
        if (index >= 0) {
            sections.splice(index, 1);
            setAtomValue(this._sections, [...sections]);
        }
    }
}

// 多余的Detail，只能手工输入
export class ExDetail extends DetailBase {
    addRowValues(rowValues: any) {
        return;
    }
}

export class Row extends BaseObject {
    readonly atomLoading = atom(false);
    readonly section: Section;
    readonly valRow: ValRow = { buds: {} } as any;

    constructor(section: Section) {
        super(section.sheetStore);
        this.section = section;
    }

    setLoading(loading: boolean) {
        setAtomValue(this.atomLoading, loading);
    }

    private async save() {
        const { uq, main, detail } = this.sheetStore;
        let sheet = await main.createIfNotExists();
        if (sheet === undefined) {
            debugger;
            let err = '新建单据不成功';
            console.error(err);
            throw new Error(err);
        }

        let entityBin = this.section.coreDetail.entityBin;
        let id = await this.sheetStore.saveDetail(entityBin, entityBin.buds, this.valRow);
        let org = this.valRow.id;
        if (org !== undefined && id !== org) {
            console.error(`save detail id changed, org: ${org}, new: ${id}`);
        }
        this.valRow.id = id;
    }

    async addToSection() {
        await this.save();
        this.section.addRow(this);
    }

    async delFromSection() {
        const { uq } = this.sheetStore;
        await uq.DeleteBin.submit({ id: this.valRow.id });
        this.section.delRow(this);
    }

    async changed() {
        await this.save();
        this.section.rowChanged();
    }

    setValue(valRow: ValRow) {
        let { i, x, value, price, amount } = this.section.coreDetail.entityBin;
        this.valRow.id = valRow.id;
        if (i !== undefined) this.valRow.i = valRow.i;
        if (x !== undefined) this.valRow.x = valRow.x;
        if (value !== undefined) this.valRow.value = valRow.value;
        if (price !== undefined) this.valRow.price = valRow.price;
        if (amount !== undefined) this.valRow.amount = valRow.amount;
        this.valRow.origin = valRow.origin;
        this.valRow.buds = valRow.buds;
        this.valRow.pend = valRow.pend;
        this.valRow.owned = valRow.owned;
    }
}

export class Section extends BaseObject {
    readonly coreDetail: CoreDetail;
    readonly _rows = atom<Row[]>([]);
    i: number;           // item 作为key，来标明section

    constructor(coreDetail: CoreDetail) {
        super(coreDetail.sheetStore);
        this.coreDetail = coreDetail;
    }

    get isEmpty() {
        let rows = getAtomValue(this._rows);
        return rows.length === 0;
    }

    addRow(row: Row) {
        let rows = getAtomValue(this._rows);
        setAtomValue(this._rows, [...rows, row]);
    }

    setRowValues(rowValues: any[]) {
        let rows = getAtomValue(this._rows);
        let changed = false;
        for (let row of rows) {
            let { id } = row.valRow;
            for (let rowValue of rowValues) {
                if (id === rowValue.id) {
                    row.setValue(rowValue);
                    changed = true;
                }
            }
        }
        if (changed === true) this.rowChanged();
    }

    async addRowProps(row: Row, valRow: ValRow) {
        row.setValue(valRow);
        await row.addToSection();
    }

    delRow(row: Row) {
        let rows = getAtomValue(this._rows);
        let index = rows.findIndex(v => v === row);
        if (index >= 0) {
            rows.splice(index, 1);
            setAtomValue(this._rows, [...rows]);
        }
        this.coreDetail.delEmptySection(this);
    }

    rowChanged() {
        let rows = getAtomValue(this._rows);
        setAtomValue(this._rows, [...rows]);
    }
}

export class SheetStore extends KeyIdObject {
    readonly uq: UqExt;
    readonly biz: Biz;
    readonly entitySheet: EntitySheet;
    readonly main: SheetMain;
    readonly detail: CoreDetail;
    readonly detailExs: ExDetail[] = [];
    readonly caption: string;
    readonly backIcon = 'file-text-o';
    readonly isPend: boolean;
    // readonly idOnUrl: number;
    pendColl: { [pend: number]: WritableAtom<Section[], any, any> };
    readonly divStore: DivStore;
    readonly atomLoaded = atom(false);

    constructor(uq: UqExt, biz: Biz, entitySheet: EntitySheet) {
        super();
        this.uq = uq;
        this.biz = biz;
        this.entitySheet = entitySheet;
        this.main = new SheetMain(this);
        const { details } = this.entitySheet;
        let len = details.length;
        if (len > 0) {
            const { bin: detail, caption } = details[0];
            this.detail = new CoreDetail(this, detail, caption);
            this.isPend = this.detail.entityBin.pend !== undefined;
        }
        for (let i = 1; i < len; i++) {
            const { bin: detail, caption } = details[i];
            this.detailExs.push(new ExDetail(this, detail, caption));
        }
        this.caption = entitySheet.caption ?? entitySheet.name;
        this.divStore = new DivStore(this, this.detail.entityBin);
    }

    async load(sheetId: number) {
        // let { id } = this.main.valRow;
        // if (id === undefined || id === 0) return;
        let { main, details } = await this.loadBinData(sheetId);
        if (main === undefined) return;
        this.main.setValue(main);
        this.divStore.load(details);
        if (this.detail !== undefined) {
            this.detail.addRowValues(details);
        }
        setAtomValue(this.atomLoaded, true);
    }

    async reloadRow(valRow: ValRow) {
        const { id: binId } = valRow;
        let { details } = await this.loadBinData(binId);
        this.detail.setRowValues(details);
    }

    hasId() {
        return this.main.valRow?.id !== undefined;
    }

    // whole sheet or row detail
    private async loadBinData(binId: number) {
        let { main, details, props } = await this.uq.GetSheet.query({ id: binId });
        const { budColl, ownerColl } = budValuesFromProps(props);
        let mainRow = main[0];
        if (mainRow !== undefined) {
            (mainRow as any).buds = budColl[binId] ?? {};
            (mainRow as any).owned = ownerColl[binId] ?? {};
        }
        for (let row of details) {
            const { id } = row;
            (row as any).buds = budColl[id] ?? {};
            (row as any).owned = ownerColl[id] ?? {};
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

    addPendRow(pend: number, row: Row) {
        if (this.pendColl === undefined) return;
        let _sections = this.pendColl[pend];
        if (_sections === undefined) {
            debugger;
        }
        let sections = getAtomValue(_sections);
        let { id: rowId } = row.valRow;
        for (let section of sections) {
            const { _rows } = section;
            let rows = getAtomValue(_rows);
            if (rows.findIndex(v => v.valRow.id === rowId) >= 0) {
                setAtomValue(_rows, [...rows]);
                return;
            }
        }
        let { section } = row;
        if (section === undefined) {
            section = new Section(this.detail);
            section.addRow(row);
        }
        sections.push(section);
        setAtomValue(_sections, [...sections]);
    }

    addBinDetail(valRow: ValRow) {
        let { pend } = valRow;
        let _sections = this.pendColl[pend];
        if (_sections === undefined) {
            debugger;
        }
        let section: Section = new Section(this.detail);
        let row: Row = new Row(section);
        Object.assign(row.valRow, valRow);
        const { _rows } = section;
        let rows = getAtomValue(_rows);
        rows.push(row);
        setAtomValue(_rows, [...rows]);
        let sections = getAtomValue(_sections);
        sections.push(section);
        setAtomValue(_sections, [...sections]);
        console.log('addBinDetail', sections, rows);
    }

    delPendRow(row: Row) {
        let pend = row.valRow.pend;
        let _sections = this.pendColl[pend];
        if (_sections === undefined) return;
        let sections = getAtomValue(_sections);
        for (let section of sections) {
            const { _rows } = section;
            let rows = getAtomValue(_rows);
            let p = rows.findIndex(v => v.valRow.pend === pend);
            if (p < 0) continue;
            rows.splice(p, 1);
            break;
        }
    }
    /*
    async loadPend(entityPend: EntityPend, params: any): Promise<{ pendRows: PendRow[]; ownerColl: OwnerColl; }> {
        let ret = await this.uq.GetPend.page({ pendEntity: entityPend.id, params, pendId: undefined }, undefined, 100);
        this.pendColl = {};
        let { $page, retSheet, props: showBuds } = ret;
        const { ownerColl, budColl } = budValuesFromProps(showBuds);
        let collSheet: { [id: number]: ReturnGetPendRetSheet } = {};
        for (let v of retSheet) {
            collSheet[v.id] = v;
        };
        let pendRows: PendRow[] = [];
        // build pendColl;
        for (let v of $page) {
            let { id, pend, pendValue, mid, cols } = v;
            if (pendValue === undefined || pendValue <= 0) continue;
            this.pendColl[pend] = atom([]);
            let propArr: Prop[] = arrFromJsonArr(entityPend, cols);
            let midArr = arrFromJsonMid(entityPend, mid);
            let pendRow: PendRow = {
                pend,
                // sheet: { ...collSheet[v.sheet], buds: {}, owned: undefined },
                detail: { ...v, buds: {}, owned: undefined },
                origin: id,
                value: pendValue,
                mid: midArr,
                cols: propArr,
            };
            pendRows.push(pendRow);
        }
        return { pendRows, ownerColl };
    }
    */
    async uqGetPend(entityPend: EntityPend, params: any, pendId: number) {
        let ret = await this.uq.GetPend.page({ pendEntity: entityPend.id, params, pendId }, undefined, 100);
        return ret;
    }

    async delDetail(id: number) {
        await this.uq.DeleteBin.submit({ id });
    }

    private getPropArr(valRow: ValRow, buds: BizBud[]) {
        const { buds: budsValues } = valRow;
        let propArr: [number, 'int' | 'dec' | 'str', string | number][] = [];
        for (let bud of buds) {
            let { id, name, budDataType } = bud;
            let value = (budsValues as any)[id];
            if (value === undefined) continue;
            let type: 'int' | 'dec' | 'str';
            switch (budDataType.type) {
                default:
                case EnumBudType.atom:
                case EnumBudType.int: type = 'int'; break;
                case EnumBudType.dec: type = 'dec'; break;
                case EnumBudType.str:
                case EnumBudType.char: type = 'str'; break;
            }
            if (type === undefined) continue;
            propArr.push([id, type, value]);
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
}
/*
export function useSheetStore() {
    const { uq, biz } = useUqApp();
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const sheetId = from62(id);
    const { current: sheetStore } = useRef<SheetStore>(new SheetStore(
        uq,
        biz,
        entitySheet,
        id === undefined ? undefined : sheetId
    ));
    useQuery([entityId62, id], async () => sheetStore.load(), UseQueryOptions);
    return sheetStore;
}
*/