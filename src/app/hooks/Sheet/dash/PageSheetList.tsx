import { EntitySheet } from "app/Biz";
import { SheetConsole } from "../store";
import { PageQueryMore } from "app/coms";
import { ViewItemMain } from "app/hooks/View";
import { ReturnGetMySheetList$page } from "uqs/UqDefault";
import { useModal } from "tonwa-app";
import { PageSheetEdit } from "./PageSheetEntry";
import { FA } from "tonwa-com";

export function PageSheetList({ entitySheet, sheetConsole }: { entitySheet: EntitySheet; sheetConsole: SheetConsole; }) {
    const { caption, name, uq, id, biz } = entitySheet;
    const modal = useModal();
    let to = new Date();
    to.setDate(to.getDate() + 1);
    let from = new Date();
    from.setDate(from.getDate() - 31);
    const param = {
        phrase: id,
        from,
        to,
        timeZone: 8,
    }
    function ViewItem({ value }: { value: ReturnGetMySheetList$page }) {
        return <div className="d-flex">
            <FA name="file-text" className="ps-4 pt-3 pe-2 text-info" size="lg" />
            <div className="flex-fill">
                <ViewItemMain value={value} isMy={true} />
            </div>
        </div>;
        // return <ViewItemMain value={value} isMy={true} />;
    }

    async function onItemClick(item: ReturnGetMySheetList$page) {
        const store = sheetConsole.createSheetStore();
        await modal.open(<PageSheetEdit store={store} sheetId={item.id} readonly={true} />);
    }
    return <PageQueryMore
        header={(caption ?? name) + ' - 已提交'}
        query={uq.GetMySheetList}
        param={param}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
        none={<div className="text-body=tertiary p-3">最近一个月无单</div>}
    >
    </PageQueryMore>;
}
