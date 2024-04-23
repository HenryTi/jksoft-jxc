import { EntitySheet } from "app/Biz";
import { Modal } from "tonwa-app";
import { PageSheetNew } from "./PageSheetEntry";
import { SheetConsole, SheetSteps, SheetStore } from "../store";
import { ReturnGetMyDrafts$page, UqExt } from "uqs/UqDefault";
import { atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";

const maxDraftsCount = 10;

export class DashConsole extends SheetConsole {
    private uq: UqExt;
    readonly atomViewSubmited = atom(undefined as any);

    constructor(modal: Modal, entitySheet: EntitySheet) {
        super(modal, entitySheet);
        this.uq = entitySheet.uq;
    }
    close(): void {
        this.modal.close();
    }
    restart(): void {
        this.modal.close();
        this.modal.open(<PageSheetNew store={this.createSheetStore()} />);
    }
    discard(sheetId: number): void {
        this.removeMyDraft(sheetId);
        this.modal.close();
    }
    async onSheetAdded(store: SheetStore/*sheetId: number, no: string*/): Promise<void> {
        const { main } = store;
        const { valRow, no } = main;
        let { id, i, x, origin, price, value, amount } = valRow;
        let myDrafts = getAtomValue(this.atomMyDrafts);
        myDrafts.unshift({
            id, base: this.entitySheet.id, no, operator: undefined
            , i, x, origin
            , value, price, amount
            , rowCount: 0
        });
        const { length } = myDrafts;
        if (length > maxDraftsCount) {
            let arr: number[] = [];
            for (let i = maxDraftsCount; i < length; i++) arr.push(myDrafts[i].id);
            await Promise.all(arr.map(v => this.uq.RemoveDraft.submit({ id: v })));
            myDrafts.splice(maxDraftsCount);
        }
        setAtomValue(this.atomMyDrafts, [...myDrafts]);
    }
    sheetRowCountChanged(store: SheetStore) {
        const { main, divStore } = store;
        const { valRow } = main;
        let { id } = valRow;
        let myDrafts = getAtomValue(this.atomMyDrafts);
        let draft = myDrafts.find(v => v.id === id);
        if (draft === undefined) return;
        draft.rowCount = divStore.valDivsRoot.getRowCount();
        setAtomValue(this.atomMyDrafts, [...myDrafts]);
    }
    removeFromCache(sheetId: number): void {
        this.removeMyDraft(sheetId);
    }

    private removeMyDraft(sheetId: number) {
        let myDrafts = getAtomValue(this.atomMyDrafts);
        let index = myDrafts.findIndex(v => v.id === sheetId);
        if (index >= 0) {
            myDrafts.splice(index, 1);
            setAtomValue(this.atomMyDrafts, [...myDrafts]);
        }
    }

    readonly atomMyDrafts = atom(undefined as ReturnGetMyDrafts$page[]);
    async loadMyDrafts(/*param: any, pageStart: any, pageSize: number*/): Promise<void> {
        let { $page } = await this.uq.GetMyDrafts.page({ entitySheet: this.entitySheet.id }, undefined, 100);
        // return $page;
        setAtomValue(this.atomMyDrafts, $page);
    }

    steps: SheetSteps;

    async onSubmited(store: SheetStore): Promise<void> {
        const { main } = store;
        const { no, valRow } = main;
        const { id } = valRow;
        this.removeMyDraft(id);
        let { caption, name } = this.entitySheet;
        if (caption === undefined) caption = name;
        /*
        let viewSubmited = <div className="px-3 py-2 rounded ms-3 mt-3 border me-auto bg-warning text-primary">
            {caption} <b>{no}</b> 提交成功!
        </div>;
        */
        let viewSubmited = <>{caption} <b>{no}</b> 提交成功!</>;
        setAtomValue(this.atomViewSubmited, viewSubmited);
        /*
        setTimeout(() => {
            setAtomValue(this.atomViewSubmited, undefined);
        }, 5000);
        */
        this.modal.close();
    }
}
