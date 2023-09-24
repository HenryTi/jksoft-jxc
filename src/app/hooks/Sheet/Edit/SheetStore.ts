import { EntityAtom, EntitySheet, EntitySpec, EntityDetail, EntityMain, Biz } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { PickFunc } from "../../BizPick";
import { UseQueryOptions } from "app/tool";
import { useRef } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Atom, UqExt } from "uqs/UqDefault";
import { Atom as JotaiAtom, atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";

let ___keyId = 0;
function keyId() {
    return ++___keyId;
}

interface SpecAtom {
    entity: EntityAtom;
    value: Atom;
}
interface SpecItem {
    entity: EntitySpec;
    id: number;
    keys: (string | number)[];
    props: (string | number)[];
}

interface SpecItems {
    atom: SpecAtom;
    specs: SpecItem[];
}

abstract class BaseObject {
    readonly keyId: number;
    readonly sheetStore: SheetStore;
    constructor(sheetStore: SheetStore) {
        this.keyId = keyId();
        this.sheetStore = sheetStore;
    }
}

export class Main extends BaseObject {
    readonly entityMain: EntityMain;
    readonly _target = atom<number>(0);         // _ 开始，表示 atom

    constructor(sheetStore: SheetStore) {
        super(sheetStore);
        this.entityMain = sheetStore.entitySheet.main;
    }

    async pickTarget(pick: PickFunc) {
        const { target } = this.entityMain;
        if (target === undefined) return;
        let { spec } = await pick(target);
        setAtomValue(this._target, spec);
    }
}

abstract class DetailBase extends BaseObject {
    readonly entityDetail: EntityDetail;
    readonly caption: string;
    constructor(sheetStore: SheetStore, entityDetail: EntityDetail, caption: string) {
        super(sheetStore);
        this.entityDetail = entityDetail;
        this.caption = caption ?? entityDetail.caption;
    }

}

export class DetailMain extends DetailBase {
    readonly submitable = atom(get => {
        return get(this.sections).length > 0;
    });
    readonly sections = atom<DetailSection[]>([]);
    origin: {
        main: Main;
        rows: DetailRow[];
    }
    pending: DetailRow[];

    async addRow() {
        let section = new DetailSection(this.sheetStore);
        section.addRow('bbbb');
        let sections = getAtomValue(this.sections);
        setAtomValue(this.sections, [...sections, section]);
    }
}

// 多余的Detail，只能手工输入
export class DetailEx extends DetailBase {
    readonly submitable = atom(get => true);
}

export class DetailRow extends BaseObject {
    value: string;
}

export class DetailSection extends BaseObject {
    readonly rows = atom<DetailRow[]>([]);

    addRow(value: string) {
        let rows = getAtomValue(this.rows);
        let row = new DetailRow(this.sheetStore);;
        row.value = value;
        setAtomValue(this.rows, [...rows, row]);
    }
}

export class SheetStore {
    private readonly uq: UqExt;
    private readonly biz: Biz;
    readonly entitySheet: EntitySheet;
    readonly main: Main;
    readonly detail: DetailMain;
    readonly detailExs: DetailEx[] = [];
    readonly caption: string;
    id: number;

    constructor(uq: UqExt, biz: Biz, entitySheet: EntitySheet, id: number) {
        this.uq = uq;
        this.biz = biz;
        this.entitySheet = entitySheet;
        this.id = id;
        this.main = new Main(this);
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
        if (this.id === undefined) return;
    }

    async start() {

    }


}

export function useSheetStore() {
    const { uq, biz } = useUqApp();
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const { current: sheetStore } = useRef(new SheetStore(
        uq,
        biz,
        entitySheet,
        id === undefined ? undefined : Number(id)
    ));
    useQuery([entityId62, id], async () => sheetStore.load(), UseQueryOptions);
    return sheetStore;
}
