import { Band } from "app/coms";
import { PageDeriveEdit, PartSheet, PartDerive } from "app/template/Sheet";
import { SeedJoin, SeedSheet } from "app/tool";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { UqAction, UqQuery } from "tonwa-uq";
import { SheetType, Sheet } from "uqs/UqDefault";
import { SheetPartPurchase } from "./SheetPurchase";

const captionStoreIn = '入库单';
const pathStoreIn = 'store-in';

class SeedStoreIn extends SeedSheet {
    readonly sheet = SheetType.StoreIn;
}

export class SheetPartStoreIn extends PartDerive {
    readonly sheetType = SheetType.StoreIn;
    readonly caption: string;
    readonly path: string;
    readonly QueryOrigin: UqQuery<any, any>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly ViewTarget: (props: { sheet: Sheet }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: Sheet }) => JSX.Element;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.caption = captionStoreIn;
        this.path = pathStoreIn;

        let uq = this.uq;
        this.QueryOrigin = uq.SearchSheetReady;
        this.ActBookSheet = uq.BookSheetStoreIn;

        this.ViewTarget = ({ sheet }: { sheet: Sheet }) => {
            return <UserView id={sheet.operator} />;
        }
        this.ViewTargetBand = ({ sheet }: { sheet: Sheet }) => {
            return <Band labelClassName="text-end" label={'操作员'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    protected getOriginSheetPart(): PartSheet { return this.uqApp.objectOf(SheetPartPurchase) as any; }
}

function PageStoreInEdit() {
    return <PageDeriveEdit Part={SheetPartStoreIn} />;
}

export const routeStoreIn = <>
    <Route path={pathStoreIn} element={<PageStoreInEdit />} />
    <Route path={`${pathStoreIn}/:id`} element={<PageStoreInEdit />} />
</>;
