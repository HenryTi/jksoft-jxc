import { PageQueryMore } from "app/coms";
import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { PageSheetSearch } from "./PageSheetSearch";
import { ViewSheetItem } from "./ViewSheetItem";
import { DashConsole } from "./DashConsole";

export function PageSheetList({ dashConsole }: { dashConsole: DashConsole; }) {
    const { entitySheet, myArchiveList } = dashConsole;
    const { caption, uq, id } = entitySheet;
    const modal = useModal();
    let to = new Date();
    to.setDate(to.getDate() + 2);
    let from = new Date();
    from.setDate(from.getDate() - 31);
    const param = {
        phrase: id,
        from,
        to,
        timeZone: 8,
    }
    async function onSearch() {
        modal.open(<PageSheetSearch sheetConsole={dashConsole} />);
    }
    let right = <button className="btn btn-sm btn-success me-2" onClick={onSearch}>
        <FA name="search" />
    </button>;
    function ViewItem({ value }: { value: any; }) {
        return <ViewSheetItem value={value} sheetConsole={dashConsole} />;
    }
    return <PageQueryMore
        header={(caption) + ' - 已归档'}
        right={right}
        query={myArchiveList.loadMyList}
        param={param}
        sortField="id"
        ViewItem={ViewItem}
        none={<div className="text-body=tertiary p-3">最近一个月无单</div>}
    >
    </PageQueryMore>;
}
