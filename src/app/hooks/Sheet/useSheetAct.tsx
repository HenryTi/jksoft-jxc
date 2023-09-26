import { Band, PageMoreCacheData } from "app/coms";
import { atom, useAtomValue } from "jotai";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { ButtonAsync, getAtomValue, List, LMR, Sep, setAtomValue, useEffectOnce } from "tonwa-com";
import { Atom, Detail, Sheet } from "uqs/UqDefault";
import { DetailWithOrigin, EditingRow, OriginDetail, SheetRow } from "app/tool";
import { UseSheetDetailReturn } from "./useSheetDetail";
import { useUqApp } from "app/UqApp";
import { EntitySheet, getPickableCaption } from "app/Biz";

export interface PropsSheetAct {
    entitySheet: EntitySheet;
    act: string;
    // caption?: string;
    // targetCaption: string;
    // ViewTargetBand: (props: { sheet: Sheet; }) => JSX.Element;
    ViewTarget: (props: { sheet: Sheet; }) => JSX.Element;
    selectTarget: (header?: string) => Promise<Atom>;
    loadStart: () => Promise<{ sheet: Sheet; sheetRows: SheetRow[] }>;
    useDetailReturn: UseSheetDetailReturn;
    sep?: any;
}

export function useSheetAct(options: PropsSheetAct) {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp
    const { entitySheet,
        // ViewTargetBand, 
        ViewTarget,
        loadStart, act, sep, useDetailReturn } = options;
    const { editRow } = useDetailReturn;
    const navigate = useNavigate();
    // const { current: genEditing } = useRef(useSheetEditing(sheetName, act, useDetailReturn));
    // const { onEditRow, onAddRow, atomRows, atomSheet, atomSubmitable } = genEditing;
    const { current: { atomSheet, atomRows, atomSubmitable } } = useRef((function () {
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
        return { atomSheet, atomRows, atomSubmitable }
    })());
    // const entitySheet = biz.entities[sheetName] as EntitySheet;
    const sheet = useAtomValue(atomSheet);
    const rows = useAtomValue(atomRows);
    const submitable = useAtomValue(atomSubmitable);
    const [visible, setVisible] = useState(true);
    const { openModal, closeModal } = useModal();
    const { id: paramId } = useParams();

    const { caption: sheetCaption, name, main } = entitySheet;
    const caption = sheetCaption ?? name;

    useEffectOnce(() => {
        (async function () {
            let sheetId = Number(paramId);
            if (Number.isNaN(sheetId) === true) {
                sheetId = undefined;
            }
            if (await startSheet(sheetId) === false) {
                // 如无开单，直接退回
                navigate(-1);
            };
        })();
    });

    if (sheet === undefined || rows === undefined) {
        return {
            page: <Page header={caption}>
                <PageSpinner />
            </Page>
        };
    }

    async function startSheet(sheetId: number): Promise<boolean> {
        if (sheetId !== undefined) {
            let ret = await loadSheet(sheetId);
            setEditing(ret);
            return true;
        }

        let ret = await loadStart();
        if (ret === undefined) {
            return false;
        }

        setEditing(ret);
        return true;
    }

    function None() {
        return <div className="small text-muted px-3 py-3">[ 无明细 ]</div>;
    }

    let btnSubmit: any, cnAdd: string;
    if (rows.length === 0) {
        cnAdd = 'btn btn-primary me-3';
    }
    else {
        btnSubmit = <ButtonAsync className="btn btn-primary" onClick={onSubmit} disabled={!submitable}>提交</ButtonAsync>;
        cnAdd = 'btn btn-outline-primary me-3';
    }
    async function onRemoveSheet() {
        let message = `${caption} ${sheet.no} 真的要作废吗？`;
        let ret = await openModal(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await discard();
            navigate(-1);
        }
    }
    const vButtons = <LMR className="my-3 px-3 py-2">
        {btnSubmit}
        {visible === true && <>
            <button className={cnAdd} onClick={onAddRow}>增加明细</button>
            {sheet.id !== undefined && <button className={'btn btn-outline-primary'} onClick={onRemoveSheet}>作废</button>}
        </>}
    </LMR>;

    async function onSubmit() {
        setVisible(false);
        // await genEditing.bookAct();
        await bookAct();
        setVisible(true);
        function addDetailOnOk() {
            closeModal();
            onAddRow();
        }
        await openModal(<Page header="提交成功" back="none">
            <div className="p-3">
                {caption} <b>{sheet.no}</b> 已提交
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={closeModal}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={addDetailOnOk}>新建{caption}</button>
            </div>
        </Page>);
        navigate(-1);
    }
    function ViewItemOfList({ value }: { value: any }) {
        // const { ViewRow } = genEditing;
        return <ViewRow editingRow={value} />;
    }

    let viewTargetBand: JSX.Element;
    const { target } = main;
    if (target !== undefined) {
        viewTargetBand = <Band label={getPickableCaption(target)}>
            <ViewTarget sheet={sheet} />
        </Band>;
    }
    /*
    if (ViewTargetBand !== undefined) {
        viewTargetBand = <ViewTargetBand sheet={sheet} />;
    }
    */
    function setEditing({ sheet, sheetRows }: { sheet: Sheet; sheetRows: SheetRow[]; }) {
        addRows(sheetRows);
        setAtomValue(atomSheet, sheet);
    }

    async function onAddRow() {
        let sheetRows = await detailAddRow();
        if (sheetRows === undefined) return;
        await saveRows(sheetRows);
        addRows(sheetRows);
    }

    async function detailAddRow(): Promise<SheetRow[]> {
        const { addRow } = useDetailReturn;
        let editingRows = getAtomValue(atomRows);
        let r = await addRow(editingRows);
        return r;
    }

    async function onEditRow(editingRow: EditingRow): Promise<void> {
        // let { editRow } = this.genDetail;
        // if (editRow === undefined) return;
        // await editRow(this, editingRow as any);
        // await detailEditRow(editingRow);
        if (editRow === undefined) {
            debugger;
            // alert('onEditRow editRow in useDetailReturn not defined');
            return;
        }
        await editRow(editingRow, updateRow);
    }
    /*
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
    */
    async function loadSheet(sheetId: number): Promise<{ sheet: Sheet; sheetRows: SheetRow[] }> {
        let { main: [sheet], details, origins } = await uq.GetSheet.query({ id: sheetId });
        let originColl: { [id: number]: Detail/* & { done: number; }*/ } = {};
        for (let origin of origins) {
            let { id } = origin;
            originColl[id] = origin;
        }
        let sheetRows: SheetRow[] = details.map(v => {
            let { origin: originId, pendFrom, pendValue } = v;
            let origin = originColl[originId];
            // let originDetail: OriginDetail = { ...origin, pend: pendFrom, pendValue, sheet, no };
            let originDetail: OriginDetail = { ...origin, pend: pendFrom, pendValue } as any;
            let detail: Detail = { ...v };
            return { origin: originDetail, details: [detail] };
        });
        return { sheet, sheetRows };
    }
    /*
    function setSheet(sheet: Sheet) {
        setAtomValue(atomSheet, sheet);
    }
    */
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
        if (d1.itemX !== d2.itemX) return false;
        if (d1.origin !== d2.origin) return false;
        if (d1.value !== d2.value) return false;
        if (d1.price !== d2.price) return false;
        if (d1.amount !== d2.amount) return false;
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
        let { entityId } = entitySheet;
        let ret = await uq.SaveSheet.submit({
            ...sheet,
            phrase: entityId,
        });
        let { id } = ret;
        return id;
    }

    async function bookAct() {
        let sheet = await saveSheet(); // getAtomValue(this.atomSheet);
        await confirmSaveAllDetails();
        // await this.genSheetAct.book(sheet.id, this.detail);
        await uq.BizSheetAct(sheet.id
            , useDetailReturn.detail as any
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
        return useDetailReturn.ViewRow({ editingRow, updateRow });
    }

    const top = <div className="pt-3 tonwa-bg-gray-3 container">
        <Band label={'单据编号'}>
            {sheet.no}
        </Band>
        {viewTargetBand}
    </div>;

    const body = <>
        {rows.length > 6 ? <>{vButtons}<Sep /></> : <Sep />}
        <List items={rows} ViewItem={ViewItemOfList}
            none={< None />}
            onItemClick={editRow === undefined ? undefined : onEditRow}
            sep={sep} />
        <Sep />
        {vButtons}
    </>;
    const bottom = <></>;
    return {
        caption,
        viewTargetBand,
        rows,
        vButtons,
        ViewItemOfList,
        viewNone: <None />,
        onEditRow,
        top,
        body,
        bottom,
    };
}

export function PageSheetAct(props: PropsSheetAct) {
    let { caption, top, body, bottom } = useSheetAct(props);
    return <Page header={caption}>
        {top}
        {body}
        {bottom}
    </Page>;
}
