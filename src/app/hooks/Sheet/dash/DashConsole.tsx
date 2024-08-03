import { PageSheetNew } from "./PageSheetEntry";
import { SheetConsole, SheetSteps, SheetStore } from "../store";
import { ReturnGetMyDrafts$page } from "uqs/UqDefault";
import { atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";

const maxDraftsCount = 10;

export class DashConsole extends SheetConsole {
    readonly atomViewSubmited = atom(undefined as any);

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
        const { mainStore } = store;
        const { valRow, no } = mainStore;
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
        const { mainStore: main, divStore } = store;
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
    async loadMyDrafts(): Promise<void> {
        let { $page } = await this.uq.GetMyDrafts.page({ entitySheet: this.entitySheet.id }, undefined, 100);
        setAtomValue(this.atomMyDrafts, $page);
    }

    steps: SheetSteps;

    async onSubmited(store: SheetStore): Promise<void> {
        const { mainStore: main } = store;
        const { no, valRow } = main;
        const { id } = valRow;
        this.removeMyDraft(id);
        let { caption } = this.entitySheet;
        let viewSubmited = <>{caption} <b>{no}</b> 提交成功!</>;
        setAtomValue(this.atomViewSubmited, viewSubmited);
        this.modal.close();
    }
}
