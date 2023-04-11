import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useNavigate, useParams } from "react-router-dom";
import { GenProps } from "app/tool";
import { GenReport } from "./GenReport";

export function PageHistory({ Gen }: GenProps<GenReport>) {
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const navigate = useNavigate();
    //gen.navigate = navigate;
    const { subjectHistory, ViewItemHistory, captionHistory, historySortField } = gen;
    const { id: paramId } = useParams();
    const param = { atomId: Number(paramId) };
    async function onHistoryClick(item: any) {
        navigate(`../${gen.pathStorageDetail}/${item.ref}`);
    }
    return <PageQueryMore
        header={captionHistory}
        param={param}
        query={subjectHistory}
        ViewItem={ViewItemHistory}
        sortField={historySortField}
        onItemClick={onHistoryClick}>
    </PageQueryMore>;
}
