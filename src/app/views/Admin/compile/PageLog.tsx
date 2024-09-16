import { PageQueryMore } from "app/coms";
import { UqApp, useUqApp } from "app/UqApp";
import { useRef } from "react";
import { Page } from "tonwa-app";
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
    function ViewItem({ value: { id, value } }: { value: { id: number; value: string; } }) {
        return <div className="py-2 px-3">
            <div className="small text-body-tertiary"><EasyTime date={dateFromMinuteId(id)} /></div>
            <div>{value}</div>
        </div>;
    }
    return <PageQueryMore
        query={store.getLogs}
        param={{}}
        sortField="id"
        ViewItem={ViewItem}
        pageSize={100}
        header="日志">
    </PageQueryMore>;
}
