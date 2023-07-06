import { Atom, atom, PrimitiveAtom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Detail, EnumSheet, Sheet, UqExt } from "uqs/UqDefault";
import { PageMoreCacheData } from "app/coms";
import { AtomMetricSpec, DetailWithOrigin, EditingRow, OriginDetail, SheetRow } from "../../tool";
import { UseSheetDetailReturn } from "./useSheetDetail";
import { useUqApp } from "app/UqApp";
import { EntitySheet } from "app/Biz";
/*
export interface ReturnUseEditing {
    act: string;
    ViewRow: ({ editingRow }: { editingRow: EditingRow; }) => JSX.Element;
    onAddRow: () => Promise<void>;
    updateRow: (editingRow: EditingRow, details: Detail[]) => Promise<void>;
    atomSheet: PrimitiveAtom<Sheet>;
    atomRows: PrimitiveAtom<EditingRow[]>;
    atomSubmitable: Atom<boolean>;
    onEditRow: (editingRow: EditingRow) => Promise<void>;
    loadSheet: (sheetId: number) => Promise<{ sheet: Sheet; sheetRows: SheetRow[] }>;
    setEditing: ({ sheet, sheetRows }: { sheet: Sheet; sheetRows: SheetRow[]; }) => void;
    discard: () => Promise<void>;
    bookAct: () => Promise<void>;
    saveAtomMetricSpec: (atomMetricSpec: AtomMetricSpec) => Promise<number>;
}

export function useSheetEditing(sheet: EnumSheet, act: string, useSheetDetailReturn: UseSheetDetailReturn): ReturnUseEditing {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp
    const entitySheet = biz.entities[sheet] as EntitySheet;

    const atomSheet = atom(undefined as Sheet);
    const atomRows = atom(undefined as EditingRow[]);
    const atomSubmitable = atom(get => {
        let rows = get(atomRows);
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

    function setEditing({ sheet, sheetRows }: { sheet: Sheet; sheetRows: SheetRow[]; }) {
        addRows(sheetRows);
        setAtomValue(atomSheet, sheet);
    }

    async function onAddRow() {
        // let sheetRows = await this.genDetail.addRow(this);
        let sheetRows = await detailAddRow();
        if (sheetRows === undefined) return;
        await saveRows(sheetRows);
        addRows(sheetRows);
    }

    async function detailAddRow(): Promise<SheetRow[]> {
        const { addRow } = useSheetDetailReturn;
        let editingRows = getAtomValue(atomRows);
        let r = await addRow(editingRows);
        return r;
    }

    async function detailEditRow(editingRow: EditingRow) {
        debugger;
    }

    async function onEditRow(editingRow: EditingRow): Promise<void> {
        // let { editRow } = this.genDetail;
        // if (editRow === undefined) return;
        // await editRow(this, editingRow as any);
        await detailEditRow(editingRow);
    }

    async function load(id: number) {
        let { main: [sheet], details, origins, buds } = await uq.GetSheet.query({ id, budNames: undefined });
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
        setAtomValue(atomSheet, sheet);
        setAtomValue(atomRows, editingRows);
    }

    async function loadSheet(sheetId: number): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let { main: [sheet], details, origins, buds } = await uq.GetSheet.query({ id: sheetId, budNames: undefined });
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

    function setSheet(sheet: Sheet) {
        setAtomValue(atomSheet, sheet);
    }

    async function updateRow(editingRow: EditingRow, details: Detail[]) {
        let dirtyDetails: DetailWithOrigin[] = [];
        getDirtyDetails(dirtyDetails, editingRow, details);
        if (dirtyDetails.length > 0) {
            await saveDetails(dirtyDetails);
            setAtomValue(editingRow.atomDetails, details);
        }
    }

    async function saveRows(sheetRows: SheetRow[]) {
        let dirtyDetails: DetailWithOrigin[] = []
        for (let row of sheetRows) {
            dirtyDetails.push(...row.details.map(v => ({ detail: v, origin: row.origin })));
        }
        if (dirtyDetails.length > 0) {
            await saveDetails(dirtyDetails);
        }
    }

    function addRows(sheetRows: SheetRow[]) {
        let rows = getAtomValue(atomRows);
        if (rows === undefined) rows = [];
        let newRows = sheetRows.map(v => {
            let { origin, details } = v;
            return new EditingRow(origin, details);
        });
        setAtomValue(atomRows, [...rows, ...newRows]);
    }

    function getDirtyDetails(dirtyDetails: DetailWithOrigin[], editingRow: EditingRow, details: Detail[]) {
        let orgDetails = getAtomValue(editingRow.atomDetails);
        for (let detail of details) {
            let { origin } = editingRow;
            let { id } = detail;
            if (id !== undefined) {
                let d = orgDetails.find(v => v.id === id);
                if (d !== undefined) {
                    if (compareDetail(d, detail) === true) continue;
                }
            }
            dirtyDetails.push({ detail, origin });
        }
    }

    function compareDetail(d1: Detail, d2: Detail): boolean {
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

    async function saveDetail(sheet: Sheet, detailWithOrigin: DetailWithOrigin): Promise<void> {
        let { id: sheetId, target } = sheet;
        let { detail, origin } = detailWithOrigin;
        let pendFrom = origin?.pend;
        let result = await uq.SaveDetail.submit({
            ...detail as any,
            base: sheetId,
            target,
            pendFrom,
        });
        let id = result.id;
        detail.id = id;
    }

    async function saveAtomMetricSpec(atomMetricSpec: AtomMetricSpec): Promise<number> {
        let { atom, atomMetric, spec, metricItem } = atomMetricSpec;
        if (atomMetric === undefined) {
            let ret = await uq.SaveAtomMetric.submit({ atom: atom.id, metricItem: metricItem.id });
            atomMetric = atomMetricSpec.atomMetric = ret.id;
        }
        let specId = 0;
        if (spec !== undefined) {
            specId = spec.id;
            if (specId === undefined) {
                specId = await saveSpec(atom.id, atom.phrase, spec);
            }
        }
        let ret = await uq.SaveAtomMetricSpec.submit({
            atomMetric,
            spec: specId,
        });
        return ret.id;
    }

    async function saveSpec(atomId: number, atomPhrase: string, spec: any): Promise<number> {
        // let { genAtomSpec } = useSheetDetailReturn;
        let gSpec = uqApp.specFromAtom(atomPhrase);
        let values = gSpec.entity.getSpecValues(spec);
        let ret = await uq.SaveSpec.submit({
            spec: gSpec.name,
            atom: atomId,
            values
        });
        return ret.id;
    }

    async function saveDetails(details: DetailWithOrigin[]) {
        await saveSheet();
        let sheet = getAtomValue(atomSheet);
        await Promise.all(details.map(v => saveDetail(sheet, v)));
    }

    async function bookSheet(act: string) {
        let sheet = getAtomValue(atomSheet);
        await uq.Biz(sheet.id, act);
        removeSheetFromCache();
    }

    async function confirmSaveRow(editingRow: EditingRow) {
        let dirtyDetails: DetailWithOrigin[] = [];
        let { origin, atomDetails } = editingRow;
        let details = getAtomValue(atomDetails);
        for (let detail of details) {
            if (detail.id === undefined) {
                dirtyDetails.push({ origin, detail });
            }
        }
        if (dirtyDetails.length === 0) return;
        await saveDetails(dirtyDetails);
    }

    async function confirmSaveAllDetails() {
        let editingRows = getAtomValue(atomRows);
        let len = editingRows.length;
        for (let i = 0; i < len; i += 100) {
            await Promise.all(editingRows.slice(i, 100).map(v => confirmSaveRow(v)));
        }
    }

    async function discard() {
        let sheet = getAtomValue(atomSheet);
        await uq.RemoveDraft.submit({ id: sheet.id });
        removeSheetFromCache();
    }

    // 只有第一个明细保存的时候，才会保存主表。
    async function saveSheet(): Promise<Sheet> {
        const sheet = getAtomValue(atomSheet);
        if (sheet.id !== undefined) return sheet;
        const { phrase } = entitySheet;
        let id = await saveSheetToDb(sheet);
        sheet.id = id;
        setAtomValue(atomSheet, { ...sheet });
        removeSheetFromCache();
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.addItem({
                ...sheet,
                phrase
            });
        }
        return sheet;
    }


    // return: id
    async function saveSheetToDb(sheet: Sheet): Promise<number> {
        let { phrase } = entitySheet;
        let ret = await uq.SaveSheet.submit({
            ...sheet,
            sheet: phrase,
        });
        let { id } = ret;
        return id;
    }

    async function bookAct() {
        let sheet = await saveSheet(); // getAtomValue(this.atomSheet);
        await confirmSaveAllDetails();
        // await this.genSheetAct.book(sheet.id, this.detail);
        await uq.BizSheetAct(sheet.id
            , useSheetDetailReturn.detail
            , act);
        removeSheetFromCache();
    }

    function removeSheetFromCache() {
        let sheet = getAtomValue(atomSheet);
        let data = uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            let sheetId = sheet.id;
            data.removeItem<{ id: number; }>(v => v.id === sheetId) as any;
        }
    }

    function ViewRow({ editingRow }: { editingRow: EditingRow; }) {
        return useSheetDetailReturn.ViewRow({ editingRow, updateRow });
    }

    let ret = {
        act,
        onAddRow,
        updateRow,
        ViewRow,
        atomSheet,
        atomRows,
        atomSubmitable,
        onEditRow,
        loadSheet,
        setEditing,
        discard,
        bookAct,
        saveAtomMetricSpec,
    };
    return ret;
}
*/