import { Entity } from "app/Biz";
import { UqApp, useUqApp } from "app/UqApp";
import { useRef } from "react";
import { Page } from "tonwa-app";
import { theme } from "tonwa-com";

const rowCols = ' gx-3 row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 ';
export function PageCmdPrintTemplate() {
    const uqApp = useUqApp();
    const { current: store } = useRef(new StoreTemplates(uqApp));
    return <Page header="打印模板">
        {store.groups.map(v => <ViewGroup key={v.name} group={v} store={store} />)}
    </Page>;
}

function ViewGroup({ group, store }: { group: Group; store: StoreTemplates; }) {
    const { list } = group;
    return <div className={theme.bootstrapContainer}>
        <div className={rowCols + ' border-bottom mb-2 '}>
            {list.map(v => <LinkPrintTemplate key={v.entity.id} store={store} entityTemplates={v} />)}
        </div>
    </div>;
}

function LinkPrintTemplate({ entityTemplates, store }: { entityTemplates: EntityTemplates; store: StoreTemplates; }) {
    const { entity } = entityTemplates;
    const { caption } = entity;
    return <div className="mx-2 my-2 px-3 py-2">{caption}</div>;
}

interface Template {
    id: number;
    base: Entity;
    no: string;
    ex: string;
    template: string;
}

interface EntityTemplates {
    entity: Entity;
    templates: Template[];
}

interface Group {
    name: string;
    list: EntityTemplates[];
}

class StoreTemplates {
    private readonly uqApp: UqApp;
    readonly groups: Group[];

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        const { biz } = uqApp;
        this.groups = [
            this.initGroup('Sheet', biz.sheets),
            this.initGroup('Atom', biz.atoms),
        ];
    }

    private initGroup(name: string, entities: Entity[]): Group {
        return {
            name,
            list: entities.map(v => ({ entity: v, templates: undefined }))
        }
    }
}
