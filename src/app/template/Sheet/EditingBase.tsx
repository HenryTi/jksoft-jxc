import { PageMoreCacheData } from "app/coms";
import { atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Sheet } from "uqs/UqDefault";
import { PartSheet } from "./PartSheet";

// export interface SheetBase { id?: number; base?: number; no?: string; item?: number; }
// export interface DetailBase { id?: number; base?: number; item?: number; value: number; }

export interface Editing<R = any> {
    atomSheet: PrimitiveAtom<Sheet>;
    get atomRows(): PrimitiveAtom<R>;
    atomSubmitable: PrimitiveAtom<boolean>;
    atomIsMine: PrimitiveAtom<boolean>;
    bookSheet(): Promise<void>;
    discard(): Promise<void>;
}

export abstract class EditingBase<R = any> implements Editing<R> {
    protected part: PartSheet;
    readonly atomSheet: PrimitiveAtom<Sheet>;
    readonly atomSubmitable: PrimitiveAtom<boolean>;
    readonly atomIsMine: PrimitiveAtom<boolean>;

    constructor(part: PartSheet) {
        this.part = part;
        this.atomSheet = atom(undefined as Sheet);
        this.atomSubmitable = atom(false) as any;
        this.atomIsMine = atom(false) as any;
    }

    reset(): void {
        setAtomValue(this.atomSheet, undefined);
        setAtomValue(this.atomSubmitable, false);
        setAtomValue(this.atomIsMine, false);
    }

    abstract load(sheet: number): Promise<void>;

    async newSheet(item: number) {
        let { uq, ID } = this.part;
        let no = await uq.IDNO({ ID });
        let sheet = { no, item } as Sheet;
        setAtomValue(this.atomSheet, sheet);
        return sheet;
    }

    private async saveSheet() {
        const isMine = getAtomValue(this.atomIsMine);
        if (isMine === true) return;
        let { uqApp, uq, sheetType } = this.part;
        //let seedStart = uqApp.objectOf(SeedStart);
        //let seedStartId = await seedStart.getId();
        const sheet = getAtomValue(this.atomSheet);
        let ret = await uq.SaveSheet.submit({
            ...sheet,
            sheetType,
        });
        let { id } = ret;
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
        await this.saveSheet();
        let { uq, IDDetail } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        let retId = await uq.ActID({
            ID: IDDetail,
            value: { ...detail, base: sheet.id }
        });
        if (retId > 0) {
            detail.id = retId;
            detail.base = sheet.id;
        }
        this.updateDetailAtom(detail);
        this.refreshSubmitable();
        return retId;
    }

    protected abstract updateDetailAtom(detail: any): void;

    protected abstract refreshSubmitable(): void;

    async discard() {
        let { uq } = this.part;
        let sheet = getAtomValue(this.atomSheet);
        await uq.RemoveSheet.submit({ id: sheet.id });
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
