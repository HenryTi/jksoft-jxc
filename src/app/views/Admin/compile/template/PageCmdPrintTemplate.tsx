import { useUqApp } from "app/UqApp";
import { useRef } from "react";
import { Page } from "tonwa-app";
import { StoreTemplates, ViewGroup } from "./Template";
import { ViewCurSiteHeader } from "app/views/Site";

export function PageCmdPrintTemplate() {
    const uqApp = useUqApp();
    const { current: store } = useRef(new StoreTemplates(uqApp));
    return <Page header={<ViewCurSiteHeader caption="打印模板" />}>
        {store.groups.map(v => <ViewGroup key={v.name} group={v} store={store} />)}
    </Page>;
}
