import { Link, Route } from "react-router-dom";
import { IDView } from "tonwa-app";
import { PageQueryMore, ViceTitle } from "app/coms";
import { GenSheet, ViewItemID } from "app/template";
import { UqApp, useUqApp } from "app/UqApp";
import { GenPurchase } from "./SheetPurchase";
import { GenSale } from "./SheetSale";
import { GenStoreOut } from "./SheetStoreOut";
import { GenStoreIn } from "./SheetStoreIn";
import { Sheet } from "uqs/UqDefault";

export const pathSheetCenter = 'sheet-center';
const GenArr: (new (uqApp: UqApp) => GenSheet)[] = [
    GenPurchase,
    GenStoreIn,
    GenSale,
    GenStoreOut,
];
export function PageSheetCenter() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const genColl: { [entity: string]: GenSheet } = {};
    const genArr = GenArr.map(v => {
        const gen = uqApp.objectOf(v);
        const { typePhrase } = gen;
        genColl[typePhrase] = gen;
        return gen;
    });
    async function query(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await uq.GetMyDrafts.page(param, pageStart, pageSize);
        return ret.$page;
    }
    function ViewItem({ value }: { value: Sheet & { phrase: string; } }) {
        const { id, no, phrase, item, operator } = value;
        let gen = genColl[phrase];
        let { caption, path } = gen;
        return <Link to={`../${path}/${id}`}>
            <div className="px-3 py-2 d-flex">
                <div className="w-10c me-3">
                    <div>{caption}</div>
                    <div className="small text-muted">{no}</div>
                </div>
                <IDView id={item} uq={uq} Template={ViewItemID} />
            </div>
        </Link>;
    }
    function Top({ items }: { items: any[] }) {
        if (!items) return null;
        if (items.length === 0) return null;
        return <ViceTitle>录入中的单据</ViceTitle>;
    }
    return <PageQueryMore header={'单据中心'}
        param={{}}
        sortField={'id'}
        query={query}
        pageSize={15}
        pageMoreSize={5}
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
            })}
        </div>
    </PageQueryMore>;
}

export const routeSheetCenter = <Route path={pathSheetCenter} element={<PageSheetCenter />} />;
