import { atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Detail, Sheet } from "uqs/UqDefault";
import { GenSheetAct } from "./GenSheetAct";
import { PageMoreCacheData } from "app/coms";
import { EditingDetail } from "./EditingDetail";

export class GenEditing {
    protected gen: GenSheetAct;
    readonly atomSheet: PrimitiveAtom<Sheet>;
    readonly atomSubmitable: PrimitiveAtom<boolean>;
    readonly atomIsMine: PrimitiveAtom<boolean>;
    readonly atomDetails: PrimitiveAtom<EditingDetail[]>;

    constructor(gen: GenSheetAct) {
        this.gen = gen;
        this.atomSheet = atom(undefined as Sheet);
        this.atomSubmitable = atom(false) as any;
        this.atomIsMine = atom(false) as any;
        this.atomDetails = atom(undefined as EditingDetail[]);
    }

    readonly onAddRow = async () => {
        const { genDetail } = this.gen;
        let editingDetail = await genDetail.addRow();
        // 如果第一次生成明细，则保存主表
        await this.saveSheet();
        await this.saveEditingDetail(editingDetail);
    }

    readonly onEditRow = async (detail: EditingDetail) => {
        const { genDetail } = this.gen;
        await genDetail.editRow(detail);
    }

    reset() {
        setAtomValue(this.atomSheet, undefined);
        setAtomValue(this.atomSubmitable, false);
        setAtomValue(this.atomIsMine, false);
        setAtomValue(this.atomDetails, undefined);
    }

    async load(id: number) {
        let { uq } = this.gen;
        let { main: [sheet], details, origins, assigns } = await uq.GetSheet.query({ id, assigns: undefined });
        let originColl: { [id: number]: Detail & { done: number; } } = {};
        for (let origin of origins) {
            let { id } = origin;
            originColl[id] = origin;
        }
        let editingDetails: EditingDetail[] = details.map(v => {
            let { origin: originId, pend, pendValue, sheet, no } = v;
            let origin = originColl[originId];
            return {
                origin,
                pend,
                pendValue,
                sheet,
                no,
                rows: [v as Detail]
            } as EditingDetail;
        });
        setAtomValue(this.atomSheet, sheet);
        setAtomValue(this.atomDetails, editingDetails);
        setAtomValue(this.atomIsMine, true);
        this.refreshSubmitable();
    }

    setSheet(sheet: Sheet) {
        setAtomValue(this.atomSheet, sheet);
    }

    private buildNewDetails(details: EditingDetail[], detail: EditingDetail): any[] {
        let index = this.findDetail(details, detail);
        if (index >= 0) {
            details[index] = detail;
            return [...details];
        }
        else {
            return [...details, detail];
        }
    }

    private findDetail(details: EditingDetail[], detail: EditingDetail): number {
        let len = details.length;
        for (let i = 0; i < len; i++) {
            let d = details[i];
            let { rows: dRows } = d;
            let { rows } = detail;
            for (let row of rows) {
                let { id } = row;
                let index = dRows.findIndex(v => v.id === id);
                if (index >= 0) return i;
            }
        }
        return -1;
    }

    protected updateDetailAtom(editDetail: EditingDetail): void {
        let details = getAtomValue(this.atomDetails);
        let newDetails = this.buildNewDetails(details, editDetail);
        setAtomValue(this.atomDetails, newDetails);
    }

    async newSheet(target: number): Promise<Sheet> {
        let { uq, genSheet } = this.gen;
        let { phrase } = genSheet;
        let no = await uq.IDNO({ ID: uq.Sheet });
        let sheet = { no, item: target, phrase } as any;
        setAtomValue(this.atomSheet, sheet);
        setAtomValue(this.atomDetails, []);
        return sheet;
    }

    refreshSubmitable() {
        let details = getAtomValue(this.atomDetails);
        let submitable: boolean = false;
        let exitLoop: boolean = false;
        for (let editingDetail of details) {
            if (exitLoop === true) break;
            let { rows } = editingDetail;
            for (let row of rows) {
                let { value } = row;
                if (value === undefined) continue;
                if (value === 0) continue;
                submitable = true;
                exitLoop = true;
                break;
            }
        }
        setAtomValue(this.atomSubmitable, submitable);
    }

    async bookSheet(act: string) {
        let sheet = getAtomValue(this.atomSheet);
        await this.gen.uq.Biz(sheet.id, act);
        this.removeSheetFromCache();
    }

    async bookAct() {
        let sheet = getAtomValue(this.atomSheet);
        let { genDetail, act } = this.gen;
        await this.gen.uq.BizSheetAct(sheet.id, genDetail.bizEntityName, act);
        this.removeSheetFromCache();
    }

    async discard() {
        let { uq } = this.gen;
        let sheet = getAtomValue(this.atomSheet);
        await uq.RemoveDraft.submit({ id: sheet.id });
        this.removeSheetFromCache();
    }

    async saveSheet() {
        const isMine = getAtomValue(this.atomIsMine);
        if (isMine === true) return;
        let { uqApp, uq, genSheet } = this.gen;
        let { phrase } = genSheet;
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
            data.addItem({
                ...sheet,
                phrase
            });
        }
        setAtomValue(this.atomIsMine, true);
    }

    // 第一次生成detail时，生成sheet id
    // detail.id === undefine? 则新增，否则修改
    async saveEditingDetail(editingDetail: EditingDetail): Promise<void> {
        let { uq } = this.gen;
        let sheet = getAtomValue(this.atomSheet);
        let { id: sheetId, target } = sheet;
        let { origin, pend, rows } = editingDetail;
        for (let row of rows) {
            row.base = sheetId;
            row.target = target;
        }
        let rets = await Promise.all(rows.map(
            row => uq.SaveDetail.submit({
                ...row as any,
                base: sheetId,
                target,
                pend
            })
        ));
        let len = rows.length;
        for (let i = 0; i < len; i++) {
            let ret = rets[i];
            let rowId = ret.id as number;
            if (rowId > 0) {
                rows[i].id = rowId;
            }
        }
        this.updateDetailAtom(editingDetail);
        this.refreshSubmitable();
    }

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
