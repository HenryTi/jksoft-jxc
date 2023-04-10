import { UqApp } from "app/UqApp";
import { PageAtomList, PageAtomNew, PageAtomView, GenAtom, PageAtomSelect } from "app/template/Atom";
import { Route } from "react-router-dom";
import { uqSchema } from "uqs/UqDefault";

export class GenContact extends GenAtom {
    readonly bizEntityName = uqSchema.$biz.contact.name;

    get SelectPage(): JSX.Element {
        return <PageAtomSelect Gen={GenContact} />;
    }
}

export function routeContact(uqApp: UqApp) {
    let gen = uqApp.objectOf(GenContact);
    return <>
        <Route path={gen.pathNew} element={<PageAtomNew Gen={GenContact} />} />
        <Route path={gen.pathList} element={<PageAtomList Gen={GenContact} />} />
        <Route path={`${gen.pathView}/:id`} element={<PageAtomView Gen={GenContact} />} />
    </>;
};
