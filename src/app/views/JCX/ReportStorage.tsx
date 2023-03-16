import { PageReport, PartReport } from "app/template";
import { PageHistory } from "app/template/Report/PageHistory";
import { UqApp, useUqApp } from "app/UqApp";
import { Link, Route, useParams } from "react-router-dom";
import { IDView, Page } from "tonwa-app";
import { dateFromMinuteId, EasyTime, FA, LMR, useEffectOnce } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { EnumID, Product, ReturnReportStorage$page, SheetStoreIn, SheetStoreOut } from "uqs/JsTicket";

const pathStorage = 'storage';
const pathStorageHistory = 'storage-history';
const pathStorageDetail = 'storage-detail';
const pathStorageSheet = 'storage-sheet';

export class PartStorage extends PartReport {
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
        const { product, value, init } = row;
        function ViewProduct({ value: { name, no } }: { value: Product }) {
            return <div>
                <small className="text-muted">{no}</small>
                <div><b>{name}</b></div>
            </div>
        }
        return <LMR className="px-3 py-2 align-items-center">
            <IDView uq={this.uq} id={product} Template={ViewProduct} />
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
    return <PageReport Part={PartStorage}></PageReport>
}

function PageStorageHistory() {
    return <PageHistory Part={PartStorage} />
}

function PageDetail() {
    const uqApp = useUqApp();
    const uq = uqApp.uqs.JsTicket;
    const { id } = useParams();
    function ViewDetail({ value }: { value: any }) {
        return <div>
            Detail: {JSON.stringify(value)}
        </div>
    }
    function ViewDetailOrigin({ value }: { value: any }) {
        return <div>
            DetailOrigin: {JSON.stringify(value)}
        </div>
    }
    function ViewDetailQPA({ value }: { value: any }) {
        return <div>
            DetailQPA: {JSON.stringify(value)}
        </div>
    }
    function DetailTemplate({ value }: { value: any }) {
        let v: JSX.Element;
        switch (value.$entity) {
            case EnumID.Detail: v = <ViewDetail value={value} />; break;
            case EnumID.DetailOrigin: v = <ViewDetailOrigin value={value} />; break;
            case EnumID.DetailQPA: v = <ViewDetailQPA value={value} />; break;
        }
        return <div>
            <Link to={`../${pathStorageSheet}/${value.sheet}`}>
                <div className="px-3 my-3">整单：{value.sheet}</div>
            </Link>
            <div className="px-3 my-3">{v}</div>
        </div>;
    }
    return <Page header="单据明细">
        <IDView uq={uq} id={Number(id)} Template={DetailTemplate} />
    </Page>
}

function PageSheet() {
    const { id } = useParams();
    useEffectOnce(() => {

    });
    return <Page header="整单内容">
        <div className="p-3">整单id: {id}</div>
    </Page>
}

export const routeReportStorage = <>
    <Route path={pathStorage} element={<PageStorage />} />
    <Route path={`${pathStorageHistory}/:id`} element={<PageStorageHistory />} />
    <Route path={`${pathStorageDetail}/:id`} element={<PageDetail />} />
    <Route path={`${pathStorageSheet}/:id`} element={<PageSheet />} />
</>;

function DirStoreIn({ value }: { value: SheetStoreIn; }) {
    return <>入库单 {value.no}</>
}

function DirStoreOut({ value }: { value: SheetStoreOut; }) {
    return <>出库单 {value.no}</>
}

const dirMap: { [entity in EnumID]?: (props: { value: any; }) => JSX.Element } = {
    [EnumID.SheetStoreIn]: DirStoreIn,
    [EnumID.SheetStoreOut]: DirStoreOut,
}

function DetailStoreIn({ value }: { value: SheetStoreIn; }) {
    return <>入库单 Detail {value.no}</>
}

function DetailStoreOut({ value }: { value: SheetStoreOut; }) {
    return <>出库单 Detail {value.no}</>
}

const detailMap: { [entity in EnumID]?: (props: { value: any; }) => JSX.Element } = {
    [EnumID.SheetStoreIn]: DetailStoreIn,
    [EnumID.SheetStoreOut]: DetailStoreOut,
}

function SheetStoreIn({ value }: { value: SheetStoreIn; }) {
    return <>入库单 Sheet {value.no}</>
}

function SheetStoreOut({ value }: { value: SheetStoreOut; }) {
    return <>出库单 Sheet {value.no}</>
}

const sheetMap: { [entity in EnumID]?: (props: { value: any; }) => JSX.Element } = {
    [EnumID.SheetStoreIn]: SheetStoreIn,
    [EnumID.SheetStoreOut]: SheetStoreOut,
}
