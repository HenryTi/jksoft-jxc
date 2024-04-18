import { EntitySheet } from "app/Biz";
import { Modal } from "tonwa-app";
import { PageSheetNew } from "./PageSheetEntry";
import { SheetConsole, SheetSteps, SheetStore } from "../store";
import { ReturnGetMyDrafts$page, UqExt } from "uqs/UqDefault";
import { atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";

export class DashConsole extends SheetConsole {
    private readonly modal: Modal;
    private uq: UqExt;
    constructor(modal: Modal, entitySheet: EntitySheet) {
        super(entitySheet);
        this.modal = modal;
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
    onSheetAdded(sheetId: number, no: string): void {
        let myDrafts = getAtomValue(this.atomMyDrafts);
        myDrafts.push({
            id: sheetId, base: this.entitySheet.id, no, operator: undefined,
        });
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
}
