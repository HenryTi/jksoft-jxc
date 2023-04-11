import { Band } from "app/coms";
import { PageDeriveEdit, GenSheet, GenDerive } from "app/template/Sheet";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { GenPurchase } from "./SheetPurchase";
import { Sheet } from "uqs/UqDefault";

export class GenStoreIn extends GenDerive {
    readonly bizEntityName = 'storein';
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
    protected getOriginSheetGen(): GenSheet { return this.uqApp.objectOf(GenPurchase) as any; }
}

function PageStoreInEdit() {
    return <PageDeriveEdit Gen={GenStoreIn} />;
}

export function routeStoreIn(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenStoreIn);
    return <>
        <Route path={path} element={<PageStoreInEdit />} />
        <Route path={`${path}/:id`} element={<PageStoreInEdit />} />
    </>;
}