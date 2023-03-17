import { Band } from "app/coms";
import { PartProps } from "app/template";
import { PageDeriveEdit, PartSheet, PartDerive } from "app/template/Sheet";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { SheetStoreIn, DetailQPA, DetailOrigin } from "uqs/JsTicket";
import { SheetPartPurchase } from "./SheetPurchase";

export const captionStoreIn = '入库单';
export const pathStoreIn = 'store-in';
// const pathStoreInNew = 'store-in';
/// const pathStoreInEdit = 'store-in';

export class SheetPartStoreIn extends PartDerive<SheetStoreIn, DetailOrigin> {
    readonly caption: string;
    readonly pathNew: string;
    readonly pathEdit: string;
    readonly ID: UqID<any>;
    readonly QueryOrigin: UqQuery<any, any>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly ViewTarget: (props: { sheet: SheetStoreIn }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: SheetStoreIn }) => JSX.Element;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.caption = captionStoreIn;
        this.pathNew = pathStoreIn;
        this.pathEdit = pathStoreIn;

        let uq = this.uq;
        this.ID = uq.SheetStoreIn;
        this.QueryOrigin = uq.SearchStoreIn;
        this.ActBookSheet = uq.BookSheetStoreIn;

        this.ViewTarget = ({ sheet }: { sheet: SheetStoreIn }) => {
            return <UserView id={sheet.operator} />;
        }
        this.ViewTargetBand = ({ sheet }: { sheet: SheetStoreIn }) => {
            return <Band labelClassName="text-end" label={'操作员'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    protected getOriginSheetPart(): PartSheet { return this.uqApp.partOf(SheetPartPurchase) as any; }

    buildSheet(id: number, no: string, target: number): SheetStoreIn {
        return { id, no, operator: target };
    }
}

function PageStoreInEdit() {
    return <PageDeriveEdit Part={SheetPartStoreIn} />;
}

export const routeStoreIn = <>
    <Route path={pathStoreIn} element={<PageStoreInEdit />} />
    <Route path={`${pathStoreIn}/:id`} element={<PageStoreInEdit />} />
</>;
