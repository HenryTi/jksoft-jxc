import { EntitySheet, EntityBin, Biz } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UqExt } from "uqs/UqDefault";
import { atom } from "jotai";
import { from62, getAtomValue, setAtomValue } from "tonwa-com";
import { PickResults } from "./binPick/useBinPicks";
import { Calc, CalcCells } from "app/hooks/Calc";


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
    async start(pick: () => Promise<PickResults>) {
        const row = this.binRow;
        const { id } = row;
        if (id > 0) return;
        const results = await pick();
        const { i, x } = this.entityMain;
        const cells: CalcCells = {};
        if (i !== undefined) {
            cells['i'] = { value: undefined, formula: i.defaultValue };
        }
        if (x !== undefined) {
            cells['x'] = { value: undefined, formula: x.defaultValue };
        }
        const calc = new Calc(cells, results.props);
        calc.run(undefined);
        if (i !== undefined) {
            row.i = calc.getValue('i') as number;
        }
        if (x !== undefined) {
            row.x = calc.getValue('x') as number;
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
        return Object.assign(ret, { i });
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
}
export interface PendRow {
    pend: number;               // pend id
    sheet: SheetRow;
    detail: BinRow;
    value: number;
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
    pending: Row[];

    addRowValues(rowValues: any[]) {
        const sections = getAtomValue(this._sections);
        for (let rowValue of rowValues) {
            this.addRowValue(sections, rowValue);
        }
        setAtomValue(this._sections, [...sections]);
    }

    private addRowValue(sections: Section[], rowValue: any) {
        const { i, x, value } = rowValue;
        if (!i || !value) return;
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
        const { uq, main } = this.sheetStore;
        let sheet = await main.createIfNotExists();
        if (sheet === undefined) {
            debugger;
            let err = '新建单据不成功';
            console.error(err);
            throw new Error(err);
        }
        const { id } = await uq.SaveDetail.submit({
            base: main.binRow.id,
            phrase: this.section.coreDetail.entityBin.id,
            ...this.props,
        });
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
        Object.assign(this.props, row);
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

    async addRowProps(rowProps: BinDetail) {
        let row = new Row(this);
        row.setValue(rowProps);
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
        let { main, details, buds } = await this.uq.GetSheet.query({ id });
        const budColl: { [row: number]: { [bud: number]: string | number } } = {};
        for (let { id, bud, value } of buds) {
            let budValues = budColl[id];
            if (budValues === undefined) {
                budColl[id] = budValues = {};
            }
            budValues[bud] = value;
        }
        let mainRow = main[0];
        (mainRow as any).buds = budColl[id] ?? {};
        this.main.setValue(mainRow);
        for (let row of details) {
            const { id } = row;
            (row as any).buds = budColl[id] ?? {};
        }
        this.detail.addRowValues(details);
    }

    async discard() {
        // 作废草稿单据
        let { binRow: { id } } = this.main;
        if (id >= 0) {
            await this.uq.RemoveDraft.submit({ id });
            return id;
        }
    }
    async start(pick: () => Promise<PickResults>) {
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
