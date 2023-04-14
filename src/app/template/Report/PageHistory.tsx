import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { GenProps } from "app/tool";
import { GenReport } from "./GenReport";

export function PageHistory({ Gen }: GenProps<GenReport>) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const navigate = useNavigate();
    const { subjectHistory, ViewItemHistory, captionHistory, historySortField, pathDetailView, ViewItem } = gen;
    const { id } = useParams();
    const atomId = Number(id);
    const param = { atomId };
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
