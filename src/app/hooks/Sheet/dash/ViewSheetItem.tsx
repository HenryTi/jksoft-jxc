import { ViewItemMain } from "app/hooks/View";
import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { ReturnGetMySheetList$page } from "uqs/UqDefault";
import { PageSheetEdit } from "./PageSheetEntry";
import { SheetConsole } from "../store";
import { SheetListStore } from "../store";

export function ViewSheetItem({ value, sheetConsole, listStore }: {
    value: ReturnGetMySheetList$page;
    sheetConsole: SheetConsole;
    listStore: SheetListStore;
}) {
    const modal = useModal();
    const store = sheetConsole.createSheetStore(); // for edit
    async function onSheet() {
        await modal.open(<PageSheetEdit store={store} sheetId={value.id} readonly={true} />);
    }

    return <div className="d-flex cursor-pointer" onClick={onSheet}>
        <FA name="file-text" className="ps-4 pt-3 pe-2 text-info" size="lg" />
        <div className="flex-fill">
            <ViewItemMain value={value} isMy={true} store={listStore} />
        </div>
    </div>;
}
