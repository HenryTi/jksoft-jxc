import { Band } from "app/coms";
import { PageDeriveEdit, GenSheetOld, GenDerive } from "app/template/SheetOld";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";
import { UserView } from "tonwa-app";
import { Sheet } from "uqs/UqDefault";
import { GenSale } from "./SheetSale";

export class GenStoreOut extends GenDerive {
    readonly bizEntityName = 'storeout';
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
    protected getOriginSheetGen(): GenSheetOld { return this.uqApp.objectOf(GenSale) as any; }
}

function PageStoreOutEdit() {
    return <PageDeriveEdit Gen={GenStoreOut} />;
}

export function routeStoreOut(uqApp: UqApp) {
    let { path } = uqApp.objectOf(GenStoreOut);
    return <>
        <Route path={path} element={<PageStoreOutEdit />} />
        <Route path={`${path}/:id`} element={<PageStoreOutEdit />} />
    </>;
}
