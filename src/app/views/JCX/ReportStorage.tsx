import { PageReport, GenReport } from "app/template";
import { PageHistory } from "app/template/Report/PageHistory";
import { UqApp, useUqApp } from "app/UqApp";
import React, { useState } from "react";
import { Link, Route, useParams } from "react-router-dom";
import { IDView, Page, PageSpinner } from "tonwa-app";
import { dateFromMinuteId, EasyTime, FA, List, LMR, Sep, useEffectOnce } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { EnumID, Item, ReturnReportStorage$page, Sheet, SheetType } from "uqs/UqDefault";

const pathStorage = 'storage';
const pathStorageHistory = 'storage-history';
const pathStorageDetail = 'storage-detail';
const pathStorageSheet = 'storage-sheet';

export class GenStorage extends GenReport {
    readonly caption = '库存报表';
    readonly path = pathStorage;
    readonly sortField: string;
    readonly QueryReport: UqQuery<any, any>;
    readonly QueryHistory: UqQuery<any, any>;
    readonly captionHistory = '库存流水';
    readonly historySortField: string;

    constructor(uqApp: UqApp) {
        super(uqApp);

        this.QueryReport = this.uq.ReportStorage;
        this.sortField = 'product';
        this.QueryHistory = this.uq.HistoryStorage;
        this.historySortField = 'id';
    }

    readonly ViewItem = ({ value: row }: { value: ReturnReportStorage$page; }): JSX.Element => {
        const { item, value, init } = row;
        function ViewProduct({ value: { ex, no } }: { value: Item }) {
            return <div>
                <small className="text-muted">{no}</small>
                <div><b>{ex}</b></div>
            </div>
        }
        return <LMR className="px-3 py-2 align-items-center">
            <IDView uq={this.uq} id={item} Template={ViewProduct} />
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value + init).toFixed(0)}</div>
                <FA name="angle-right" className="text-muted" />
            </div>
        </LMR>;
    }

    readonly onItemClick = async (item: any): Promise<void> => {
        this.navigate(`../${pathStorageHistory}/${item.product}`);
    }

    readonly DetailRef = ({ value }: { value: any }) => {
        return <>
            <IDView uq={this.uq} id={value.sheet} Template={this.SheetRef} />
            &nbsp;
            <small>{value.id}</small>
        </>;
    }
    readonly SheetRef = ({ value }: { value: any }) => {
        const { $entity, no } = value;
        let Template = dirMap[$entity as EnumID];
        return <Template value={value} />;
    }
    readonly ViewItemHistory = ({ value: row }: { value: any }): JSX.Element => {
        const { id, value, ref } = row;
        return <LMR className="px-3 py-2">
            <div className="w-8c me-3 small text-muted"><EasyTime date={dateFromMinuteId(id)} /></div>
            <div><IDView uq={this.uq} id={ref} Template={this.DetailRef} /></div>
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value).toFixed(0)}</div>
                <FA name="angle-right" className="text-muted" />
            </div>
        </LMR>
    }

    readonly onHistoryClick = async (item: any) => {
        this.navigate(`../${pathStorageDetail}/${item.ref}`);
    }
}

function PageStorage() {
    return <PageReport Gen={GenStorage}></PageReport>
}

function PageStorageHistory() {
    return <PageHistory Gen={GenStorage} />
}

function PageDetail() {
    const uqApp = useUqApp();
    const uq = uqApp.uqs.UqDefault;
    const { id } = useParams();
    function ViewDetail({ value }: { value: any }) {
        return <div>
            Detail: {JSON.stringify(value)}
        </div>
    }
    function DetailTemplate({ value }: { value: any }) {
        return <div>
            <Link to={`../${pathStorageSheet}/${value.sheet}`}>
                <div className="px-3 my-3">整单：{value.sheet}</div>
            </Link>
            <div className="px-3 my-3"><ViewDetail value={value} /></div>
        </div>;
    }
    return <Page header="单据明细">
        <IDView uq={uq} id={Number(id)} Template={DetailTemplate} />
    </Page>
}

function PageSheet() {
    const uqApp = useUqApp();
    const uq = uqApp.uqs.UqDefault;
    const { id } = useParams();
    const [sheetMain, setSheetMain] = useState(undefined);
    const [sheetJoins, setSheetJoins] = useState<[string, any[]][]>(undefined);
    useEffectOnce(() => {
        (async function () {
            let { ID, main, joins } = await uq.idJoins(Number(id));
            setSheetMain(main);
            setSheetJoins(joins);
        })();
    });
    let content: any;
    if (!sheetMain || !sheetJoins) {
        content = <PageSpinner />;
    }
    else {
        let [sheetType, main] = sheetMain;
        let viewJoins = sheetJoins.map(v => {
            let [detailType, details] = v;
            function ViewItem({ value }: { value: any }) {
                return <div className="px-3 my-2">
                    {JSON.stringify(value)}
                </div>;
            }
            return <React.Fragment key={detailType}>
                <Sep />
                <List items={details} ViewItem={ViewItem} />
                <Sep />
            </React.Fragment>;
        });
        let Dir = dirMap[sheetType as EnumID];
        content = <>
            <div className="px-3 my-2"><Dir value={main} /></div>
            {viewJoins}
        </>;
    }

    return <Page header="整单内容">
        {content}
    </Page>
}

export const routeReportStorage = <>
    <Route path={pathStorage} element={<PageStorage />} />
    <Route path={`${pathStorageHistory}/:id`} element={<PageStorageHistory />} />
    <Route path={`${pathStorageDetail}/:id`} element={<PageDetail />} />
    <Route path={`${pathStorageSheet}/:id`} element={<PageSheet />} />
</>;

function DirStoreIn({ value }: { value: Sheet; }) {
    return <>
        <span className="text-danger">入库单</span> &nbsp;
        <b>{value.no}</b> &nbsp;
        <small className="text-muted">{value.id}</small> &nbsp;
    </>;
}

function DirStoreOut({ value }: { value: Sheet; }) {
    return <>
        <span className="text-success">出库单</span> &nbsp;
        <b>{value.no}</b> &nbsp;
        <small className="text-muted">{value.id}</small> &nbsp;
    </>;
}

const dirMap: { [sheet: string]: (props: { value: any; }) => JSX.Element } = {
    [SheetType.StoreIn]: DirStoreIn,
    [SheetType.StoreOut]: DirStoreOut,
}

function DetailStoreIn({ value }: { value: Sheet; }) {
    return <>入库单 Detail {value.no}</>
}

function DetailStoreOut({ value }: { value: Sheet; }) {
    return <>出库单 Detail {value.no}</>
}

const detailMap: { [entity in EnumID]?: (props: { value: any; }) => JSX.Element } = {
    [SheetType.StoreIn]: DetailStoreIn,
    [SheetType.StoreOut]: DetailStoreOut,
}

function SheetStoreIn({ value }: { value: Sheet; }) {
    return <>入库单 Sheet {value.no}</>
}

function SheetStoreOut({ value }: { value: Sheet; }) {
    return <>出库单 Sheet {value.no}</>
}

const sheetMap: { [entity in EnumID]?: (props: { value: any; }) => JSX.Element } = {
    [SheetType.StoreIn]: SheetStoreIn,
    [SheetType.StoreOut]: SheetStoreOut,
}
