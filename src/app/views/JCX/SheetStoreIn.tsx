import { Band } from "app/coms";
import { PageDeriveEdit, GenSheet, GenDerive } from "app/template/Sheet";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { UqAction, UqQuery } from "tonwa-uq";
import { GenPurchase } from "./SheetPurchase";
import { Sheet, uqSchema } from "uqs/UqDefault";

const pathStoreIn = 'store-in';

export class GenStoreIn extends GenDerive {
    readonly sheetName = 'storein';
    readonly path = pathStoreIn;
    readonly QueryOrigin: UqQuery<any, any>;
    readonly ViewTarget: (props: { sheet: Sheet }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: Sheet }) => JSX.Element;

    readonly targetCaption = '库房';

    constructor(uqApp: UqApp) {
        super(uqApp);

        let uq = this.uq;
        this.QueryOrigin = uq.SearchSheetReady;

        this.ViewTarget = ({ sheet }: { sheet: Sheet }) => {
            return <UserView id={sheet.operator} />;
        }
        this.ViewTargetBand = ({ sheet }: { sheet: Sheet }) => {
            return <Band label={'操作员'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    protected getOriginSheetGen(): GenSheet { return this.uqApp.objectOf(GenPurchase) as any; }
}

function PageStoreInEdit() {
    return <PageDeriveEdit Gen={GenStoreIn} />;
}

export const routeStoreIn = <>
    <Route path={pathStoreIn} element={<PageStoreInEdit />} />
    <Route path={`${pathStoreIn}/:id`} element={<PageStoreInEdit />} />
</>;
