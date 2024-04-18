import { NavigateFunction, useNavigate, useParams } from "react-router-dom";
import { PageSheetDash } from "./dash";
import { PageSheetEdit, PageSheetNew } from "./dash";
import { SheetConsole, SheetSteps, SheetStore, useSheetEntity } from "./store";
import { from62, to62 } from "tonwa-com";
import { useRef } from "react";
import { EntitySheet } from "app/Biz";
import { PageMoreCacheData } from "app/coms";
import { UqApp } from "app/UqApp";

export function RouteSheetEdit() {
    const entitySheet = useSheetEntity();
    const navigate = useNavigate();
    const { id } = useParams();
    const sheetId = from62(id);
    const routeConsole = useRef(new RouteConsole(navigate, entitySheet));
    return <PageSheetEdit store={routeConsole.current.createSheetStore()} sheetId={sheetId} />;
}

export function RouteSheetNew() {
    const entitySheet = useSheetEntity();
    const navigate = useNavigate();
    const routeConsole = useRef(new RouteConsole(navigate, entitySheet));
    return <PageSheetNew store={routeConsole.current.createSheetStore()} />;
}

export function RouteSheetDash() {
    const entitySheet = useSheetEntity();
    return <PageSheetDash entitySheet={entitySheet} />;
}

let locationState = 1;
class RouteConsole extends SheetConsole {
    private readonly uqApp: UqApp;
    private readonly navigate: NavigateFunction;

    constructor(navigate: NavigateFunction, entitySheet: EntitySheet) {
        super(entitySheet);
        this.uqApp = entitySheet.biz.uqApp;
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

    async onSheetAdded(store: SheetStore/* sheetId: number, no: string*/): Promise<void> {
        const { main } = store;
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
}
