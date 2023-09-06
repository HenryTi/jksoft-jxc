import { BizBud, EntitySubject } from "app/Biz";
import { UqApp, useUqApp } from "app/UqApp";
import { useQuery } from "react-query";
import { Route } from "react-router-dom";
import { LabelRowEdit, Page } from "tonwa-app";
import { List, Sep } from "tonwa-com";
import { RegisterOptions, useForm } from "react-hook-form";
import { usePickValueFromBud } from "app/hooks";
import { UseQueryOptions } from "app/tool";

export const pathSiteInit = 'site-init';
export const captionSiteInit = '初始设置';

interface InitValue {
    bud: BizBud;
    value: number | string;
    options: RegisterOptions;
    // atomValue?: WritableAtom<number | string, any, any>;
    // pickValue: (props: PickProps) => Promise<string | number>;
    // ValueTemplate: (props: { value: any; onValueChanged?: OnValueChanged; }) => JSX.Element;
}

const prefix = 'moniker.init.';

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
        let { budsInt, budsDec, budsStr } = await uq.GetInit.query({});
        const subjectInit = biz.entities['init'] as EntitySubject;
        const { buds } = subjectInit;
        let coll: { [phrase: string]: string | number; } = {};
        [budsInt, budsDec, budsStr].forEach(v => {
            for (let { phrase, value } of v) {
                coll[phrase] = value;
            }
        });

        let ret: InitValue[] = initBuds.map(v => {
            const name = prefix + v;
            const options = budOptions[v];
            const value = coll[name];
            const bud = buds[name];
            return {
                bud,
                value,
                options,
            }
        });
        return ret;
    }

    function ViewAssign({ value: item }: { value: InitValue; }) {
        const { bud, value, options } = item;
        const { name, caption } = bud;
        const pickValueFromBud = usePickValueFromBud();
        const { pickValue, ValueTemplate } = pickValueFromBud(bud, options);
        return <LabelRowEdit
            label={caption ?? name}
            value={value}
            type={bud.budDataType.dataType}
            onValueChanged={onValueChanged}
            pickValue={pickValue}
            options={{ ...options, value }}
            ValueTemplate={ValueTemplate} />
        async function onValueChanged(value: string | number): Promise<void> {
            let int: number;
            let dec: number;
            let str: string;
            let site = uqApp.uqSites.userSite.siteId;
            switch (bud.budDataType.type) {
                default:
                case 'int': int = value as any; break;
                case 'dec': dec = value as any; break;
                case 'char':
                case 'str': int = value as any; break;
            }
            await uq.SaveBud.submit({
                phrase: bud.phrase,
                id: site,
                int,
                dec,
                str,
            });
        }
    }
}

export const routeSiteInit = <>
    <Route path={pathSiteInit} element={<PageSiteInit />} />
</>;
