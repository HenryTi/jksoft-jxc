import { Band } from "app/coms";
import { PageDeriveEdit, GenSheet, GenDerive } from "app/template/Sheet";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { UqAction, UqQuery } from "tonwa-uq";
import { Sheet, uqSchema } from "uqs/UqDefault";
import { GenSale } from "./SheetSale";

const pathStoreOut = 'store-out';

export class GenStoreOut extends GenDerive {
    readonly sheetName = 'storeout';
    readonly path = pathStoreOut;
    readonly ViewTarget: (props: { sheet: Sheet }) => JSX.Element;
    readonly ViewTargetBand: (props: { sheet: Sheet }) => JSX.Element;

    readonly targetCaption = '库房';

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.ViewTarget = ({ sheet }: { sheet: Sheet }) => {
            return <UserView id={sheet.operator} />;
        }
        this.ViewTargetBand = ({ sheet }: { sheet: Sheet }) => {
            return <Band label={'操作员'}>
                <this.ViewTarget sheet={sheet} />
            </Band>;
        }
    }
    protected getOriginSheetGen(): GenSheet { return this.uqApp.objectOf(GenSale) as any; }
}

function PageStoreOutEdit() {
    return <PageDeriveEdit Gen={GenStoreOut} />;
}

export const routeStoreOut = <>
    <Route path={pathStoreOut} element={<PageStoreOutEdit />} />
    <Route path={`${pathStoreOut}/:id`} element={<PageStoreOutEdit />} />
</>;
