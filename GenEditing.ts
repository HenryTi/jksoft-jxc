import { Atom, atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Detail, EnumSheet, Sheet, UqExt } from "uqs/UqDefault";
import { PageMoreCacheData } from "app/coms";
import { AtomMetricSpec, DetailWithOrigin, EditingRow, OriginDetail, SheetRow } from "../../tool";
import { UseSheetDetailReturn } from "./useSheetDetail";
import { UqApp } from "app/UqApp";
import { EntitySheet } from "app/Biz";

export class GenEditing {
    private readonly entitySheet: EntitySheet;
    private readonly useSheetDetailReturn: UseSheetDetailReturn
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    readonly atomSheet: PrimitiveAtom<Sheet>;
    readonly atomRows: PrimitiveAtom<EditingRow[]>;
    readonly atomSubmitable: Atom<boolean>;
    readonly ViewRow: (props: { editingRow: EditingRow; }) => JSX.Element;
    readonly detail: string;
    readonly act: string;

    constructor(uqApp: UqApp, sheet: EnumSheet, act: string, useSheetDetailReturn: UseSheetDetailReturn) {
        this.act = act;
        const { uq, biz } = uqApp;
        this.uqApp = uqApp;
        this.uq = uq;
        this.entitySheet = biz.entities[sheet] as EntitySheet;
        this.useSheetDetailReturn = useSheetDetailReturn;
        this.ViewRow = ({ editingRow }: { editingRow: EditingRow; }) => {
            return useSheetDetailReturn.ViewRow({ editingRow, genEditing: this });
        }
        this.detail = useSheetDetailReturn.detail;
        // this.genDetail = genSheetAct.genDetail;
        this.atomSheet = atom(undefined as Sheet);
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

    setEditing({ sheet, sheetRows }: { sheet: Sheet; sheetRows: SheetRow[]; }) {
        this.addRows(sheetRows);
        setAtomValue(this.atomSheet, sheet);
    }

    protected async detailAddRow(): Promise<SheetRow[]> {
        const { addRow } = this.useSheetDetailReturn;
        let ret = await addRow(this);
        return ret;
    }

    readonly onAddRow = async () => {
        // let sheetRows = await this.genDetail.addRow(this);
        let sheetRows = await this.detailAddRow();
        if (sheetRows === undefined) return;
        await this.saveRows(sheetRows);
        this.addRows(sheetRows);
    }

    protected async detailEditRow(editingRow: EditingRow) {
        debugger;
    }

    readonly onEditRow = async (editingRow: EditingRow): Promise<void> => {
        // let { editRow } = this.genDetail;
        // if (editRow === undefined) return;
        // await editRow(this, editingRow as any);
        await this.detailEditRow(editingRow);
    }

    async load(id: number) {
        let { main: [sheet], details, origins, buds } = await this.uq.GetSheet.query({ id, buds: undefined });
        let originColl: { [id: number]: Detail & { done: number; } } = {};
        for (let origin of origins) {
            let { id } = origin;
            originColl[id] = origin;
        }
        let editingRows: EditingRow[] = details.map(v => {
            let { origin: originId, pendFrom, pendValue, sheet, no } = v;
            let origin = originColl[originId];
            let originDetail: OriginDetail = { ...origin, pend: pendFrom, pendValue, sheet, no, };
            return new EditingRow(originDetail, [v as Detail]);
        });
        setAtomValue(this.atomSheet, sheet);
        setAtomValue(this.atomRows, editingRows);
    }

    async loadSheet(sheetId: number): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let { main: [sheet], details, origins, buds } = await this.uq.GetSheet.query({ id: sheetId, buds: undefined });
        let originColl: { [id: number]: Detail & { done: number; } } = {};
        for (let origin of origins) {
            let { id } = origin;
            originColl[id] = origin;
        }
        let sheetRows: SheetRow[] = details.map(v => {
            let { origin: originId, pendFrom, pendValue, sheet, no } = v;
            let origin = originColl[originId];
            let originDetail: OriginDetail = { ...origin, pend: pendFrom, pendValue, sheet, no };
            let detail: Detail = { ...v };
            return { origin: originDetail, details: [detail] };
        });
        return { sheet, sheetRows };
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

    async saveRows(sheetRows: SheetRow[]) {
        let dirtyDetails: DetailWithOrigin[] = []
        for (let row of sheetRows) {
            dirtyDetails.push(...row.details.map(v => ({ detail: v, origin: row.origin })));
        }
        if (dirtyDetails.length > 0) {
            await this.saveDetails(dirtyDetails);
        }
    }

    addRows(sheetRows: SheetRow[]) {
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
        let { id: sheetId, target } = sheet;
        let { detail, origin } = detailWithOrigin;
        let pendFrom = origin?.pend;
        let result = await this.uq.SaveDetail.submit({
            ...detail as any,
            base: sheetId,
            target,
            pendFrom,
        });
        let id = result.id;
        detail.id = id;
    }

    async saveAtomMetricSpec(atomMetricSpec: AtomMetricSpec): Promise<number> {
        let { atom, atomMetric, spec, metricItem } = atomMetricSpec;
        if (atomMetric === undefined) {
            let ret = await this.uq.SaveAtomMetric.submit({ atom: atom.id, metricItem: metricItem.id });
            atomMetric = atomMetricSpec.atomMetric = ret.id;
        }
        let specId = 0;
        if (spec !== undefined) {
            specId = spec.id;
            if (specId === undefined) {
                specId = await this.saveSpec(atom.id, atom.phrase, spec);
            }
        }
        let ret = await this.uq.SaveAtomMetricSpec.submit({
            atomMetric,
            spec: specId,
        });
        return ret.id;
    }

    private async saveSpec(atomId: number, atomPhrase: string, spec: any): Promise<number> {
        let { uq } = this;
        let { genAtomSpec } = this.useSheetDetailReturn;
        let genSpec = genAtomSpec.genSpecFromAtom(atomPhrase);
        let values = genSpec.entity.getValues(spec);
        let ret = await uq.SaveSpec.submit({
            spec: genSpec.bizEntityName,
            atom: atomId,
            values
        });
        return ret.id;
    }

    private async saveDetails(details: DetailWithOrigin[]) {
        await this.saveSheet();
        let sheet = getAtomValue(this.atomSheet);
        await Promise.all(details.map(v => this.saveDetail(sheet, v)));
    }

    async bookSheet(act: string) {
        let sheet = getAtomValue(this.atomSheet);
        await this.uq.Biz(sheet.id, act);
        this.removeSheetFromCache();
    }
    /*
        async bookAct() {
            let sheet = await this.saveSheet(); // getAtomValue(this.atomSheet);
            await this.confirmSaveAllDetails();
            // await this.genSheetAct.book(sheet.id, this.detail);
            await this.uq.BizSheetAct(sheet.id
                , this.detail
                // , this.genDetail.bizEntityName
                , this.act);
            this.removeSheetFromCache();
        }
    */
    private async confirmSaveRow(editingRow: EditingRow) {
        let dirtyDetails: DetailWithOrigin[] = [];
        let { origin, atomDetails } = editingRow;
        let details = getAtomValue(atomDetails);
        for (let detail of details) {
            if (detail.id === undefined) {
                dirtyDetails.push({ origin, detail });
            }
        }
        if (dirtyDetails.length === 0) return;
        await this.saveDetails(dirtyDetails);
    }

    async confirmSaveAllDetails() {
        let editingRows = getAtomValue(this.atomRows);
        let len = editingRows.length;
        for (let i = 0; i < len; i += 100) {
            await Promise.all(editingRows.slice(i, 100).map(v => this.confirmSaveRow(v)));
        }
    }

    async discard() {
        let { uq } = this;
        let sheet = getAtomValue(this.atomSheet);
        await uq.RemoveDraft.submit({ id: sheet.id });
        this.removeSheetFromCache();
    }

    // 只有第一个明细保存的时候，才会保存主表。
    private async saveSheet(): Promise<Sheet> {
        const sheet = getAtomValue(this.atomSheet);
        if (sheet.id !== undefined) return sheet;
        const { phrase } = this.entitySheet;
        let id = await this.saveSheetToDb(sheet);
        sheet.id = id;
        setAtomValue(this.atomSheet, { ...sheet });
        this.removeSheetFromCache();
        let data = this.uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.addItem({
                ...sheet,
                phrase
            });
        }
        return sheet;
    }


    // return: id
    async saveSheetToDb(sheet: Sheet): Promise<number> {
        let { phrase } = this.entitySheet;
        let ret = await this.uq.SaveSheet.submit({
            ...sheet,
            sheet: phrase,
        });
        let { id } = ret;
        return id;
    }

    async bookAct() {
        let sheet = await this.saveSheet(); // getAtomValue(this.atomSheet);
        await this.confirmSaveAllDetails();
        // await this.genSheetAct.book(sheet.id, this.detail);
        await this.uq.BizSheetAct(sheet.id
            , this.detail
            // , this.genDetail.bizEntityName
            , this.act);
        this.removeSheetFromCache();
    }

    removeSheetFromCache() {
        let { uqApp } = this;
        let sheet = getAtomValue(this.atomSheet);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            let sheetId = sheet.id;
            data.removeItem<{ id: number; }>(v => v.id === sheetId) as any;
        }
    }
}
