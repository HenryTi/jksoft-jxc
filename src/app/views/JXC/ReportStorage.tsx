import { PageReport, GenReport, PageHistory } from "app/template";
import { Route } from "react-router-dom";

const pathStorage = 'storage';
const pathStorageHistory = 'storage-history';

export class GenStorage extends GenReport {
    readonly bizEntityName = 'storage';
    readonly bizEntityType = 'subject';
    readonly caption = '库存报表';
    readonly captionHistory = '库存流水';
    readonly path = pathStorage;
    readonly pathStorageHistory = pathStorageHistory;
}

export const routeReportStorage = <>
    <Route path={pathStorage} element={<PageReport Gen={GenStorage}></PageReport>} />
    <Route path={`${pathStorageHistory}/:id`} element={<PageHistory Gen={GenStorage} />} />
</>;
