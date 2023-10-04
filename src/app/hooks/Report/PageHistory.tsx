import { PageQueryMore } from "app/coms";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useReport } from "./useReport";
// import { EnumTitle } from "uqs/UqDefault";

export function PageHistory({ title, bud, captionHistory, pathDetailView, historySortField }: {
    title: string; // EnumTitle;
    bud: string;
    captionHistory: string;
    pathDetailView: string;
    sortField: string;
    historySortField: string;
}) {
    const gen = useReport({ title: title, bud });
    const navigate = useNavigate();
    const { subjectHistory, ViewItemHistory, ViewItem } = gen;
    const { id } = useParams();
    const objId = Number(id);
    const param = { objId };
    const location = useLocation();
    async function onHistoryClick(item: any) {
        navigate(`../${pathDetailView}/${item.ref}`);
    }
    return <PageQueryMore
        header={captionHistory}
        param={param}
        query={subjectHistory}
        ViewItem={ViewItemHistory}
        sortField={historySortField}
        onItemClick={onHistoryClick}>
        <div className="border-bottom tonwa-bg-gray-2 py-2 mb-2">
            <ViewItem value={location.state} clickable={false} />
        </div>
    </PageQueryMore>;
}
