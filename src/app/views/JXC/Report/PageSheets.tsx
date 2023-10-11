import { Entity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { Period, UseQueryOptions, ViewPeriodHeader, usePeriod } from "app/tool";
import { useAtomValue } from "jotai";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";
import { FA, List, getAtomValue } from "tonwa-com";
import { ReturnGetSiteSheetList$page, ReturnGetSiteSheetsRet } from "uqs/UqDefault";

export const headerSheets = '业务单据详情';

export function PageSheets() {
    const { uq, biz } = useUqApp();
    const { openModal, closeModal } = useModal();
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
        let entity = biz.entityIds[phrase];
        return <div className="px-3 py-3 d-flex cursor-pointer">
            <div className="flex-grow-1">{entity.caption ?? entity.name}</div>
            <div className="fw-bold">{count}</div>
            <div className="ms-5"><FA name="angle-right" /></div>
        </div>
    }
    function onItemClick(item: ReturnGetSiteSheetsRet) {
        const { phrase, count } = item;
        let entity = biz.entityIds[phrase];
        openModal(<PageSheetList entity={entity} />);
    }
    return <Page header={headerSheets}>
        <ViewPeriodHeader period={period} setEnumPeriod={setEnumPeriod} />
        <List items={data} ViewItem={ViewItem} onItemClick={onItemClick} />
    </Page>;
}

function PageSheetList({ entity }: { entity: Entity; }) {
    const { uq } = useUqApp();
    function ViewItem({ value }: { value: ReturnGetSiteSheetList$page }) {
        return <div className="px-3 py-2">
            {JSON.stringify(value)}
        </div>;
    }
    return <PageQueryMore header={(entity.caption ?? entity.name) + '列表'}
        query={uq.GetSiteSheetList}
        sortField="id"
        param={{ phrase: entity.id }}
        ViewItem={ViewItem}
    >
    </PageQueryMore>
}
