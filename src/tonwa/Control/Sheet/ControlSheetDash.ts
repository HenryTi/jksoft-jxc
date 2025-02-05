import { JSX } from "react";
import { atom } from "jotai";
import { PageConfirm } from "tonwa-app";
import { wait } from "tonwa-com";
import { EntitySheet } from "../../Biz";
import { ReturnUseBinPicks, StoreSheet, StoreSheetMyDrafts, StoreSheetMyList } from "../../Store";
import { ControlBiz, ControlEntity } from "..";
import { setAtomValue } from "../../tools";
import { EnumSheetEditReturn } from "./ControlSheet";
import { ControlSheetList } from "./ControlSheetList";
// import { PageSheetStart } from "./PageSheetStart";
// import { PageSheetEdit } from "./PageSheetEdit";
// import { PageSheetList } from "./PageSheetList";
import { ControlSheetEdit } from "./ControlSheetEdit";
import { ControlSheetStart } from "./ControlSheetStart";

export abstract class ControlSheetDash extends ControlEntity<EntitySheet> {
    readonly atomViewSubmited = atom(undefined as any);
    readonly myDraftsStore: StoreSheetMyDrafts;
    readonly myArchiveList: StoreSheetMyList;
    hasUserDefaults: boolean;
    #controlSheetStart: ControlSheetStart;
    #controlSheetEdit: ControlSheetEdit;
    #controlSheetList: ControlSheetList;

    constructor(controlBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controlBiz, entitySheet);
        const { storeBiz } = controlBiz;
        this.myDraftsStore = new StoreSheetMyDrafts(storeBiz, entitySheet);
        this.myArchiveList = new StoreSheetMyList(storeBiz, entitySheet);
        console.log('ControlSheetDash', entitySheet.caption, this.keyId);
    }

    protected abstract createControlSheetStart(): ControlSheetStart;
    protected abstract createControlSheetEdit(): ControlSheetEdit;
    protected abstract createControlSheetList(): ControlSheetList;

    get controlSheetStart() { return this.#controlSheetStart; }
    get controlSheetEdit() { return this.#controlSheetEdit; }
    get controlSheetList() { return this.#controlSheetList; }

    async start() {
        await Promise.all([
            this.loadUserDefaults(),
            this.myDraftsStore.loadMyDrafts(),
        ]);
    }

    private async loadUserDefaults() {
        this.hasUserDefaults = await this.controlBiz.loadUserDefaults();
    }

    onPageSheetStart = async () => {
        this.#controlSheetStart = this.createControlSheetStart();
        let newSheetId = await this.openModal<number>(this.PageSheetNew());
        if (newSheetId === undefined) return;
        await this.onPageSheetEdit(newSheetId);
    }

    onPageSheetEdit = async (id: number) => {
        this.#controlSheetEdit = this.createControlSheetEdit();
        let ret = await this.openModalAsync<EnumSheetEditReturn>(
            this.PageSheetEdit(),
            this.controlSheetEdit.storeSheet.load(id)
        );
        switch (ret) {
            case EnumSheetEditReturn.submit:
                this.afterSubmited(id);
                break;
            case EnumSheetEditReturn.discard:
                this.afterDiscard(id);
                break;
        }
    }

    private async afterSubmited(sheetId: number) {
        const { mainStore, storeSheet } = this.controlSheetEdit;
        const { no } = mainStore;
        this.myDraftsStore.removeMyDraft(sheetId);
        let { caption } = storeSheet;
        let viewSubmited = this.ViewSucceed();
        setAtomValue(this.atomViewSubmited, viewSubmited);
    }

    protected abstract ViewSucceed(): JSX.Element;

    private async afterDiscard(sheetId: number) {
        this.myDraftsStore.discardDraft(sheetId);
        // this.closeModal(); allready closed
    }

    onPageSheetList = async () => {
        this.#controlSheetList = this.createControlSheetList();
        await this.openModal(this.PageSheetList());
    }

    async onRemoveDraft() {
        if (await this.openModal(this.PageConfirmClearDrafts()) !== true) return;
        await this.myDraftsStore.deleteAllMyDrafts();
        await wait(10);
    }

    protected abstract PageConfirmClearDrafts(): JSX.Element;
    protected abstract PageSheetNew(): JSX.Element;
    protected abstract PageSheetEdit(): JSX.Element;
    protected abstract PageSheetList(): JSX.Element;

    onPickedNew = async (results: ReturnUseBinPicks) => {
        await this.onPicked(results);
        await this.setSheetAsDraft();
        // setAtomValue(this.atomLoaded, true);
        const { mainStore } = this.controlSheetStart;
        this.closeModal(mainStore.valRow.id);
    }

    onMainPendPicked = async (results: ReturnUseBinPicks) => {
        await this.onPicked(results);
        await this.setSheetAsDraft();
        const { storeSheet, binStore } = this.controlSheetStart;
        await binStore.saveDetailsDirect();
        // setAtomValue(this.atomLoaded, true);
        this.closeModal(storeSheet.mainId);
    }

    async onPicked(results: ReturnUseBinPicks) {
        const { mainStore } = this.controlSheetStart;
        let ret = await mainStore.startFromPickResults(results);
        if (ret === undefined) {
            return;
            /*
            if (this.mainId === undefined) {
                // 还没有创建单据
                if (sheetConsole.steps === undefined) {
                    setTimeout(() => {
                        sheetConsole.close();
                    }, 100);
                }
            }
            return; // 已有单据，不需要pick. 或者没有创建新单据
            */
        }
        this.onSheetAdded();
        return ret;
    }

    private async onSheetAdded() {
        const { storeSheet } = this.controlSheetStart;
        await this.myDraftsStore.onSheetAdded(storeSheet);
    }

    async setSheetAsDraft() {

    }

    notifyRowChange(storeSheet: StoreSheet) {
        this.myDraftsStore.sheetRowCountChanged(storeSheet);
    }
}
