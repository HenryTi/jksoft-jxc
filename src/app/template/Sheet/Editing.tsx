import { PageMoreCacheData } from "app/coms";
import { atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Sheet } from "uqs/UqDefault";
import { GenSheet } from "./GenSheet";

// export interface SheetBase { id?: number; base?: number; no?: string; item?: number; }
// export interface DetailBase { id?: number; base?: number; item?: number; value: number; }

export abstract class Editing {
    protected gen: GenSheet;
    readonly atomSheet: PrimitiveAtom<Sheet>;
    readonly atomSubmitable: PrimitiveAtom<boolean>;
    readonly atomIsMine: PrimitiveAtom<boolean>;

    constructor(gen: GenSheet) {
        this.gen = gen;
        this.atomSheet = atom(undefined as Sheet);
        this.atomSubmitable = atom(false) as any;
        this.atomIsMine = atom(false) as any;
    }

    abstract get atomRows(): PrimitiveAtom<any>;

    async bookSheet(act: string) {
        let sheet = getAtomValue(this.atomSheet);
        await this.gen.uq.Biz(sheet.id, act);
        this.removeSheetFromCache();
    }

    async discard() {
        let { uq } = this.gen;
        let sheet = getAtomValue(this.atomSheet);
        await uq.RemoveDraft.submit({ id: sheet.id });
        this.removeSheetFromCache();
    }

    reset(): void {
        setAtomValue(this.atomSheet, undefined);
        setAtomValue(this.atomSubmitable, false);
        setAtomValue(this.atomIsMine, false);
    }

    abstract load(sheet: number): Promise<void>;

    async newSheet(item: number) {
        let { uq, /*Atom, */phrase } = this.gen;
        let no = await uq.IDNO({ ID: uq.Sheet });
        let sheet = { no, item: item, phrase } as any;
        setAtomValue(this.atomSheet, sheet);
        return sheet;
    }

    private async saveSheet() {
        const isMine = getAtomValue(this.atomIsMine);
        if (isMine === true) return;
        let { uqApp, uq, phrase: phrase } = this.gen;
        const sheet = getAtomValue(this.atomSheet);
        let ret = await uq.SaveSheet.submit({
            ...sheet,
            sheet: phrase,
        });
        let { id } = ret;
        sheet.id = id;
        setAtomValue(this.atomSheet, sheet);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.addItem(sheet);
        }
        setAtomValue(this.atomIsMine, true);
    }

    // 第一次生成detail时，生成sheet id
    // detail.id === undefine? 则新增，否则修改
    async setDetail(detail: any): Promise<number> {
        await this.saveSheet();
        let { uq } = this.gen;
        let sheet = getAtomValue(this.atomSheet);
        let ret = await uq.SaveDetail.submit({
            ...detail,
            base: sheet.id
        });
        let retId = ret.id as number;
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

    private removeSheetFromCache() {
        let { uqApp } = this.gen;
        let sheet = getAtomValue(this.atomSheet);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            let sheetId = sheet.id;
            data.removeItem<{ id: number; }>(v => v.id === sheetId) as any;
        }
    }
}
