import { EntityAtom, EntitySheet, EntitySpec, EntityBin, EntityMain, Biz } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { PickFunc } from "../../BizPick";
import { UseQueryOptions } from "app/tool";
import { useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { UqExt } from "uqs/UqDefault";
import { atom } from "jotai";
import { from62, getAtomValue, setAtomValue } from "tonwa-com";


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

export class Main extends BaseObject {
    readonly entityMain: EntityMain;
    readonly _target = atom<number>(0);         // _ 开始，表示 atom
    readonly _id = atom<number>(0);
    get id() { return getAtomValue(this._id); }
    no: string;

    constructor(sheetStore: SheetStore) {
        super(sheetStore);
        this.entityMain = sheetStore.entitySheet.main;
    }

    // return: true: new sheet created
    async start(pick: PickFunc) {
        let { id } = this;
        if (id > 0) return;
        await this.pickTarget(pick);
        let target = getAtomValue(this._target);
        if (target > 0) {
            return await this.createIfNotExists();
        }
    }

    async pickTarget(pick: PickFunc) {
        const { target } = this.entityMain;
        if (target === undefined) return;
        let ret = await pick(target);
        if (ret === undefined) return;
        let { spec } = ret;
        setAtomValue(this._target, spec);
    }

    async createIfNotExists() {
        let sheetId = getAtomValue(this._id);
        let target = getAtomValue(this._target);
        if (sheetId > 0) return {
            id: sheetId,
            no: this.no,
            target,
        };
        const { uq, entitySheet } = this.sheetStore;
        // let no = await uq.IDNO({ ID: uq.Sheet });
        let ret = await uq.SaveSheet.submit({
            phrase: entitySheet.id,
            no: undefined,
            target: target === 0 ? undefined : target,
            value: undefined,
        });
        let { id, no } = ret;
        setAtomValue(this._id, id);
        this.no = no;
        return Object.assign(ret, { target });
    }

    setValue(value: any) {
        const { id, no, target } = value;
        this.no = no;
        setAtomValue(this._id, id);
        setAtomValue(this._target, target);
    }
}

abstract class DetailBase extends BaseObject {
    readonly entityDetail: EntityBin;
    readonly caption: string;
    constructor(sheetStore: SheetStore, entityDetail: EntityBin, caption: string) {
        super(sheetStore);
        this.entityDetail = entityDetail;
        this.caption = caption ?? entityDetail.caption;
    }

    abstract addRowValues(rowValues: any): void;
}

export class DetailMain extends DetailBase {
    readonly _sections = atom<DetailSection[]>([]);
    origin: {
        main: Main;
        rows: DetailRow[];
    }
    pending: DetailRow[];

    addRowValues(rowValues: any[]) {
        const sections = getAtomValue(this._sections);
        for (let rowValue of rowValues) {
            this.addRowValue(sections, rowValue);
        }
        setAtomValue(this._sections, [...sections]);
    }

    private addRowValue(sections: DetailSection[], rowValue: any) {
        const { item, itemX, value } = rowValue;
        if (!item || !value) return;
        let detailSection: DetailSection;
        if (itemX) {
            let index = sections.findIndex(v => v.item === item);
            if (index < 0) {
                detailSection = new DetailSection(this);
                detailSection.item = item;
                sections.push(detailSection);
            }
            else {
                detailSection = sections[index];
            }
        }
        else {
            detailSection = new DetailSection(this);
            sections.push(detailSection);
        }
        let detailRow = new DetailRow(detailSection);
        detailRow.setValue(rowValue);
        detailSection.addRow(detailRow);
        return detailRow;
    }

    addSection(detailSection: DetailSection) {
        const sections = getAtomValue(this._sections);
        setAtomValue(this._sections, [...sections, detailSection]);
    }

    async delEmptySection(section: DetailSection) {
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
export class DetailEx extends DetailBase {
    addRowValues(rowValues: any) {
        return;
    }
}

export class DetailRow extends BaseObject {
    readonly section: DetailSection;
    id: number;
    item: number;
    itemX: number;
    value: number;
    price: number;
    amount: number;
    origin: number;
    pendFrom: number;

    constructor(section: DetailSection) {
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
            base: main.id,
            phrase: this.section.detail.entityDetail.id,
            id: this.id,
            item: this.item,
            itemX: this.itemX,
            value: this.value,
            price: this.price,
            amount: this.amount,
            origin: this.origin,
            pendFrom: this.pendFrom,
        });
        this.id = id;
    }

    async addToSection() {
        await this.save();
        this.section.addRow(this);
    }

    async delFromSection() {
        const { uq } = this.sheetStore;
        await uq.DeleteDetail.submit({ id: this.id });
        this.section.delRow(this);
    }

    async changed() {
        await this.save();
        this.section.rowChanged();
    }

    setValue(row: any) {
        const { id, item, itemX, value, price, amount, origin, pendFrom } = row;
        this.id = id;
        this.item = item;
        this.itemX = itemX;
        this.value = value;
        this.price = price;
        this.amount = amount;
        this.origin = origin;
        this.pendFrom = pendFrom;
    }
}

export class DetailSection extends BaseObject {
    readonly detail: DetailMain;
    readonly _rows = atom<DetailRow[]>([]);
    item: number;           // item 作为key，来标明section

    constructor(detailMain: DetailMain) {
        super(detailMain.sheetStore);
        this.detail = detailMain;
    }

    get isEmpty() {
        let rows = getAtomValue(this._rows);
        return rows.length === 0;
    }

    addRow(row: DetailRow) {
        let rows = getAtomValue(this._rows);
        setAtomValue(this._rows, [...rows, row]);
    }

    delRow(row: DetailRow) {
        let rows = getAtomValue(this._rows);
        let index = rows.findIndex(v => v === row);
        if (index >= 0) {
            rows.splice(index, 1);
            setAtomValue(this._rows, [...rows]);
        }
        this.detail.delEmptySection(this);
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
    readonly main: Main;
    readonly detail: DetailMain;
    readonly detailExs: DetailEx[] = [];
    readonly caption: string;
    readonly idOnUrl: number;

    constructor(uq: UqExt, biz: Biz, entitySheet: EntitySheet, id: number) {
        super();
        this.uq = uq;
        this.biz = biz;
        this.entitySheet = entitySheet;
        this.main = new Main(this);
        if (id > 0) {
            this.idOnUrl = id;
            setAtomValue(this.main._id, id);
        }
        const { details } = this.entitySheet;
        let len = details.length;
        if (len > 0) {
            const { detail, caption } = details[0];
            this.detail = new DetailMain(this, detail, caption);
        }
        for (let i = 1; i < len; i++) {
            const { detail, caption } = details[i];
            this.detailExs.push(new DetailEx(this, detail, caption));
        }
        this.caption = entitySheet.caption ?? entitySheet.name;
    }

    async load() {
        let { id } = this.main;
        if (id === undefined || id === 0) return;
        let { main, details } = await this.uq.GetSheet.query({ id });
        this.main.setValue(main[0]);
        this.detail.addRowValues(details);
    }

    async discard() {
        // 作废草稿单据
        let { id } = this.main;
        if (id >= 0) {
            await this.uq.RemoveDraft.submit({ id });
            return id;
        }
    }
    async start(pick: PickFunc) {
        let ret = await this.main.start(pick);
        if (ret !== undefined) return ret;
        // await this.detail.inputSection();
        /*
        let target = getAtomValue(this.main._target);
        if (target > 0) {
            return await this.main.createNew();
        }
        else {
            this.detail.
        }
        */
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
