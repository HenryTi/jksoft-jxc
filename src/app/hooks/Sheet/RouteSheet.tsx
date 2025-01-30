import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { PageSheetDash } from "./dash";
import { PageSheetEdit, PageSheetNew } from "./dash";
import { SheetConsole, SheetSteps, SheetStore } from "./store";
import { from62, to62 } from "tonwa-com";
import { useRef } from "react";
import { EntitySheet } from "tonwa";
import { PageMoreCacheData } from "app/coms";
import { UqApp, useUqApp } from "app/UqApp";
import { Modal, Page, useModal } from "tonwa-app";

export function RouteSheetEdit() {
    const { id } = useParams();
    const sheetId = from62(id);
    let store = useSheetStore();
    return <PageSheetEdit store={store} sheetId={sheetId} />;
}

export function RouteSheetNew() {
    let store = useSheetStore();
    return <PageSheetNew store={store} />;
}

function useEntitySheet() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    return entitySheet;
}

function useSheetStore() {
    const uqApp = useUqApp();
    const entitySheet = useEntitySheet();
    const navigate = useNavigate();
    const modal = useModal();
    const routeConsole = useRef(new RouteConsole(uqApp, navigate, modal, entitySheet));
    return routeConsole.current.createSheetStore();
}

export function RouteSheetDash() {
    const entitySheet = useEntitySheet();
    if (entitySheet === undefined) {
        return <Page header="Unknown sheet">
            <div className="m-3">无单据定义</div>
        </Page>;
    }
    return <PageSheetDash entitySheet={entitySheet} />;
}

let locationState = 1;
class RouteConsole extends SheetConsole {
    private readonly uqApp: UqApp;
    private readonly navigate: NavigateFunction;

    constructor(uqApp: UqApp, navigate: NavigateFunction, modal: Modal, entitySheet: EntitySheet) {
        super(modal, entitySheet);
        this.uqApp = uqApp;
        this.navigate = navigate;
    }
    close(): void {
        this.navigate(-1);
    }
    restart(): void {
        this.navigate(`/sheet/${to62(this.entitySheet.id)}`, { replace: true, state: locationState++ });
    }

    // 废弃当前单据
    discard(sheetId: number): void {
        this.removeFromCache(sheetId);
        this.navigate(-1);
    }

    removeFromCache(sheetId: number) {
        let data = this.uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (data) {
            data.removeItem<{ id: number; }>(v => v.id === sheetId) as any;
        }
    }

    async onSheetAdded(store: SheetStore): Promise<void> {
        const { mainStore: main } = store;
        const { valRow, no } = main;
        let { id, i, x, origin, price, value, amount } = valRow;
        if (id <= 0) return;
        let data = this.uqApp.pageCache.getPrevData<PageMoreCacheData>();
        if (!data) return;
        const { id: entityId } = this.entitySheet;
        data.addItem({
            id,
            no,
            entityId,
            i,
            x,
            origin, price, value, amount
        });
    }

    sheetRowCountChanged(store: SheetStore) {
    }

    get steps() { return undefined as SheetSteps; }
    set steps(value: SheetSteps) { }

    async onSubmited(store: SheetStore): Promise<void> {        // 单据已提交
        // removeSheetFromCache();
        const { mainStore: main } = store;
        const { valRow, no } = main;
        this.removeFromCache(valRow.id);
        let { caption, name } = this.entitySheet;
        if (caption === undefined) caption = name;
        this.uqApp.refreshAction?.();
        const onModalClose = (ret: any) => {
            this.modal.close(ret);
        }
        let ret = await this.modal.open<boolean>(<Page header="提交成功" back="none">
            <div className="p-3">
                {caption} <b>{no}</b> 已提交
            </div>
            <div className="border-top p-3">
                <button className="btn btn-outline-primary" onClick={onModalClose}>返回</button>
                <button className="ms-3 btn btn-outline-secondary" onClick={() => onModalClose(true)}>新建{caption}</button>
            </div>
        </Page>);
        if (ret === true) {
            this.restart();
            /*
            const { entitySheet } = store;
            navigate(`/sheet/${to62(entitySheet.id)}`, { replace: true, state: locationState++ });
            */
        }
        else {
            this.close();
            // navigate(-1);
        }

    }
}
