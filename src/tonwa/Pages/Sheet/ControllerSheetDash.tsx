import { atom } from "jotai";
import { PageConfirm } from "tonwa-app";
import { wait } from "tonwa-com";
import { EntitySheet } from "../../Biz";
import { StoreSheetMyDrafts, StoreSheetMyList } from "../../Store";
import { ControllerSheetEdit, ControllerSheetNew } from "./ControllerSheet";
import { ControllerSheetList } from "./ControllerSheetList";
import { ControllerBiz, ControllerEntity } from "../../Controller";
import { PageSheetNew } from "./PageSheetNew";
import { PageSheetEdit } from "./PageSheetEdit";
import { PageSheetList } from "./PageSheetList";

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
        await this.modal.open(this.PageSheetNew(controllerSheetNew));
    }

    onPageSheetEdit = async () => {
        const controllerSheetEdit = new ControllerSheetEdit(this.controllerBiz, this.entity);
        await this.modal.open(this.PageSheetEdit(controllerSheetEdit));
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
