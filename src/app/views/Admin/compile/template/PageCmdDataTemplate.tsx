import { useUqApp } from "app/UqApp";
import { useRef } from "react";
import { Page } from "tonwa-app";
import { StoreTemplates, ViewGroup } from "./Template";

export function PageCmdDataTemplate() {
    const uqApp = useUqApp();
    const { current: store } = useRef(new StoreTemplates(uqApp));
    return <Page header="数据格式">
        {store.groups.map(v => <ViewGroup key={v.name} group={v} store={store} />)}
    </Page>;
}
