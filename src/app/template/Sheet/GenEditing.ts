import { Atom, atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Detail, Sheet } from "uqs/UqDefault";
import { GenSheetAct } from "./GenSheetAct";
import { PageMoreCacheData } from "app/coms";
import { EditingRow, OriginDetail, SheetRow } from "./Model";

interface DetailWithOrigin {
    detail: Detail;
    origin: OriginDetail;
}

export class GenEditing {
    readonly genSheetAct: GenSheetAct;
    readonly atomSheet: PrimitiveAtom<Sheet>;
    readonly atomIsMainSaved: PrimitiveAtom<boolean>;
    readonly atomRows: PrimitiveAtom<EditingRow[]>;
    readonly atomSubmitable: Atom<boolean>;

    constructor(genSheetAct: GenSheetAct) {
        this.genSheetAct = genSheetAct;
        this.atomSheet = atom(undefined as Sheet);
        this.atomIsMainSaved = atom(false) as any;
        this.atomRows = atom(undefined as EditingRow[]);
        this.atomSubmitable = atom(get => {
            let rows = get(this.atomRows);
            if (rows === undefined) return false;
            let submitable: boolean = false;
            for (let editingRow of rows) {
                let { error, atomDetails } = editingRow;
                if (error !== undefined) {
                    submitable = false;
                    break;
                }
                let rows = get(atomDetails);
                for (let row of rows) {
                    let { value } = row;
                    if (value === undefined) continue;
                    if (value === 0) continue;
                    submitable = true;
                    break;
                }
                if (submitable === true) break;
            }
            return submitable;
        });;
    }

    readonly onAddRow = async () => {
        await this.genSheetAct.addRow(this);
    }

    readonly onEditRow = async (editingRow: EditingRow): Promise<void> => {
        await this.genSheetAct.editRow(this, editingRow);
    }

    async load(id: number) {
        let { uq } = this.genSheetAct;
        let { main: [sheet], details, origins, assigns } = await uq.GetSheet.query({ id, assigns: undefined });
        let originColl: { [id: number]: Detail & { done: number; } } = {};
        for (let origin of origins) {
            let { id } = origin;
            originColl[id] = origin;
        }
        let editingRows: EditingRow[] = details.map(v => {
            let { origin: originId, pendFrom, pendValue, sheet, no } = v;
            let origin = originColl[originId];
            let originDetail: OriginDetail = { ...origin, pend: pendFrom, pendValue, sheet, no };
            return new EditingRow(originDetail, [v as Detail]);
        });
        setAtomValue(this.atomSheet, sheet);
        setAtomValue(this.atomRows, editingRows);
        setAtomValue(this.atomIsMainSaved, true);
    }

    setSheet(sheet: Sheet) {
        setAtomValue(this.atomSheet, sheet);
    }

    async updateRow(editingRow: EditingRow, details: Detail[]) {
        let dirtyDetails: DetailWithOrigin[] = [];
        this.dirtyDetails(dirtyDetails, editingRow, details);
        if (dirtyDetails.length > 0) {
            await this.saveDetails(dirtyDetails);
            setAtomValue(editingRow.atomDetails, details);
        }
    }

    async addRows(sheetRows: SheetRow[]) {
        let dirtyDetails: DetailWithOrigin[] = []
        for (let row of sheetRows) {
            dirtyDetails.push(...row.details.map(v => ({ detail: v, origin: row.origin })));
        }
        if (dirtyDetails.length > 0) {
            await this.saveDetails(dirtyDetails);
        }
        let rows = getAtomValue(this.atomRows);
        if (rows === undefined) rows = [];
        let newRows = sheetRows.map(v => {
            let { origin, details } = v;
            return new EditingRow(origin, details);
        });
        setAtomValue(this.atomRows, [...rows, ...newRows]);
    }

    private dirtyDetails(dirtyDetails: DetailWithOrigin[], editingRow: EditingRow, details: Detail[]) {
        let orgDetails = getAtomValue(editingRow.atomDetails);
        for (let detail of details) {
            let { origin } = editingRow;
            let { id } = detail;
            if (id !== undefined) {
                let d = orgDetails.find(v => v.id === id);
                if (d !== undefined) {
                    if (this.compareDetail(d, detail) === true) continue;
                }
            }
            dirtyDetails.push({ detail, origin });
        }
    }

    private compareDetail(d1: Detail, d2: Detail): boolean {
        if (d1.base !== d2.base) return false
        if (d1.item !== d2.item) return false;
        if (d1.target !== d2.target) return false;
        if (d1.origin !== d2.origin) return false;
        if (d1.value !== d2.value) return false;
        if (d1.v1 !== d2.v1) return false;
        if (d1.v2 !== d2.v2) return false;
        if (d1.v3 !== d2.v3) return false;
        return true;
    }

    private async saveDetail(sheet: Sheet, detailWithOrigin: DetailWithOrigin): Promise<void> {
        let { uq } = this.genSheetAct;
        let { id: sheetId, target } = sheet;
        let { detail, origin } = detailWithOrigin;
        let pendFrom = origin?.pend;
        let result = await uq.SaveDetail.submit({
            ...detail as any,
            base: sheetId,
            target,
            pendFrom,
        });
        let id = result.ret?.id;
        detail.id = id;
    }

    private async saveDetails(details: DetailWithOrigin[]) {
        await this.saveSheet();
        let sheet = getAtomValue(this.atomSheet);
        await Promise.all(details.map(v => this.saveDetail(sheet, v)));
    }
    /*
        // 第一次生成detail时，生成sheet id
        // detail.id === undefine? 则新增，否则修改
        async saveEditingRows(sheetRows: SheetRow[]): Promise<void> {
            let sheet = getAtomValue(this.atomSheet);
            let { id: sheetId, target } = sheet;
            await Promise.all(sheetRows.map(v => this.saveEditingRow(sheetId, target, v)));
        }
    
        private async saveEditingRow(sheetId: number, target: number, sheetRow: SheetRow): Promise<void> {
            let { uq } = this.genSheetAct;
            let { origin: { pend: pendFrom }, details } = sheetRow;
            for (let row of details) {
                row.base = sheetId;
                row.target = target;
            }
            let rets = await Promise.all(details.map(
                detail => uq.SaveDetail.submit({
                    ...detail as any,
                    base: sheetId,
                    target,
                    pendFrom,
                })
            ));
            let len = details.length;
            for (let i = 0; i < len; i++) {
                let ret = rets[i];
                let rowId = ret.id as number;
                if (rowId > 0) {
                    details[i].id = rowId;
                }
            }
        }
    */


    /*
        private buildNewDetails(details: EditingRow[], detail: EditingRow): any[] {
            let index = this.findDetail(details, detail);
            if (index >= 0) {
                details[index] = detail;
                return [...details];
            }
            else {
                return [...details, detail];
            }
        }
    
        private findDetail(details: EditingRow[], detail: EditingRow): number {
            let len = details.length;
            for (let i = 0; i < len; i++) {
                let d = details[i];
                let { atomDetails: atomRowsD } = d;
                let dRows = getAtomValue(atomRowsD);
                let { atomDetails: atomRows } = detail;
                let rows = getAtomValue(atomRows);
                for (let row of rows) {
                    let { id } = row;
                    let index = dRows.findIndex(v => v.id === id);
                    if (index >= 0) return i;
                }
            }
            return -1;
        }
    
        updateDetailAtom(editDetail: EditingRow): void {
            let details = getAtomValue(this.atomRows);
            if (details === undefined) details = [];
            let newDetails = this.buildNewDetails(details, editDetail);
            setAtomValue(this.atomRows, newDetails);
        }
    */
    async bookSheet(act: string) {
        let sheet = getAtomValue(this.atomSheet);
        await this.genSheetAct.uq.Biz(sheet.id, act);
        this.removeSheetFromCache();
    }

    async bookAct() {
        let sheet = getAtomValue(this.atomSheet);
        await this.genSheetAct.book(sheet.id);
        this.removeSheetFromCache();
    }

    async discard() {
        let { uq } = this.genSheetAct;
        let sheet = getAtomValue(this.atomSheet);
        await uq.RemoveDraft.submit({ id: sheet.id });
        this.removeSheetFromCache();
    }

    // 只有第一个明细保存的时候，才会保存主表。
    private async saveSheet(): Promise<Sheet> {
        const sheet = getAtomValue(this.atomSheet);
        const isMainSaved = getAtomValue(this.atomIsMainSaved);
        if (isMainSaved === true) {
            return sheet;
        }
        let { uqApp, phrase } = this.genSheetAct;
        let id = await this.genSheetAct.saveSheet(sheet);
        sheet.id = id;
        setAtomValue(this.atomSheet, { ...sheet });
        this.removeSheetFromCache();
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.addItem({
                ...sheet,
                phrase
            });
        }
        setAtomValue(this.atomIsMainSaved, true);
        return sheet;
    }

    private removeSheetFromCache() {
        let { uqApp } = this.genSheetAct;
        let sheet = getAtomValue(this.atomSheet);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            let sheetId = sheet.id;
            data.removeItem<{ id: number; }>(v => v.id === sheetId) as any;
        }
    }
}
