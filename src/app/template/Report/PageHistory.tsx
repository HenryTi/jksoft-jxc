import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate, useParams } from "react-router-dom";
import { PartProps } from "../Part";
import { PartReport } from "./PartReport";

export function PageHistory({ Part }: PartProps<PartReport>) {
    const uqApp = useUqApp();
    const part = uqApp.partOf(Part);
    const navigate = useNavigate();
    part.navigate = navigate;
    const { QueryHistory, ViewItemHistory, captionHistory, historySortField, onHistoryClick } = part;
    const { id: paramId } = useParams();
    const param = { project: Number(paramId) };
    return <PageQueryMore
        header={captionHistory}
        param={param}
        query={QueryHistory}
        ViewItem={ViewItemHistory}
        sortField={historySortField}
        onItemClick={onHistoryClick}>
    </PageQueryMore>;
}
