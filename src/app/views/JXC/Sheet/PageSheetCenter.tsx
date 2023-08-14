import { useUqApp } from "app/UqApp";
import { PageQueryMore, ViceTitle } from "app/coms";
import { Link } from "react-router-dom";
import { Sheet } from "uqs/UqDefault";
import { gPurchase } from "./Purchase";
import { IDView } from "tonwa-app";
import { gStoreOut } from "./StoreOut";
import { GSheet } from "app/tool";
import { EntitySheet } from "app/Biz";
import { gSale } from "./Sale";
import { gStoreInSplit } from "./StoreInSplitHook";
import { gStoreIn } from "./StoreInHook";
import { ViewAtom } from "../../ViewAtom";

const gSheets: GSheet[][] = [
    [
        gPurchase,
        gStoreIn,
        gStoreInSplit,
    ],
    [
        gSale,
        gStoreOut,
    ],
];

export function PageSheetCenter() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
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
        const { sheet: name, caption } = g;
        let entity = biz.entities[name] as EntitySheet;
        return <LinkSheet path={name} caption={caption ?? entity.caption} />;
    }
    function Top({ items }: { items: any[] }) {
        if (!items) return null;
        if (items.length === 0) return null;
        return <ViceTitle>录入中的单据</ViceTitle>;
    }
    return <PageQueryMore header="单据中心"
        param={{}}
        sortField={'id'}
        query={query}
        ViewItem={ViewItem}
        Top={Top}
    >
        {
            gSheets.map((arr, index) => {
                return <div key={index} className="px-3 py-2 border-bottom d-flex flex-wrap p-2">
                    {
                        arr.map((v, index) => {
                            let { caption, sheet: name } = v;
                            return <Link key={index}
                                to={`../${name}`}
                                className="px-3 px-2 btn btn-outline-primary m-2"
                            >
                                {caption}
                            </Link>
                        })
                    }
                </div>
            })
        }
    </PageQueryMore>;
}

// export const pathSheetCenter = 'sheet-center';

//{routeSheetPurchase(uqApp)}
// {routeSheetSale(uqApp)}
// {routeSheetStoreIn(uqApp)}
// {routeSheetStoreOut(uqApp)}
// export function routeSheetCenter(uqApp: UqApp) {
//    return <Route path={pathSheetCenter} element={<PageCenter />} />
// }
