import { PageMoreCacheData } from "app/coms";
import { atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { PartSheet } from "./PartSheet";

export interface SheetBase { id?: number; no?: string; }
export interface DetailBase { id?: number; }
export interface DetailQuantityBase { id?: number; quantity: number; }
export interface DetailValueBase { id?: number; value: number; }

export interface Editing<S extends SheetBase, R = any> {
    atomSheet: PrimitiveAtom<S>;
    get atomRows(): PrimitiveAtom<R>;
    atomSubmitable: PrimitiveAtom<boolean>;
    atomIsMine: PrimitiveAtom<boolean>;
    bookSheet(): Promise<void>;
    discard(): Promise<void>;
}

export abstract class EditingBase<S extends SheetBase, R = any> implements Editing<S, R> {
    protected part: PartSheet<S, any>;
    readonly atomSheet: PrimitiveAtom<S>;
    readonly atomSubmitable: PrimitiveAtom<boolean>;
    readonly atomIsMine: PrimitiveAtom<boolean>;

    constructor(part: PartSheet<S, any>) {
        this.part = part;
        this.atomSheet = atom(undefined as S);
        this.atomSubmitable = atom(false) as any;
        this.atomIsMine = atom(false) as any;
    }

    reset(): void {
        setAtomValue(this.atomSheet, undefined);
        setAtomValue(this.atomSubmitable, false);
        setAtomValue(this.atomIsMine, false);
    }

    abstract load(sheet: number): Promise<void>;

    async newSheet(target: number) {
        let { uq, ID } = this.part;
        let no = await uq.IDNO({ ID });
        let sheet = this.part.buildSheet(undefined, no, target);
        setAtomValue(this.atomSheet, sheet);
        return sheet;
    }

    private async setSheetAsMine() {
        const isMine = getAtomValue(this.atomIsMine);
        if (isMine === true) return;
        let { uqApp, uq, ID, IxMySheet } = this.part;
        const sheet = getAtomValue(this.atomSheet);
        let [id] = await uq.ActIX({
            IX: IxMySheet,
            ID: ID,
            values: [{
                ix: undefined,
                xi: sheet,
            }]
        });
        sheet.id = id;
        setAtomValue(this.atomSheet, sheet);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.addItem({ ix: undefined, xi: id });
        }
        setAtomValue(this.atomIsMine, true);
    }

    abstract get atomRows(): PrimitiveAtom<R>;

    // 第一次生成detail时，生成sheet id
    // detail.id === undefine? 则新增，否则修改
    async setDetail(detail: any): Promise<number> {
        await this.setSheetAsMine();
        let { uq, IDDetail } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        let retId = await uq.ActID({
            ID: IDDetail,
            value: { ...detail, sheet: sheet.id }
        });
        if (retId > 0) {
            detail.id = retId;
            detail.sheet = sheet.id;
        }
        this.updateDetailAtom(detail);
        this.refreshSubmitable();
        return retId;
    }

    protected abstract updateDetailAtom(detail: any): void;

    protected abstract refreshSubmitable(): void;

    async discard() {
        let { uq, IxMySheet } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        await uq.ActIX({ IX: IxMySheet, values: [{ ix: undefined, xi: -sheet.id }] });
        this.removeSheetFromCache();
    }

    private removeSheetFromCache() {
        let { uqApp } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            let sheetId = sheet.id;
            data.removeItem<{ ix: number, xi: number }>(v => v.xi === sheetId) as any;
        }
    }

    async bookSheet() {
        let { ActBookSheet } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        await ActBookSheet.submit({ id: sheet.id });
        this.removeSheetFromCache();
    }
}
