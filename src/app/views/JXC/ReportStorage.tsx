import { PageReport, GenReport } from "app/template";
import { PageHistory } from "app/template/Report/PageHistory";
import { UqApp, useUqApp } from "app/UqApp";
import React, { useState } from "react";
import { Link, Route, useParams } from "react-router-dom";
import { IDView, Page, PageSpinner } from "tonwa-app";
import { dateFromMinuteId, EasyTime, FA, List, LMR, Sep, useEffectOnce } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { EnumID, Atom, ReturnReportStorage$page, Sheet } from "uqs/UqDefault";

const pathStorage = 'storage';
const pathStorageHistory = 'storage-history';
const pathStorageDetail = 'storage-detail';
const pathStorageSheet = 'storage-sheet';

export class GenStorage extends GenReport {
    readonly bizEntityName = 'storage';
    readonly bizEntityType = 'subject';
    readonly caption = '库存报表';
    readonly path = pathStorage;
    readonly pathStorageHistory = pathStorageHistory;
    readonly pathStorageDetail = pathStorageDetail;
    readonly pathStorageSheet = pathStorageSheet;
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
        const { atom, value, init } = row;
        function ViewProduct({ value: { ex, no } }: { value: Atom }) {
            return <div>
                <small className="text-muted">{no}</small>
                <div><b>{ex}</b></div>
            </div>
        }
        return <LMR className="px-3 py-2 align-items-center">
            <IDView uq={this.uq} id={atom} Template={ViewProduct} />
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value + init).toFixed(0)}</div>
                <FA name="angle-right" className="text-muted" />
            </div>
        </LMR>;
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
        let sheet = value.base;
        return <div>
            <Link to={`../${pathStorageSheet}/${sheet}`}>
                <div className="px-3 my-3">整单：{sheet}</div>
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
    const [sheetDetails, setSheetDetails] = useState<any[]>(undefined);
    useEffectOnce(() => {
        (async function () {
            let { main: [retSheetMain], details: retDetails } = await uq.GetSheet.query({ id: Number(id), assigns: undefined });
            setSheetMain(retSheetMain);
            setSheetDetails(retDetails);
        })();
    });
    function ViewItem({ value }: { value: any }) {
        return <div className="px-3 my-2">
            {JSON.stringify(value)}
        </div>;
    }
    let content: any;
    if (!sheetMain || !sheetDetails) {
        content = <PageSpinner />;
    }
    else {
        content = <>
            <div className="px-3 my-2">
                main: {JSON.stringify(sheetMain)}
            </div>
            <List items={sheetDetails} ViewItem={ViewItem} />
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

enum SheetType {
    StoreIn,
    StoreOut,
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

const detailMap: { [entity in SheetType]?: (props: { value: any; }) => JSX.Element } = {
    [SheetType.StoreIn]: DetailStoreIn,
    [SheetType.StoreOut]: DetailStoreOut,
}

function SheetStoreIn({ value }: { value: Sheet; }) {
    return <>入库单 Sheet {value.no}</>
}

function SheetStoreOut({ value }: { value: Sheet; }) {
    return <>出库单 Sheet {value.no}</>
}

const sheetMap: { [entity in SheetType]?: (props: { value: any; }) => JSX.Element } = {
    [SheetType.StoreIn]: SheetStoreIn,
    [SheetType.StoreOut]: SheetStoreOut,
}
