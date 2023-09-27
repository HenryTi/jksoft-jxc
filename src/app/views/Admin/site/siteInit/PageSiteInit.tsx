import { BizBud, EntityTitle } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useQuery } from "react-query";
import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { List, Sep } from "tonwa-com";
import { RegisterOptions } from "react-hook-form";
import { EditBud } from "app/hooks";
import { UseQueryOptions, readBuds } from "app/tool";
import { BudValue } from "app/hooks/model";

export const pathSiteInit = 'site-init';
export const captionSiteInit = '初始设置';

interface InitValue {
    bud: BizBud;
    value: { bud: number; phrase: string; value: BudValue; }
    options: RegisterOptions;
}

const budCurrency = 'currency';
const budStartSumMonth = 'startsummonth';
const budStartFiscalMonth = 'startfiscalmonth';
const budStartFiscalDay = 'startfiscalday';

const initBuds = [
    budCurrency,
    budStartSumMonth,
    budStartFiscalMonth,
    budStartFiscalDay,
];

const budOptions: { [name: string]: RegisterOptions } = {
    [budCurrency]: {

    },
    [budStartSumMonth]: {
        min: 1,
        max: 12,
    },
    [budStartFiscalMonth]: {
        min: 1,
        max: 12,
    },
    [budStartFiscalDay]: {
        min: 1,
        max: 28,
    }
};

export function PageSiteInit() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { data } = useQuery(
        [],
        getInit,
        UseQueryOptions
    );
    return <Page header={captionSiteInit}>
        <List items={data} ViewItem={ViewAssign} onItemClick={undefined} />
        <Sep />
    </Page>;

    async function getInit() {
        let result = await uq.GetSiteSetting.query({});
        const buds = readBuds(result);
        const siteSetting = biz.entities['sitesetting'] as EntityTitle;
        const { buds: bizBuds } = siteSetting;

        let ret: InitValue[] = initBuds.map(v => {
            const budPhrase = `${siteSetting.name}.${v}`;
            const options = budOptions[budPhrase];
            const value = buds[budPhrase];
            const bud = bizBuds[budPhrase];
            return {
                bud,
                value,
                options,
            }
        });
        return ret;
    }

    function ViewAssign({ value: item }: { value: InitValue; }) {
        const { value, options, bud } = item;
        let site: number = undefined; // uqApp.uqSites.userSite.siteId;
        return <EditBud
            id={site}
            bizBud={bud}
            value={value?.value}
            options={options}
        />;
    }
}

export const routeSiteInit = <>
    <Route path={pathSiteInit} element={<PageSiteInit />} />
</>;
