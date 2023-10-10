import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { ViewPeriodHeader } from "./ViewPeriodHeader";
import { ViewBalances } from "./ViewBalances";
import { useUqApp } from "app/UqApp";
import { List, getAtomValue, useEffectOnce } from "tonwa-com";
import { useState } from "react";
import { ReturnGetMyBalanceRet, ReturnGetMySumsRet } from "uqs/UqDefault";
import { Period, usePeriod } from "./Period";
import { pathMy } from "app/views/pathes";

export function PageMy() {
    const { uq } = useUqApp();
    let timezone: number = 8;
    let unitBizMonth: number = 6;
    let unitBizDate: number = 1;
    const [period, setEnumPeriod] = usePeriod(timezone, unitBizMonth, unitBizDate, onChanged);
    const [balances, setBalances] = useState<ReturnGetMyBalanceRet[]>(undefined);
    const [sums, setSums] = useState<ReturnGetMySumsRet[]>(undefined);
    async function loadSums(period: Period) {
        let { from, to } = getAtomValue(period.state);
        let param = { start: from, end: to };
        let { ret } = await uq.GetMySums.query(param);
        setSums(ret);
    }
    async function loadBalances() {
        let { ret } = await uq.GetMyBalance.query({});
        setBalances(ret);
    }
    useEffectOnce(() => {
        (async () => {
            await Promise.all([
                loadSums(period),
                loadBalances(),
            ]);
        })();
    })
    async function onChanged(period: Period) {
        await loadSums(period);
    }
    /*
    const setEnumPeriod = useCallback(async function (enumPeriod: EnumPeriod) {
        let newPeriod = setPeriod(enumPeriod);
        await loadSums(newPeriod);
    }, []);
    */
    let vBalances: any;
    if (balances !== undefined) {
        vBalances = <ViewBalances balances={balances} />;
    }
    return <Page header="我的">
        <div className="d-flex flex-wrap p-2 justify-content-center">
            {vBalances}
        </div>
        <ViewPeriodHeader period={period} setEnumPeriod={setEnumPeriod} />
        <List items={sums} />
    </Page>;
}

export const routeMy = <Route path={pathMy} element={<PageMy />} />;
