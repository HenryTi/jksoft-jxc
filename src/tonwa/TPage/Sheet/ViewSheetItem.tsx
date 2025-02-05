import { FA } from "tonwa-com";
import { ReturnGetMySheetList$page } from "uqs/UqDefault";
import { PageSheetEdit } from "./PageSheetEdit";
import { ControlSheetEdit, ControlSheetList } from "../../Control";
import { ViewItemMain } from "../../View";

export function ViewSheetItem({ control, value }: {
    value: ReturnGetMySheetList$page;
    control: ControlSheetList,
    // sheetConsole: SheetConsole;
    // listStore: SheetListStore;
}) {
    // const modal = useModal();
    // const store = sheetConsole.createSheetStore(); // for edit
    const { storeSheet } = control;
    async function onSheet() {
        // await control.openModal(<PageSheetEdit control={control} />);
        alert('building...');
    }

    return <div className="d-flex cursor-pointer" onClick={onSheet}>
        <FA name="file-text" className="ps-4 pt-3 pe-2 text-info" size="lg" />
        <div className="flex-fill">
            <ViewItemMain value={value} isMy={true} store={storeSheet} />
        </div>
    </div>;
}
