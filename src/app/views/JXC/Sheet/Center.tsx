import { UqApp, useUqApp } from "app/UqApp";
import { PageQueryMore, ViceTitle } from "app/coms";
import { GenSheetAct } from "app/template/Sheet";
import { Link, Route } from "react-router-dom";
import { Sheet } from "uqs/UqDefault";
import { GenPurchaseAct } from "./Purchase";
import { GenStoreInAct, GenStoreInMultiStorageAct } from "./StoreIn";
import { routeSheetPurchase } from "./Purchase";
import { routeSheetStoreIn } from "./StoreIn";
import { IDView } from "tonwa-app";
import { ViewItemID } from "app/template";
import { GenSaleAct, routeSheetSale } from "./Sale";
import { GenStoreOutAct, routeSheetStoreOut } from "./StoreOut";

const GenArr: (new (uqApp: UqApp) => GenSheetAct)[] = [
    GenPurchaseAct,
    GenStoreInAct,
    GenStoreInMultiStorageAct,
    GenSaleAct,
    GenStoreOutAct,
];

function PageCenter() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const genColl: { [entity: string]: GenSheetAct } = {};
    const genArr = GenArr.map(v => {
        const gen = uqApp.objectOf(v);
        const { phrase } = gen;
        genColl[phrase] = gen;
        return gen;
    });

    async function query(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await uq.GetMyDrafts.page(param, pageStart, pageSize);
        return ret.$page;
    }
    function ViewItem({ value }: { value: Sheet & { phrase: string; } }) {
        const { id, no, phrase, target, operator } = value;
        let gen = genColl[phrase];
        let caption: string, path: string;
        if (gen === undefined) {
            debugger;
        }
        else {
            caption = gen.caption;
            path = gen.path;
        }
        return <Link to={`../${path}/${id}`}>
            <div className="px-3 py-2 d-flex">
                <div className="w-10c me-3">
                    <div>{caption}</div>
                    <div className="small text-muted">{no}</div>
                </div>
                <IDView id={target} uq={uq} Template={ViewItemID} />
            </div>
        </Link>;
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
        <div className="px-3 py-2 border-bottom d-flex flex-wrap p-2">
            {genArr.map((v, index) => {
                let { caption, path } = v;
                return <Link key={index}
                    to={`../${path}`}
                    className="px-3 px-2 btn btn-outline-primary m-2"
                >
                    {caption}
                </Link>
            })
            }
        </div>
    </PageQueryMore>;
}

export const pathSheetCenter = 'sheet-center';

export function routeSheet(uqApp: UqApp) {
    return <>
        <Route path={pathSheetCenter} element={<PageCenter />} />
        {routeSheetPurchase(uqApp)}
        {routeSheetStoreIn(uqApp)}
        {routeSheetSale(uqApp)}
        {routeSheetStoreOut(uqApp)}
    </>;
}
