import { EntityBook } from "tonwa";
import { useUqApp } from "app/UqApp";
import { useQuery } from "@tanstack/react-query";
import { Route } from "react-router-dom";
import { BudValue, Page, useModal } from "tonwa-app";
import { List, Sep } from "tonwa-com";
import { RegisterOptions } from "react-hook-form";
import { BudEditing, EditBudLabelRow } from "app/hooks";
import { readBuds } from "app/tool";
import { FormBudsStore, ValuesBudsEditing } from "app/Store";

export const pathSiteInit = 'site-init';
export const captionSiteInit = '初始设置';

interface InitValue {
    // bud: BizBud;
    formBudsStore: FormBudsStore;
    budEditing: BudEditing;
    //value: { bud: number; value: BudValue; }
    value: BudValue;
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
    const modal = useModal();
    const { data } = useQuery({
        queryKey: [],
        queryFn: getInit,
        refetchOnWindowFocus: false,
        // UseQueryOptions
    });
    return <Page header={captionSiteInit}>
        <List items={data} ViewItem={ViewAssign} onItemClick={undefined} />
        <Sep />
    </Page>;

    async function getInit() {
        let result = await uq.GetSiteSetting.query({});
        const { buds: budsValues } = readBuds(biz, undefined, result as any);
        const siteSetting = biz.entities['sitesetting'] as EntityBook;
        const { buds } = siteSetting;
        const valuesBudsEditing = new ValuesBudsEditing(biz, buds);
        const formBudsStore = new FormBudsStore(modal, valuesBudsEditing);
        valuesBudsEditing.initBudValues(budsValues);
        const budEditings = valuesBudsEditing.createBudEditings();
        // let ret: InitValue[] = buds.map(v => { // }) initBuds.map(v => {
        let ret: InitValue[] = budEditings.map(v => {
            const { bizBud } = v;
            const { id, name } = bizBud;
            const budPhrase = `${siteSetting.name}.${name}`;
            const options = budOptions[budPhrase];
            const value = budsValues[id];
            // const bud = bizBuds[id];
            const initValue: InitValue = {
                formBudsStore,
                budEditing: v,
                value,
                options,
            };
            return initValue;
        });
        return ret;
    }

    function ViewAssign({ value: item }: { value: InitValue; }) {
        const { value, options, formBudsStore, budEditing } = item;
        let site: number = undefined; // uqApp.uqSites.userSite.siteId;
        // let budEditing = new BudEditing(undefined, bud);
        return <EditBudLabelRow
            id={site}
            formBudsStore={formBudsStore}
            budEditing={budEditing}
            value={value}
            options={options}
        />;
    }
}

export const routeSiteInit = <>
    <Route path={pathSiteInit} element={<PageSiteInit />} />
</>;
