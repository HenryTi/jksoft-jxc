import { UqApp, useUqApp } from "app/UqApp";
import { BI, PageQueryMore, ViceTitle } from "app/coms";
import { Link, Route } from "react-router-dom";
import { EnumAtom, Sheet } from "uqs/UqDefault";
import { gPurchase } from "./Purchase";
import { IDView } from "tonwa-app";
import { gStoreOut } from "./StoreOut";
import { GSheet, SheetRow } from "app/tool";
import { EntitySheet } from "app/Biz";
import { gSale } from "./Sale";
// import { gStoreInSplit } from "./StoreInSplitHook";
import { gStoreIn } from "./StoreInHook";
import { ViewAtom } from "app/hooks";
import { List } from "tonwa-com";
import { useDetailQPA } from "./Detail";
import { PageSheetAct, useSelectAtom } from "app/hooks";
import { PageEdit } from "./Sheet";

const gSheets: GSheet[][] = [
    [
        gPurchase,
        gStoreIn,
        //        gStoreInSplit,
    ],
    [
        gSale,
        gStoreOut,
    ],
];

function PageSheetCenter() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const sheetEntities = biz.sheetEntities();
    const gCollName: { [name: string]: GSheet } = {};
    const gCollPhrase: { [name: string]: GSheet } = {};
    for (let gSheetArr of gSheets) {
        for (let gSheet of gSheetArr) {
            const { sheet: name } = gSheet;
            let entity = biz.entities[name] as EntitySheet;
            gCollName[name] = gSheet;
            gCollPhrase[entity.phrase] = gSheet;
        }
    }

    async function query(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await uq.GetMyDrafts.page(param, pageStart, pageSize);
        return ret.$page;
    }
    function ViewItem({ value }: { value: Sheet & { phrase: string; } }) {
        const { id, no, phrase, target, operator } = value;
        let g = gCollPhrase[phrase];
        function LinkSheet({ path, caption }: { path: string; caption: string; }) {
            return <Link to={`../${path}/${id}`}>
                <div className="px-3 py-2 d-flex">
                    <div className="w-10c me-3">
                        <div>{caption}</div>
                        <div className="small text-muted">{no}</div>
                    </div>
                    <IDView id={target} uq={uq} Template={ViewAtom} />
                </div>
            </Link>;
        }
        if (g === undefined) {
            return <div>error: phrase not defined</div>;
        }
        const { sheet, entitySheet } = g;
        return <LinkSheet path={sheet} caption={entitySheet.caption ?? entitySheet.name} />;
    }
    function Top({ items }: { items: any[] }) {
        if (!items) return null;
        if (items.length === 0) return null;
        return <ViceTitle>录入中的单据</ViceTitle>;
    }
    function ViewSheetItem({ value }: { value: EntitySheet; }) {
        let { caption, name } = value;
        return <Link
            to={`/sheet/${name}`}
        >
            <div className="px-3 py-2 align-items-center d-flex">
                <BI name="card-list" className="fs-larger me-3 text-primary" />
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>
    }
    return <PageQueryMore header="单据中心"
        param={{}}
        sortField={'id'}
        query={query}
        ViewItem={ViewItem}
        Top={Top}
    >
        <List items={sheetEntities} ViewItem={ViewSheetItem} />
    </PageQueryMore>;
}


export const pathSheetCenter = 'sheet-center';
// {routeAtom(uqApp, gAtom)}
export function routeSheetCenter(uqApp: UqApp) {
    return <>
        <Route path={pathSheetCenter} element={<PageSheetCenter />} />
        <Route path={'sheet/:sheet/:id'} element={<PageEdit />} />
        <Route path={'sheet/:sheet'} element={<PageEdit />} />
    </>;
}

// export const pathSheetCenter = 'sheet-center';

//{routeSheetPurchase(uqApp)}
// {routeSheetSale(uqApp)}
// {routeSheetStoreIn(uqApp)}
// {routeSheetStoreOut(uqApp)}
// export function routeSheetCenter(uqApp: UqApp) {
//    return <Route path={pathSheetCenter} element={<PageCenter />} />
// }
