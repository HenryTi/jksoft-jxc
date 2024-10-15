import { PageSheetNew } from "../dash/PageSheetEntry";
import { SheetConsole, SheetSteps, SheetStore } from ".";
import { ReturnGetMyDrafts$page } from "uqs/UqDefault";
import { atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Modal } from "tonwa-app";
import { EntitySheet } from "app/Biz";

const maxDraftsCount = 10;

export class DashConsole extends SheetConsole {
    readonly atomViewSubmited = atom(undefined as any);
    readonly myDraftsStore: SheetMyDraftsStore;
    readonly myArchiveList: SheetMyListStore;

    constructor(modal: Modal, entitySheet: EntitySheet) {
        super(modal, entitySheet);
        this.myDraftsStore = new SheetMyDraftsStore(entitySheet, this);
        this.myArchiveList = new SheetMyListStore(entitySheet, this);
    }

    discard(sheetId: number): void {
        this.myDraftsStore.discardDraft(sheetId);
    }
    async onSheetAdded(store: SheetStore): Promise<void> {
        await this.myDraftsStore.onSheetAdded(store);
    }
    sheetRowCountChanged(store: SheetStore): void {
        this.myDraftsStore.sheetRowCountChanged(store);
    }
    removeFromCache(sheetId: number): void {
        this.myDraftsStore.removeFromCache(sheetId);
    }

    close(): void {
        this.modal.close();
    }
    restart(): void {
        this.modal.close();
        this.modal.open(<PageSheetNew store={this.createSheetStore()} />);
    }

    steps: SheetSteps;

    async onSubmited(store: SheetStore): Promise<void> {
        const { mainStore: main } = store;
        const { no, valRow } = main;
        const { id } = valRow;
        this.myDraftsStore.removeMyDraft(id);
        let { caption } = this.entitySheet;
        let viewSubmited = <>{caption} <b>{no}</b> 提交成功!</>;
        setAtomValue(this.atomViewSubmited, viewSubmited);
        this.modal.close();
    }
}

export abstract class SheetListStore extends SheetStore {
}

export class SheetMyDraftsStore extends SheetListStore {
    discardDraft(sheetId: number): void {
        this.removeMyDraft(sheetId);
        this.modal.close();
    }

    async deleteAllMyDrafts(): Promise<void> {
        await this.uq.DeleteMyDrafts.submit({ entitySheet: this.entity.id });
        setAtomValue(this.atomMyDrafts, []);
    }

    async onSheetAdded(store: SheetStore/*sheetId: number, no: string*/): Promise<void> {
        const { mainStore } = store;
        const { valRow, no } = mainStore;
        let { id, i, x, origin, price, value, amount } = valRow;
        let myDrafts = getAtomValue(this.atomMyDrafts);
        myDrafts.unshift({
            id, base: this.entity.id, no, operator: undefined
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
        const { mainStore: main, binStore } = store;
        const { valRow } = main;
        let { id } = valRow;
        let myDrafts = getAtomValue(this.atomMyDrafts);
        let draft = myDrafts.find(v => v.id === id);
        if (draft === undefined) return;
        draft.rowCount = binStore.valDivsRoot.getRowCount();
        setAtomValue(this.atomMyDrafts, [...myDrafts]);
    }

    removeFromCache(sheetId: number): void {
        this.removeMyDraft(sheetId);
    }

    removeMyDraft(sheetId: number) {
        let myDrafts = getAtomValue(this.atomMyDrafts);
        let index = myDrafts.findIndex(v => v.id === sheetId);
        if (index >= 0) {
            myDrafts.splice(index, 1);
            setAtomValue(this.atomMyDrafts, [...myDrafts]);
        }
    }

    readonly atomMyDrafts = atom(undefined as ReturnGetMyDrafts$page[]);
    async loadMyDrafts(): Promise<void> {
        let { $page, props, atoms, specs } = await this.uq.GetMyDrafts.page({
            entitySheet: this.entity.id,
            entityMain: this.entity.main.id,
        }, undefined, 100);
        this.cacheIdAndBuds(props, atoms, specs as any);
        setAtomValue(this.atomMyDrafts, $page);
    }
}

export class SheetMyListStore extends SheetListStore {
    readonly loadMyList = async (param: any, pageStart: any, pageSize: number): Promise<any[]> => {
        const { $page, props, atoms, specs } = await this.uq.GetMySheetList.page(param, pageStart, pageSize);
        this.cacheIdAndBuds(props, atoms, specs);
        return $page;
    }
}