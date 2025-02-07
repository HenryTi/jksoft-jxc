import { atom } from "jotai";
import { PageConfirm } from "tonwa-app";
import { wait } from "tonwa-com";
import { EntitySheet } from "../../Biz";
import { ReturnUseBinPicks, StoreSheetMyDrafts, StoreSheetMyList } from "../../Store";
import { EnumSheetEditReturn } from "./TControlSheet";
import { TControlSheetList } from "./TControlSheetList";
import { ControlBiz, ControlEntity, ControlSheetDash, ControlSheetEdit, ControlSheetList, ControlSheetStart } from "../../Control";
import { PageSheetEdit } from "./PageSheetEdit";
import { PageSheetList } from "./PageSheetList";
import { TControlSheetEdit } from "./TControlSheetEdit";
import { setAtomValue } from "../../tools";
import { TControlSheetStart } from "./TControlSheetStart";
import { JSX } from "react";

export class TControlSheetDash extends ControlSheetDash { // ControlEntity<EntitySheet> {
    /*
    readonly controlSheetNew: ControlSheetStart;
    readonly controlSheetEdit: ControlSheetEdit;
    readonly controlSheetList: ControlSheetList;
    readonly atomViewSubmited = atom(undefined as any);
    readonly myDraftsStore: StoreSheetMyDrafts;
    readonly myArchiveList: StoreSheetMyList;

    constructor(controlBiz: ControlBiz, entitySheet: EntitySheet) {
        super(controlBiz, entitySheet);
        this.controlSheetNew = new ControlSheetStart(this);
        this.controlSheetEdit = new ControlSheetEdit(this);
        this.controlSheetList = new ControlSheetList(this.controlBiz, this.entity);
        this.myDraftsStore = new StoreSheetMyDrafts(this.modal, entitySheet);
        this.myArchiveList = new StoreSheetMyList(this.modal, entitySheet);
        console.log('ControlSheetDash', entitySheet.caption, this.keyId);
    }

    onPageSheetNew = async () => {
        let newSheetId = await this.modal.open<number>(this.PageSheetNew());
        if (newSheetId === undefined) return;
        await this.onPageSheetEdit(newSheetId);
    }

    onPageSheetEdit = async (id: number) => {
        let ret = await this.modal.open<EnumSheetEditReturn>(this.PageSheetEdit());
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
        let viewSubmited = <>{caption} <b>{no}</b> 提交成功!</>;
        setAtomValue(this.atomViewSubmited, viewSubmited);
    }

    private async afterDiscard(sheetId: number) {
        this.myDraftsStore.discardDraft(sheetId);
    }

    onPageSheetList = async () => {
        await this.modal.open(this.PageSheetList());
    }

    async onRemoveDraft() {
        if (await this.modal.open(<PageConfirm header="单据草稿" message="真的要清除全部单据草稿吗？" yes="清除" no="不清除" />) !== true) return;
        await this.myDraftsStore.deleteAllMyDrafts();
        await wait(10);
    }
    */
    protected createControlSheetStart(): ControlSheetStart {
        return new TControlSheetStart(this);
    }
    protected createControlSheetEdit(): ControlSheetEdit {
        return new TControlSheetEdit(this);
    }
    protected createControlSheetList(): ControlSheetList {
        return new TControlSheetList(this.controlBiz, this.entity);
    }

    protected PageSheetEdit() {
        return <PageSheetEdit control={this.controlSheetEdit} />;
    }

    protected PageSheetList() {
        return <PageSheetList control={this.controlSheetList} />;
    }

    protected override PageConfirmClearDrafts(): JSX.Element {
        return <PageConfirm header="单据草稿" message="真的要清除全部单据草稿吗？" yes="清除" no="不清除" />;
    }

    protected override ViewSucceed(): JSX.Element {
        const { mainStore, storeSheet } = this.controlSheetEdit;
        const { no } = mainStore;
        let { caption } = storeSheet;
        return <>{caption} <b>{no}</b> 提交成功!</>;
    }

    /*
    onPickedNew = async (results: ReturnUseBinPicks) => {
        await this.onPicked(results);
        await this.setSheetAsDraft();
        // setAtomValue(this.atomLoaded, true);
        const { mainStore } = this.controlSheetNew;
        this.closeModal(mainStore.valRow.id);
    }

    onMainPendPicked = async (results: ReturnUseBinPicks) => {
        await this.onPicked(results);
        await this.setSheetAsDraft();
        const { storeSheet, binStore } = this.controlSheetNew;
        await binStore.saveDetailsDirect();
        // setAtomValue(this.atomLoaded, true);
        this.closeModal(storeSheet.mainId);
    }

    async onPicked(results: ReturnUseBinPicks) {
        const { mainStore } = this.controlSheetNew;
        let ret = await mainStore.startFromPickResults(results);
        if (ret === undefined) {
            return;
            */
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
    /*
    }
    this.onSheetAdded();
    return ret;
}

private async onSheetAdded() {
    const { storeSheet } = this.controlSheetNew;
    await this.myDraftsStore.onSheetAdded(storeSheet);
}

async setSheetAsDraft() {

}
*/
}
