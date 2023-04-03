import { PageIDList, PageIDNew, PageIDView, GenID } from "app/template/ID";
import { Route } from "react-router-dom";

export const pathContactNew = 'contact-new';
export const pathContactList = 'contact-list';
export const pathContactView = 'contact-view';
export const pathContactEdit = 'contact-edit';

export class GenContact extends GenID {
    readonly itemName = 'contact';
    readonly path: string;
}

function PageContactNew() {
    return <PageIDNew Gen={GenContact} />;
}

function PageContactView() {
    return <PageIDView Gen={GenContact} />;
}

function PageContactList() {
    return <PageIDList Gen={GenContact} />
}

export const routeContact = <>
    <Route path={pathContactNew} element={<PageContactNew />} />
    <Route path={pathContactList} element={<PageContactList />} />
    <Route path={`${pathContactView}/:id`} element={<PageContactView />} />
</>;
