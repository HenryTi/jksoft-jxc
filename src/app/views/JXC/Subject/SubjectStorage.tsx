import { PageReport, PageHistory } from "app/hooks";
import { pathDetailView } from "../SheetView";
import { GSubject } from "app/tool";
import { EnumSubject } from "uqs/UqDefault";

const subject = EnumSubject.storage;

const props = {
    subject,
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
    name: subject,
    caption: props.caption,
    Report: <PageReportStorage />,
    History: <PageHistoryStorage />,
};
