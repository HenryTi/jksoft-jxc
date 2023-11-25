import { EntitySheet, EntityBin, Biz, EnumBudType } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UqExt } from "uqs/UqDefault";
import { atom } from "jotai";
import { from62, getAtomValue, setAtomValue } from "tonwa-com";
import { LastPickResultType, ReturnUseBinPicks } from "./binPick/useBinPicks";
import { Calc, Formulas } from "app/hooks/Calc";
import { BudCheckValue, BudValue } from "tonwa-app";
import { budValuesFromProps } from "../tool/tool";

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
    readonly entityMain: EntityBin;
    readonly _binRow = atom<BinRow>({ buds: {} } as BinRow);
    get binRow() { return getAtomValue(this._binRow) }
    no: string;

    constructor(sheetStore: SheetStore) {
        super(sheetStore);
        this.entityMain = sheetStore.entitySheet.main;
    }

    // return: true: new sheet created
    async start(pick: (pickResultType: LastPickResultType) => Promise<ReturnUseBinPicks>) {
        const row = this.binRow;
        const { id } = row;
        if (id > 0) return;
        const pickResults = await pick(LastPickResultType.scalar);
        if (pickResults === undefined) return;
        const { i, x, props: mainProps } = this.entityMain;
        const formulas: Formulas = {};
        if (i !== undefined) {
            formulas.i = i.defaultValue;
        }
        if (x !== undefined) {
            formulas.x = x.defaultValue;
        }
        for (let mp of mainProps) {
            formulas[mp.name] = mp.defaultValue;
        }
        let { results, lastBinPick, lastResult } = pickResults;
        const calc = new Calc(formulas, results);
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
        setAtomValue(this._binRow, row);
        return await this.createIfNotExists();
    }

    async createIfNotExists() {
        const row = this.binRow;
        let { id: sheetId, i, x } = row;
        if (sheetId > 0) return {
            id: sheetId,
            no: this.no,
            i,
            x,
        };
        const { uq, entitySheet } = this.sheetStore;
        let ret = await uq.SaveSheet.submit({
            phrase: entitySheet.id,
            no: undefined,
            i: i === 0 ? undefined : i,
            x: x === 0 ? undefined : x,
            value: undefined,
            price: undefined,
            amount: undefined,
        });
        let { id, no } = ret;
        row.id = id;
        setAtomValue(this._binRow, { ...row });
        this.no = no;
        return Object.assign(ret, { i, ...row });
    }

    setValue(value: any) {
        const { no } = value;
        this.no = no;
        setAtomValue(this._binRow, value);
    }

    setId(id: number) {
        let row = this.binRow;
        setAtomValue(this._binRow, { ...row, id });
    }
}

export interface SheetRow extends BinRow {
    no: string;
}
export interface BinRow {
    id: number;
    i: number;
    x: number;
    value: number;
    price: number;
    amount: number;
    buds: { [bud: number]: string | number };
    owned: { [bud: number]: [number, BudValue][] };
}
export interface PendRow {
    pend: number;               // pend id
    sheet: SheetRow;
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

    private addRowValue(sections: Section[], rowValue: any) {
        const { i, x, value } = rowValue;
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

export interface BinDetail extends BinRow {
    origin: number;             // origin detail id
    pendFrom: number;
    pendValue: number;
}

export class Row extends BaseObject {
    readonly section: Section;
    readonly props: BinDetail = { buds: {} } as any;

    constructor(section: Section) {
        super(section.sheetStore);
        this.section = section;
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
        let propArr: [number, 'int' | 'dec' | 'str', string | number][] = [];
        for (let bud of detail.entityBin.props) {
            let value = (this.props as any)[bud.name];
            if (value === undefined) continue;
            let type: 'int' | 'dec' | 'str';
            switch (bud.budDataType.type) {
                case EnumBudType.int: type = 'int'; break;
                case EnumBudType.dec: type = 'dec'; break;
                case EnumBudType.str:
                case EnumBudType.char: type = 'str'; break;
            }
            if (type === undefined) continue;
            propArr.push([bud.id, type, value]);
        }
        const { id } = await uq.SaveDetail.submit({
            base: main.binRow.id,
            phrase: this.section.coreDetail.entityBin.id,
            ...this.props,
            props: propArr,
        });
        if (id !== this.props.id) {
            console.error(`save detail id changed, org: ${this.props.id}, new: ${id}`);
        }
        this.props.id = id;
    }

    async addToSection() {
        await this.save();
        this.section.addRow(this);
    }

    async delFromSection() {
        const { uq } = this.sheetStore;
        await uq.DeleteBin.submit({ id: this.props.id });
        this.section.delRow(this);
    }

    async changed() {
        await this.save();
        this.section.rowChanged();
    }

    setValue(row: BinDetail) {
        let { i, x, value, price, amount } = this.section.coreDetail.entityBin;
        this.props.id = row.id;
        if (i !== undefined) this.props.i = row.i;
        if (x !== undefined) this.props.x = row.x;
        if (value !== undefined) this.props.value = row.value;
        if (price !== undefined) this.props.price = row.price;
        if (amount !== undefined) this.props.amount = row.amount;
        this.props.origin = row.origin;
        this.props.buds = row.buds;
        this.props.pendFrom = row.pendFrom;
        this.props.owned = row.owned;
        // Object.assign(this.props, row);
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
            let { id } = row.props;
            for (let rowValue of rowValues) {
                if (id === rowValue.id) {
                    row.setValue(rowValue);
                    changed = true;
                }
            }
        }
        if (changed === true) this.rowChanged();
    }

    async addRowProps(rowProps: BinDetail) {
        let row = new Row(this);
        row.setValue(rowProps);
        await row.addToSection();
        return row;
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
    readonly idOnUrl: number;

    constructor(uq: UqExt, biz: Biz, entitySheet: EntitySheet, id: number) {
        super();
        this.uq = uq;
        this.biz = biz;
        this.entitySheet = entitySheet;
        this.main = new SheetMain(this);
        if (id > 0) {
            this.idOnUrl = id;
            this.main.setId(id);
        }
        const { details } = this.entitySheet;
        let len = details.length;
        if (len > 0) {
            const { bin: detail, caption } = details[0];
            this.detail = new CoreDetail(this, detail, caption);
        }
        for (let i = 1; i < len; i++) {
            const { bin: detail, caption } = details[i];
            this.detailExs.push(new ExDetail(this, detail, caption));
        }
        this.caption = entitySheet.caption ?? entitySheet.name;
    }

    async load() {
        let { id } = this.main.binRow;
        if (id === undefined || id === 0) return;
        let { main, details } = await this.loadBinData(id);
        this.main.setValue(main);
        this.detail.addRowValues(details);
    }

    async reloadRow(binId: number) {
        let { details } = await this.loadBinData(binId);
        this.detail.setRowValues(details);
    }

    // whole sheet or row detail
    private async loadBinData(binId: number) {
        let { main, details, props } = await this.uq.GetSheet.query({ id: binId });
        const { budColl, ownerColl } = budValuesFromProps(props);
        /*
        const budColl: { [row: number]: { [bud: number]: BudValue } } = {};
        const ownerColl: { [row: number]: { [owner: number]: [number, BudValue][] } } = {};
        for (let { id, phrase, value, owner } of props) {
            let budValues = budColl[id];
            if (budValues === undefined) {
                budColl[id] = budValues = {};
            }
            switch (value.length) {
                default:
                case 0: debugger; break;
                case 1: budValues[phrase] = value[0]; break;
                case 2:
                    let checks = budValues[phrase] as BudCheckValue;
                    if (checks === undefined) {
                        budValues[phrase] = checks = [];
                    }
                    checks.push(value[1]);
                    break;
            }
        }
        for (let { id, phrase, owner } of props) {
            if (owner === 0) continue;
            let ownerValues = ownerColl[id];
            if (ownerValues === undefined) {
                ownerColl[id] = ownerValues = {};
            }
            let owned = ownerValues[owner];
            if (owned === undefined) {
                owned = [];
                ownerValues[owner] = owned;
            }
            owned.push([phrase, budColl[id][phrase]]);
        }
        */
        let mainRow = main[0];
        (mainRow as any).buds = budColl[binId] ?? {};
        (mainRow as any).owned = ownerColl[binId] ?? {};
        for (let row of details) {
            const { id } = row;
            (row as any).buds = budColl[id] ?? {};
            (row as any).owned = ownerColl[id] ?? {};
        }
        return { main: mainRow, details };
    }

    async discard() {
        // 作废草稿单据
        let { binRow: { id } } = this.main;
        if (id >= 0) {
            await this.uq.RemoveDraft.submit({ id });
            return id;
        }
    }
    async start(pick: (pickResultType: LastPickResultType) => Promise<ReturnUseBinPicks>) {
        let ret = await this.main.start(pick);
        if (ret !== undefined) return ret;
    }

    async saveProp(id: number, bud: number, int: number, dec: number, str: string) {
        await this.uq.SaveBudValue.submit({ phraseId: bud, id, int, dec, str });
    }
}

export function useSheetStore() {
    const { uq, biz } = useUqApp();
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const sheetId = from62(id);
    const refSheetStore = useRef<SheetStore>();
    if (refSheetStore.current === undefined) {
        refSheetStore.current = new SheetStore(
            uq,
            biz,
            entitySheet,
            id === undefined ? undefined : sheetId
        );
    }
    useQuery([entityId62, id], async () => refSheetStore.current.load(), UseQueryOptions);
    return refSheetStore.current;
}
