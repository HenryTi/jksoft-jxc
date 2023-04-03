import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate, useParams } from "react-router-dom";
import { GenProps } from "app/tool";
import { GenReport } from "./GenReport";

export function PageHistory({ Gen }: GenProps<GenReport>) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const navigate = useNavigate();
    gen.navigate = navigate;
    const { QueryHistory, ViewItemHistory, captionHistory, historySortField, onHistoryClick } = gen;
    const { id: paramId } = useParams();
    const param = { item: Number(paramId) };
    return <PageQueryMore
        header={captionHistory}
        param={param}
        query={QueryHistory}
        ViewItem={ViewItemHistory}
        sortField={historySortField}
        onItemClick={onHistoryClick}>
    </PageQueryMore>;
}
