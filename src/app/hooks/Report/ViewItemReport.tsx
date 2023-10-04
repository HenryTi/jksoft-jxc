import { EntityReport, ReportList } from "app/Biz";
import { Link } from "react-router-dom";
import { List } from "tonwa-com";
import { pathReportList } from "./useReport";

export function ViewItemReport({ value }: { value: EntityReport }) {
    const { id, caption, name, lists } = value;

    function ViewItem({ value }: { value: ReportList }) {
        const { id: listId, name, caption, entity } = value;
        let to = pathReportList(id, listId);
        return <Link to={`../${to}`}>
            <div className="px-3 py-3 m-3 border rounded-3 h-min-5c w-16c w-max-16c bg-white">
                {caption ?? name}
            </div>
        </Link>;
    }

    return <div className="tonwa-bg-gray-1 ">
        <div className="tonwa-bg-gray-2 pt-2 pb-2 px-3 small text-secondary">{caption ?? name}</div>
        <List items={lists} ViewItem={ViewItem} className="d-flex flex-wrap " />
    </div>;
}
