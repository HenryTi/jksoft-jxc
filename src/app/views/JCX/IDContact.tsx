import { PageIDList, PageIDNew, PageIDView, PartID } from "app/template/ID";
import { Route } from "react-router-dom";
import { ItemType } from "uqs/UqDefault";

export const pathContactNew = 'contact-new';
export const pathContactList = 'contact-list';
export const pathContactView = 'contact-view';
export const pathContactEdit = 'contact-edit';

export class IDPartContact extends PartID {
    readonly IDType = ItemType.Contact;
    readonly path: string;
    readonly caption = '往来单位';
}

function PageContactNew() {
    return <PageIDNew Part={IDPartContact} />;
}

function PageContactView() {
    return <PageIDView Part={IDPartContact} />;
}

function PageContactList() {
    return <PageIDList Part={IDPartContact} />
}

export const routeContact = <>
    <Route path={pathContactNew} element={<PageContactNew />} />
    <Route path={pathContactList} element={<PageContactList />} />
    <Route path={`${pathContactView}/:id`} element={<PageContactView />} />
</>;
