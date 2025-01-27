import { PageQueryMore } from "app/coms";
import { UqApp, useUqApp } from "app/UqApp";
import { ViewCurSiteHeader } from "app/views/Site";
import { useRef } from "react";
import { dateFromMinuteId, EasyTime } from "tonwa-com";
import { UqExt } from "uqs/UqDefault";

class LogStore {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.uq = uqApp.uq;
    }

    getLogs = async (param: any, pageStart: number, pageSize: number) => {
        let ret = await this.uq.GetLogs.page(param, pageStart, pageSize);
        return ret.$page;
    }
}

function useLogStore() {
    const uqApp = useUqApp();
    const { current: store } = useRef(new LogStore(uqApp));
    return store;
}

export function PageCmdLog() {
    const store = useLogStore();
    function ViewItem({ value: { id, value } }: { value: { id: number; value: any; } }) {
        return <div className="py-2 px-3">
            <div className="small text-body-tertiary"><EasyTime date={dateFromMinuteId(id)} /></div>
            <pre>{JSON.stringify(value, undefined, 4)}</pre>
        </div>;
    }
    return <PageQueryMore
        query={store.getLogs}
        param={{}}
        sortField="id"
        ViewItem={ViewItem}
        pageSize={100}
        header={<ViewCurSiteHeader caption="日志" />}>
    </PageQueryMore>;
}
