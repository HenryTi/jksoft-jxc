import { PickPend } from "../../Biz";
import { BinStore, PickResult } from "../../Store";
import { PagePend } from "./PagePend";
import { ValRow } from "../../Store/ValRow";
import { FormBudsStore } from "../../Controller/ControllerBuds/BinEditing";

export async function pickFromPend(binStore: BinStore
    , editing: FormBudsStore // BudsEditing
    , binPick: PickPend
): Promise<PickResult[]> {
    let { bin } = binPick;
    const { modal } = editing;
    let pendStore = binStore.getPickPendStore(binPick);
    await pendStore.searchPend();
    let inputed = await modal.open<ValRow[]>(<PagePend pendStore={pendStore} />);
    if (inputed === undefined) return;
    await binStore.allPendsToValRows();
    if (bin.binDivRoot.inputs !== undefined) return;
    let iArr: (ValRow | [number, ValRow[]])[] = [];
    // 随后的pickFromPend，不再显示步骤
    // binStore.sheetStore.sheetConsole.steps = undefined;
    return iArr as any;
}