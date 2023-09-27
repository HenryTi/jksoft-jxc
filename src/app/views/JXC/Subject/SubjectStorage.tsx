import { PageReport, PageHistory } from "app/hooks";
import { pathDetailView } from "../SheetView";
import { GSubject } from "app/tool";
// import { EnumTitle } from "uqs/UqDefault";

const title = 'storage';

const props = {
    title,
    bud: 'goodsBalance',
    caption: '库存',
    captionHistory: '库存流水',
    pathDetailView,
    sortField: 'atom',
    historySortField: 'id',
}

function PageReportStorage() {
    return <PageReport {...props} />;
}

function PageHistoryStorage() {
    return <PageHistory {...props} />;
}

export const gSubjectStorage: GSubject = {
    name: title,
    caption: props.caption,
    Report: <PageReportStorage />,
    History: <PageHistoryStorage />,
};
