import { PageReport, GenSubject, PageHistory } from "app/hooks";
import { Route } from "react-router-dom";
import { pathDetailView } from "../SheetView";

const pathStorage = 'storage';
const pathStorageHistory = 'storage-history';

export class GenSubjectStorage extends GenSubject {
    readonly bizEntityName = 'storage';
    // readonly bizEntityType = 'subject';
    readonly captionHistory = '库存流水';
    readonly path = pathStorage;
    readonly pathStorageHistory = pathStorageHistory;
    readonly pathDetailView = pathDetailView;
}

export const routeReportStorage = <>
    <Route path={pathStorage} element={<PageReport Gen={GenSubjectStorage}></PageReport>} />
    <Route path={`${pathStorageHistory}/:id`} element={<PageHistory Gen={GenSubjectStorage} />} />
</>;
