import { Band } from "app/coms";
import { PartProps } from "app/template";
import { PageDeriveEdit, PartSheet, PartDerive } from "app/template/Sheet";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { SheetStoreOut, DetailOrigin } from "uqs/JsTicket";
import { SheetPartSale } from "./SheetSale";
import { pathStoreIn } from "./SheetStoreIn";

export const captionStoreIn = '出库单';
export const pathStoreOut = 'store-out';
// const pathStoreInNew = 'store-in';
/// const pathStoreInEdit = 'store-in';

export class SheetPartStoreOut extends PartDerive<SheetStoreOut, DetailOrigin> {
    readonly caption: string;
    readonly pathNew: string;
    readonly pathEdit: string;
    readonly ID: UqID<any>;
    readonly QueryOrigin: UqQuery<any, any>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly PageSheetDetail: (props: (PartProps<PartSheet<SheetStoreOut, DetailOrigin>> & { detail: Partial<DetailOrigin>; })) => JSX.Element;
    readonly ViewTarget: (props: { sheet: SheetStoreOut }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: SheetStoreOut }) => JSX.Element;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.caption = captionStoreIn;
        this.pathNew = pathStoreOut;
        this.pathEdit = pathStoreIn;

        let uq = this.uq;
        this.ID = uq.SheetStoreOut;
        this.QueryOrigin = uq.SearchStoreOut;
        this.ActBookSheet = uq.BookSheetStoreOut;

        this.ViewTarget = ({ sheet }: { sheet: SheetStoreOut }) => {
            return <UserView id={sheet.operator} />;
        }
        this.ViewTargetBand = ({ sheet }: { sheet: SheetStoreOut }) => {
            return <Band labelClassName="text-end" label={'操作员'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    protected getOriginSheetPart(): PartSheet { return this.uqApp.partOf(SheetPartSale) as any; }

    buildSheet(id: number, no: string, target: number): SheetStoreOut {
        return { id, no, operator: target };
    }
}

function PageStoreOutEdit() {
    return <PageDeriveEdit Part={SheetPartStoreOut} />;
}

export const routeStoreOut = <>
    <Route path={pathStoreOut} element={<PageStoreOutEdit />} />
    <Route path={`${pathStoreOut}/:id`} element={<PageStoreOutEdit />} />
</>;
