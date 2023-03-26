import { Band } from "app/coms";
import { PageDeriveEdit, PartSheet, PartDerive } from "app/template/Sheet";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { UqAction, UqQuery } from "tonwa-uq";
import { SheetType, Sheet } from "uqs/UqDefault";
import { PartSheetSale } from "./SheetSale";

const captionStoreOut = '出库单';
const pathStoreOut = 'store-out';

export class SheetPartStoreOut extends PartDerive {
    readonly sheetType = SheetType.StoreOut;
    readonly caption: string;
    readonly path: string;
    readonly QueryOrigin: UqQuery<any, any>;
    readonly ActBookSheet: UqAction<any, any>;
    readonly ViewTarget: (props: { sheet: Sheet }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: Sheet }) => JSX.Element;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.caption = captionStoreOut;
        this.path = pathStoreOut;

        let uq = this.uq;
        this.QueryOrigin = uq.SearchSheetReady;
        this.ActBookSheet = uq.BookSheetStoreOut;

        this.ViewTarget = ({ sheet }: { sheet: Sheet }) => {
            return <UserView id={sheet.operator} />;
        }
        this.ViewTargetBand = ({ sheet }: { sheet: Sheet }) => {
            return <Band labelClassName="text-end" label={'操作员'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    protected getOriginSheetPart(): PartSheet { return this.uqApp.objectOf(PartSheetSale) as any; }
}

function PageStoreOutEdit() {
    return <PageDeriveEdit Part={SheetPartStoreOut} />;
}

export const routeStoreOut = <>
    <Route path={pathStoreOut} element={<PageStoreOutEdit />} />
    <Route path={`${pathStoreOut}/:id`} element={<PageStoreOutEdit />} />
</>;
