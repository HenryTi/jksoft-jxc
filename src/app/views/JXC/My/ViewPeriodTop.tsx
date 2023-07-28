import { FA, getAtomValue } from "tonwa-com";
import { EnumPeriod, usePeriod } from "./Period";
import { useAtomValue } from "jotai";

const cnColPeriod = "col text-center";
const cnPeriod = " py-2 px-3 ";
const cnTabCur = ' border-2 border-bottom border-primary fw-bold bg-light ';
const cnTab = ' border-bottom border-muted cursor-pointer text-muted ';

export function ViewPeriodTop() {
    let periodType: EnumPeriod = EnumPeriod.week;
    let timezone: number = 8;
    let unitBizMonth: number = 6;
    let unitBizDate: number = 1;
    const [period, setPeriod] = usePeriod(periodType, timezone, unitBizMonth, unitBizDate);
    /*
    const store = useMyPeriodSum();
    const { state, prev, next } = store;
    const { period } = useSnapshot(state);
    const { derived, type, state: periodState } = period;
    const { caption } = useSnapshot(periodState);
    const { hasNext } = useSnapshot(derived);
    */
    let hasNext = useAtomValue(period.hasNext);
    let caption = useAtomValue(period.caption);
    function prev() {
        period.prev();
    }
    function next() {
        period.next();
    }

    const periodList: [EnumPeriod, string, string][] = [
        [EnumPeriod.day, '日', undefined],
        [EnumPeriod.week, '周', undefined],
        [EnumPeriod.month, '月', undefined],
        // [EnumPeriod.year, '年', undefined],
    ];
    for (let p of periodList) {
        let [ep] = p;
        p[2] = cnPeriod + (ep === period.type ? cnTabCur : cnTab);
    }

    return <>
        <div className="row g-0">
            {
                periodList.map(v => {
                    let [ep, title, cn] = v;
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
