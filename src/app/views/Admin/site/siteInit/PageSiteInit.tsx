import { EntitySubject } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { BI } from "app/coms";
import { useAsyncPage } from "app/tool";
import { Route } from "react-router-dom";
import { Page } from "tonwa-app";
import { List, wait } from "tonwa-com";

export const pathSiteInit = 'site-init';
export const captionSiteInit = '初始设置';

interface InitItem {
    budName: string;
    value: number;
}

const initItems = [
    'currency',
    'startsummonth',
    'startfiscalmonth',
    'startfiscalday',
].map(v => 'subject.init.' + v);

const inits: InitItem[] = [
    { budName: 'subject.init.currency', value: 0 },
    { budName: 'subject.init.startsummonth', value: 0 },
    { budName: 'subject.init.startfiscalmonth', value: 0 },
    { budName: 'subject.init.startfiscalday', value: 0 },
];

const cnCol = ' py-3 ';

export async function ModalSiteInit() {
    await wait(1000);
    return <PageSiteInit />;
}

export function PageSiteInit() {
    const { uq } = useUqApp();
    let ret = useAsyncPage<any>((async () => {
        let { budsInt, budsDec, budsStr } = await uq.GetInit.query({});
        let ret: { [phrase: string]: number | string } = {};
        [budsInt, budsDec, budsStr].forEach(v => {
            for (let { phrase, value } of v) {
                ret[phrase] = value;
            }
        });
        return ret;
    }), PageView);
    return ret;
}

function PageView({ result }: { result: { [phrase: string]: number | string }; }) {
    const { biz } = useUqApp();
    const subjectInit = biz.entities['init'] as EntitySubject;
    const { buds } = subjectInit;
    function ViewAssign({ value: { budName, value } }: { value: InitItem }) {
        const bud = buds[budName];
        if (bud === undefined) {
            return <div key={budName}>unknown {budName}</div>;
        }
        const { name, caption } = bud;
        return <div key={budName} className="row">
            <div className={'col-6' + cnCol}>{caption ?? name}</div>
            <div className={'col-3' + cnCol}>{value ?? '值'}</div>
            <div className={'col-3 text-end' + cnCol}>
                <BI name="chevron-right" />
            </div>
        </div>
    }
    function onItemClick(item: InitItem) {
        const { budName, value } = item;
        alert(budName);
    }
    let inits = initItems.map(v => ({ budName: v, value: 0 }))
    return <Page header={captionSiteInit}>
        <div>{JSON.stringify(result)}</div>
        <div className="container">
            <List items={inits} ViewItem={ViewAssign} onItemClick={onItemClick} />
        </div>
    </Page>;
}

export const routeSiteInit = <>
    <Route path={pathSiteInit} element={<PageSiteInit />} />
</>;
