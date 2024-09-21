import { useUqApp } from "app/UqApp";
import { useRef } from "react";
import { Page } from "tonwa-app";
import { StoreTemplates, ViewGroup } from "./Template";

export function PageCmdPrintTemplate() {
    const uqApp = useUqApp();
    const { current: store } = useRef(new StoreTemplates(uqApp));
    return <Page header="打印模板">
        {store.groups.map(v => <ViewGroup key={v.name} group={v} store={store} />)}
    </Page>;
}
