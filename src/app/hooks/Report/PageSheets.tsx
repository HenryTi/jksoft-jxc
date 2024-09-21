import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { Period, UseQueryOptions, ViewPeriodHeader, pathTo, usePeriod } from "app/tool";
import { useAtomValue } from "jotai";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { FA, List, from62, getAtomValue } from "tonwa-com";
import { ReturnGetSiteSheetList$page, ReturnGetSiteSheetsRet } from "uqs/UqDefault";
import { pathSheetRef } from "./useReport";
import { ViewItemMain } from "../View";

export const headerSheets = '业务单据详情';

export function PageSheets() {
    const { uq, biz } = useUqApp();
    let timeZone: number = 8;
    let unitBizMonth: number = 6;
    let unitBizDate: number = 1;
    const [period, setEnumPeriod] = usePeriod(timeZone, unitBizMonth, unitBizDate, onChanged);
    const state = useAtomValue(period.state);
    const { data } = useQuery([state.from, state.to], async () => {
        // let dateStart = new Date().to
        let { ret } = await uq.GetSiteSheets.query({ from: state.from, to: state.to, timeZone });
        return ret;
    }, UseQueryOptions);
    async function onChanged(period: Period) {
    }
    function ViewItem({ value }: { value: ReturnGetSiteSheetsRet; }) {
        const { phrase, count } = value;
        let entity = biz.entityFromId(phrase);
        return <Link to={pathTo(pathSheetsList, entity.id, undefined)}>
            <div className="px-3 py-3 d-flex">
                <div className="flex-grow-1">{entity.caption ?? entity.name}</div>
                <div className="fw-bold">{count}</div>
                <div className="ms-5"><FA name="angle-right" /></div>
            </div>
        </Link>
    }
    return <Page header={headerSheets}>
        <ViewPeriodHeader period={period} setEnumPeriod={setEnumPeriod} />
        <List items={data} ViewItem={ViewItem} />
    </Page>;
}

export const pathSheetsList = 'sheets-list';
export function PageSheetList() {
    const { uq, biz } = useUqApp();
    const { sheet62 } = useParams();
    let entityId = from62(sheet62);
    let entity = biz.entityFromId(entityId);
    function ViewItem({ value }: { value: ReturnGetSiteSheetList$page }) {
        return <Link to={pathTo(pathSheetRef, value.id, undefined)}>
            <ViewItemMain value={value} isMy={undefined} store={undefined} />
        </Link>;
    }
    return <PageQueryMore header={(entity.caption ?? entity.name)}
        query={uq.GetSiteSheetList}
        sortField="id"
        param={{ phrase: entity.id }}
        ViewItem={ViewItem}
    >
    </PageQueryMore>
}
