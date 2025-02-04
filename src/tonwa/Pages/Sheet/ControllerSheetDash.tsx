import { atom } from "jotai";
import { PageConfirm } from "tonwa-app";
import { wait } from "tonwa-com";
import { EntitySheet } from "../../Biz";
import { StoreSheetMyDrafts, StoreSheetMyList } from "../../Store";
import { ControllerSheetNew, EnumSheetEditReturn } from "./ControllerSheet";
import { ControllerSheetList } from "./ControllerSheetList";
import { ControllerBiz, ControllerEntity } from "../../Controller";
import { PageSheetNew } from "./PageSheetNew";
import { PageSheetEdit } from "./PageSheetEdit";
import { PageSheetList } from "./PageSheetList";
import { ControllerSheetEdit } from "./ControllerSheetEdit";
import { setAtomValue } from "../../tools";

export class ControllerSheetDash extends ControllerEntity<EntitySheet> {
    readonly atomViewSubmited = atom(undefined as any);
    readonly myDraftsStore: StoreSheetMyDrafts;
    readonly myArchiveList: StoreSheetMyList;

    constructor(controllerBiz: ControllerBiz, entitySheet: EntitySheet) {
        super(controllerBiz, entitySheet);
        this.myDraftsStore = new StoreSheetMyDrafts(this.modal, entitySheet);
        this.myArchiveList = new StoreSheetMyList(this.modal, entitySheet);
        console.log('ControllerSheetDash', entitySheet.caption, this.keyId);
    }

    onPageSheetNew = async () => {
        const controllerSheetNew = new ControllerSheetNew(this.controllerBiz, this.entity);
        let newSheetId = await this.modal.open(this.PageSheetNew(controllerSheetNew));
        if (newSheetId === undefined) return;
        await this.onPageSheetEdit(newSheetId);
    }

    onPageSheetEdit = async (id: number) => {
        const controllerSheetEdit = new ControllerSheetEdit(this.controllerBiz, this.entity);
        let ret = await this.modal.open<EnumSheetEditReturn>(this.PageSheetEdit(controllerSheetEdit));
        switch (ret) {
            case EnumSheetEditReturn.submit:
                this.afterSubmited(controllerSheetEdit, id);
                break;
            case EnumSheetEditReturn.discard:
                this.afterDiscard(id);
                break;
        }
    }

    private async afterSubmited(controllerSheetEdit: ControllerSheetEdit, sheetId: number) {
        const { mainStore, storeSheet } = controllerSheetEdit;
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
        const controllerSheetList = new ControllerSheetList(this.controllerBiz, this.entity);
        await this.modal.open(this.PageSheetList(controllerSheetList));
    }

    async onRemoveDraft() {
        if (await this.modal.open(<PageConfirm header="单据草稿" message="真的要清除全部单据草稿吗？" yes="清除" no="不清除" />) !== true) return;
        await this.myDraftsStore.deleteAllMyDrafts();
        await wait(10);
    }

    protected PageSheetNew(controllerSheetNew: ControllerSheetNew) {
        return <PageSheetNew controller={controllerSheetNew} />;
    }

    protected PageSheetEdit(controllerSheetEdit: ControllerSheetEdit) {
        return <PageSheetEdit controller={controllerSheetEdit} />;
    }

    protected PageSheetList(controllerSheetList: ControllerSheetList) {
        return <PageSheetList controller={controllerSheetList} />;
    }

}
