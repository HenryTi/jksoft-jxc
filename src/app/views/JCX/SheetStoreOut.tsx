import { Band } from "app/coms";
import { PartProps } from "app/template";
import { PageDeriveEdit, PartSheet, PartDerive } from "app/template/Sheet";
import { BaseID, BaseIDPropUnit } from "app/tool";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { UqAction, UqID, UqQuery } from "tonwa-uq";
import { SheetStoreOut, Detail } from "uqs/UqDefault";
import { SheetPartSale } from "./SheetSale";
import { pathStoreIn } from "./SheetStoreIn";

export const captionStoreOut = '出库单';
export const pathStoreOut = 'store-out';

export class SheetPartStoreOut extends PartDerive<SheetStoreOut, Detail> {
    readonly caption: string;
    readonly path: string;
    readonly baseID: BaseID;
    readonly QueryOrigin: UqQuery<any, any>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly ViewTarget: (props: { sheet: SheetStoreOut }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: SheetStoreOut }) => JSX.Element;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.caption = captionStoreOut;
        this.path = pathStoreOut;
        this.baseID = uqApp.objectOf(BaseIDStoreOut);

        let uq = this.uq;
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
    protected getOriginSheetPart(): PartSheet { return this.uqApp.objectOf(SheetPartSale) as any; }

    buildSheet(id: number, no: string, target: number): SheetStoreOut {
        return { id, no, operator: target };
    }
}

class BaseIDStoreOut extends BaseIDPropUnit {
    readonly prop = 'storeout';
}

function PageStoreOutEdit() {
    return <PageDeriveEdit Part={SheetPartStoreOut} />;
}

export const routeStoreOut = <>
    <Route path={pathStoreOut} element={<PageStoreOutEdit />} />
    <Route path={`${pathStoreOut}/:id`} element={<PageStoreOutEdit />} />
</>;
