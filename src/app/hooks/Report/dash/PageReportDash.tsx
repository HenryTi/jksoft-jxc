import { EntityReport } from "tonwa";
import { useCallback, useMemo, useRef } from "react";
import { Page, useModal } from "tonwa-app";
import { ReportConsole } from "../store";
import { Sep, SpinnerSmall, useEffectOnce, wait } from "tonwa-com";
import { useAtomValue } from "jotai";
import { PageQueryMore, useQueryMore } from "app/coms";

let rowId = 1;
interface Row {
    id: number; name: string;
}

export function PageReportDash({ entityReport }: { entityReport: EntityReport; }) {
    const modal = useModal();
    const { current: dashConsole } = useRef(new ReportConsole(modal, entityReport));
    const bizScript = useAtomValue(dashConsole.atomBizScript);
    useEffectOnce(() => {
        (async function () {
            await dashConsole.loadBizScript();
        })();
    });

    const memoRowId = useMemo(() => rowId, []);
    const { view, items } = useQueryMore<any, Row>({
        param: {
        },
        sortField: 'id',
        pageStart: undefined,
        pageSize: 1000,
        pageMoreSize: undefined,
        noAutoLoad: true,
        query: dashConsole.loadReport,
        ViewItem,
        getKey: (v) => v.id,
    });
    function ViewItem({ value }: { value: any }) {
        return <div className="p-5 border-bottom">
            {JSON.stringify(value)}
        </div>
    }

    const { caption, name } = entityReport;
    let pageHeader = caption ?? name;
    let viewContent = bizScript === undefined ?
        <SpinnerSmall />
        :
        <pre>{bizScript}</pre>;

    async function onQuery() {
        dashConsole;
        await items.startLoad();
    }

    { viewContent }
    return <Page header={pageHeader}>
        <pre className="m-3">{bizScript}</pre>
        <div className="m-3"><button className="btn btn-primary" onClick={onQuery}>查询</button></div>
        <Sep />
        {view}
    </Page>;
}
