import { PageIDList, PageIDNew, PageIDView, PartID } from "app/template/ID";
import { BaseID, BaseIDPropUnit } from "app/tool";
import { UqApp } from "app/UqApp";
import { Route } from "react-router-dom";

export const pathContactNew = 'contact-new';
export const pathContactList = 'contact-list';
export const pathContactView = 'contact-view';
export const pathContactEdit = 'contact-edit';

export class IDPartContact extends PartID {
    readonly path: string;

    readonly baseID: BaseID;
    get caption(): string { return '往来单位' }

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.baseID = uqApp.objectOf(BaseIDContact);
    }
}

class BaseIDContact extends BaseIDPropUnit {
    readonly prop = 'contact';
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
