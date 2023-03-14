import { PageReport, PartReport } from "app/template";
import { PageHistory } from "app/template/Report/PageHistory";
import { UqApp } from "app/UqApp";
import { Route, useParams } from "react-router-dom";
import { IDView, Page } from "tonwa-app";
import { dateFromMinuteId, EasyTime, FA, LMR } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { Product, ReturnReportStorage$page } from "uqs/JsTicket";

const pathStorage = 'storage';
const pathStorageHistory = 'storage-history';
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

    readonly ViewItemHistory = ({ value: row }: { value: any }): JSX.Element => {
        const { id, value, ref } = row;
        return <LMR className="px-3 py-2">
            <div className="w-8c me-3 small text-muted"><EasyTime date={dateFromMinuteId(id)} /></div>
            <div>单据明细ID: {ref}</div>
            <div className="d-flex align-items-center">
                <div className="me-4 fs-5">{(value).toFixed(0)}</div>
                <FA name="angle-right" className="text-muted" />
            </div>
        </LMR>
    }

    readonly onHistoryClick = async (item: any) => {
        this.navigate(`../${pathStorageSheet}/${item.ref}`);
    }
}

function PageStorage() {
    return <PageReport Part={PartStorage}></PageReport>
}

function PageStorageHistory() {
    return <PageHistory Part={PartStorage} />
}

function PageSheet() {
    const { id } = useParams();
    return <Page header="单据明细">
        <div className="p-3">单据明细id: {id}</div>
    </Page>
}

export const routeReportStorage = <>
    <Route path={pathStorage} element={<PageStorage />} />
    <Route path={`${pathStorageHistory}/:id`} element={<PageStorageHistory />} />
    <Route path={`${pathStorageSheet}/:id`} element={<PageSheet />} />
</>;
