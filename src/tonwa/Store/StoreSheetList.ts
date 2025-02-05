import { atom } from "jotai";
import { EntitySheet } from "../Biz";
import { ReturnSheetList$page } from "../Client";
import { getAtomValue, setAtomValue } from "../tools";
import { StoreEntity } from "./Store";
import { StoreSheet } from "./StoreSheet";

export abstract class StoreSheetList extends StoreSheet {
}

const maxDraftsCount = 10;

export class StoreSheetMyDrafts extends StoreSheetList {
    discardDraft(sheetId: number): void {
        this.removeMyDraft(sheetId);
    }

    async deleteAllMyDrafts(): Promise<void> {
        //await this.uq.DeleteMyDrafts.submit({ entitySheet: this.entity.id });
        await this.client.DeleteMyDrafts(this.entity.id);
        setAtomValue(this.atomMyDrafts, []);
    }

    async onSheetAdded(store: StoreSheet): Promise<void> {
        const { mainStore } = store;
        const { valRow, no } = mainStore;
        let { id, i, x, origin, price, value, amount } = valRow;
        let myDrafts = getAtomValue(this.atomMyDrafts);
        myDrafts.unshift({
            id, base: this.entity.id, no, operator: undefined, sheet: undefined
            , i, x, origin
            , value, price, amount
            , rowCount: 0
        });
        const { length } = myDrafts;
        if (length > maxDraftsCount) {
            let arr: number[] = [];
            for (let i = maxDraftsCount; i < length; i++) arr.push(myDrafts[i].id);
            await Promise.all(arr.map(v => this.client.RemoveDraft(v)));
            myDrafts.splice(maxDraftsCount);
        }
        setAtomValue(this.atomMyDrafts, [...myDrafts]);
    }

    sheetRowCountChanged(store: StoreSheet) {
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

    readonly atomMyDrafts = atom(undefined as ReturnSheetList$page[]);
    async loadMyDrafts(): Promise<void> {
        let { $page, props, atoms, forks } = await this.client.GetMyDrafts({
            entitySheet: this.entity.id,
            entityMain: this.entity.main.id,
        }, undefined, 100);
        this.cacheIdAndBuds(props, atoms, forks);
        setAtomValue(this.atomMyDrafts, $page);
    }
}

export class StoreSheetMyList extends StoreSheetList {
    readonly loadMyList = async (param: any, pageStart: any, pageSize: number): Promise<any[]> => {
        const { $page, props, atoms, forks } = await this.client.GetMySheetList(param, pageStart, pageSize);
        this.cacheIdAndBuds(props, atoms, forks);
        return $page;
    }
}
