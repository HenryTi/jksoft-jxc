import { ViewItemMain } from "app/hooks/View";
import { useModal } from "tonwa-app";
import { FA } from "tonwa-com";
import { ReturnGetMySheetList$page } from "uqs/UqDefault";
import { PageSheetEdit } from "./PageSheetEntry";
import { SheetConsole } from "../store";

export function ViewSheetItem({ value, sheetConsole }: { value: ReturnGetMySheetList$page, sheetConsole: SheetConsole; }) {
    const modal = useModal();
    async function onSheet() {
        const store = sheetConsole.createSheetStore();
        await modal.open(<PageSheetEdit store={store} sheetId={value.id} readonly={true} />);
    }

    return <div className="d-flex cursor-pointer" onClick={onSheet}>
        <FA name="file-text" className="ps-4 pt-3 pe-2 text-info" size="lg" />
        <div className="flex-fill">
            <ViewItemMain value={value} isMy={true} />
        </div>
    </div>;
    // return <ViewItemMain value={value} isMy={true} />;
}
