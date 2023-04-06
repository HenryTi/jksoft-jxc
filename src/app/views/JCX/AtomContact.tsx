import { PageAtomList, PageAtomNew, PageAtomView, GenAtom } from "app/template/Atom";
import { Route } from "react-router-dom";

export const pathContactNew = 'contact-new';
export const pathContactList = 'contact-list';
export const pathContactView = 'contact-view';
export const pathContactEdit = 'contact-edit';

export class GenContact extends GenAtom {
    readonly atomName = 'contact';
    readonly path: string;
}

function PageContactNew() {
    return <PageAtomNew Gen={GenContact} />;
}

function PageContactView() {
    return <PageAtomView Gen={GenContact} />;
}

function PageContactList() {
    return <PageAtomList Gen={GenContact} />
}

export const routeContact = <>
    <Route path={pathContactNew} element={<PageContactNew />} />
    <Route path={pathContactList} element={<PageContactList />} />
    <Route path={`${pathContactView}/:id`} element={<PageContactView />} />
</>;
