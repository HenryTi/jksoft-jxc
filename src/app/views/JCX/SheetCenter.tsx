import { Link, Route } from "react-router-dom";
import { IDView } from "tonwa-app";
import { PageQueryMore, ViceTitle } from "app/coms";
import { PartSheet, ViewItemID } from "app/template";
import { UqApp, useUqApp } from "app/UqApp";
import { SheetPartPurchase } from "./SheetPurchase";
import { PartSheetSale } from "./SheetSale";
import { SheetPartStoreOut } from "./SheetStoreOut";
import { SheetPartStoreIn } from "./SheetStoreIn";
import { Sheet } from "uqs/UqDefault";

export const pathSheetCenter = 'sheet-center';
const PartArr: (new (uqApp: UqApp) => PartSheet)[] = [
    SheetPartPurchase,
    SheetPartStoreIn,
    PartSheetSale,
    SheetPartStoreOut,
];
export function PageSheetCenter() {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const partColl: { [entity: string]: PartSheet } = {};
    const partArr = PartArr.map(v => {
        const part = uqApp.objectOf(v);
        const { sheetType } = part;
        partColl[sheetType] = part;
        return part;
    });
    async function query(param: any, pageStart: any, pageSize: number): Promise<any[]> {
        let ret = await uq.GetMySheets.page(param, pageStart, pageSize);
        return ret.$page;
    }
    function ViewItem({ value }: { value: Sheet & { type: string; } }) {
        const { id, no, type, ex, item, operator } = value;
        let part = partColl[type];
        let { caption, path } = part;
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
            {partArr.map((v, index) => {
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
