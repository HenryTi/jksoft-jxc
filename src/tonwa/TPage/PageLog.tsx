import { useRef, useState } from "react";
import { Page, PageSpinner } from "tonwa-app";
import { dateFromMinuteId, EasyTime, FA, useEffectOnce } from "tonwa-com";
import { ReturnGetLogs$page, UqExt } from "uqs/UqDefault";
import { UqApp, useUqApp } from "app/UqApp";
import { ViewCurSiteHeader } from "../View";
// import { ViewCurSiteHeader } from "app/views/Site";

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

    async getNextLog(cur: number) {
        let ret = await this.uq.GetLogs.page({}, cur, 1);
        return ret.$page[0];
    }
}

function useLogStore() {
    const uqApp = useUqApp();
    const { current: store } = useRef(new LogStore(uqApp));
    return store;
}

export function PageCmdLog() {
    const store = useLogStore();
    const [log, setLog] = useState<ReturnGetLogs$page>();
    let refFirst = useRef<number>(undefined);
    const { current: first } = refFirst;
    useEffectOnce(() => {
        (async function () {
            let ret = await store.getNextLog(undefined);
            setLog(ret);
            refFirst.current = ret.id;
        })();
    });
    if (log === undefined) {
        return <PageSpinner />;
    }
    function ViewItem({ value: { id, value } }: { value: { id: number; value: any; } }) {
        return <div className="py-2 px-3">
            <div className="small text-body-tertiary"><EasyTime date={dateFromMinuteId(id)} /></div>
            <pre>{JSON.stringify(value, undefined, 4)}</pre>
        </div>;
    }
    async function onPrev() {
        let ret = await store.getNextLog(log.id);
        setLog(ret);
    }
    async function onLatest() {
        let ret = await store.getNextLog(undefined);
        setLog(ret);
    }
    let vContent = <ViewItem value={log} />;
    let cnLatest: string = 'btn btn-sm me-3';
    let disabled: boolean;
    if (log.id < first) {
        disabled = false;
        cnLatest += ' btn-info ';
    }
    else {
        disabled = true;
        cnLatest += ' btn-outline-info ';
    }

    return <Page header={<ViewCurSiteHeader caption="日志" />} >
        <div className="px-3 py-1 border-bottom tonwa-bg-gray-2">
            <button className="btn btn-sm btn-info me-3" onClick={onPrev}>
                前一个 <FA name="angle-up" className="ms-1" />
            </button>
            <button className={cnLatest} onClick={onLatest} disabled={disabled}>
                最新
            </button>
        </div>

        {vContent}
    </Page>;
    /*
    return <PageQueryMore
        query={store.getLogs}
        param={{}}
        sortField="id"
        ViewItem={ViewItem}
        pageSize={20}
        header={<ViewCurSiteHeader caption="日志" />}>
    </PageQueryMore>;
    */
}
