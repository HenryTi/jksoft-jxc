import { BizBud, EntityTitle } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { useQuery } from "react-query";
import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { List, Sep } from "tonwa-com";
import { RegisterOptions } from "react-hook-form";
import { BudValue, EditBudLabelRow } from "app/hooks";
import { UseQueryOptions, readBuds } from "app/tool";

export const pathSiteInit = 'site-init';
export const captionSiteInit = '初始设置';

interface InitValue {
    bud: BizBud;
    value: { bud: number; value: BudValue; }
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
        const { buds } = readBuds(undefined, result as any);
        const siteSetting = biz.entities['sitesetting'] as EntityTitle;
        const { buds: bizBuds, props } = siteSetting;

        let ret: InitValue[] = props.map(v => { // }) initBuds.map(v => {
            const { id, name } = v;
            const budPhrase = `${siteSetting.name}.${name}`;
            const options = budOptions[budPhrase];
            const value = buds[id];
            const bud = bizBuds[id];
            return {
                bud,
                value,
                options,
            }
        }) as any;
        return ret;
    }

    function ViewAssign({ value: item }: { value: InitValue; }) {
        const { value, options, bud } = item;
        let site: number = undefined; // uqApp.uqSites.userSite.siteId;
        return <EditBudLabelRow
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
