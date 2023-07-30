import { FA } from "tonwa-com";
import { EnumPeriod, usePeriod } from "./Period";
import { useAtomValue } from "jotai";

const cnColPeriod = "col text-center border-start border-end";
const cnPeriod = " py-2 px-3 ";
const cnTabCur = ' border-3 border-bottom border-primary fw-bold bg-light text-primary';
const cnTab = ' border-1 border-bottom cursor-pointer text-secondary ';
const periodList: [EnumPeriod, string][] = [
    [EnumPeriod.day, '日'],
    [EnumPeriod.week, '周'],
    [EnumPeriod.month, '月'],
    // [EnumPeriod.year, '年', undefined],
];

export function ViewPeriodHeader() {
    let timezone: number = 8;
    let unitBizMonth: number = 6;
    let unitBizDate: number = 1;
    const [period, setPeriod] = usePeriod(timezone, unitBizMonth, unitBizDate);
    let hasNext = useAtomValue(period.hasNext);
    let caption = useAtomValue(period.caption);
    function prev() {
        period.prev();
    }
    function next() {
        if (hasNext) period.next();
    }
    return <>
        <div className="row g-0 tonwa-bg-gray-2 border-top">
            {
                periodList.map(v => {
                    let [ep, title] = v;
                    let cn = cnPeriod + (ep === period.type ? cnTabCur : cnTab);
                    return <div key={title} className={cnColPeriod}
                        onClick={() => setPeriod(ep)}>
                        <div className={cn}>{title}</div>
                    </div>;
                })
            }
        </div>
        <div className="d-flex justify-content-center">
            <div className="cursor-pointer p-3" onClick={prev}>
                <FA name="angle-left" />
            </div>
            <div className="text-center px-1 py-3 w-min-10c">{caption}</div>
            <div className={' p-3 ' + (hasNext ? ' cursor-pointer ' : ' text-light ')} onClick={next}>
                <FA name="angle-right" />
            </div>
        </div>
    </>;
}
