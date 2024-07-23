import { PickPend } from "app/Biz";
import { PendProxyHandler, PickResult, ValRow } from "../store";
import { BinStore } from "../store";
import { PagePend } from "./PagePend";
import { Editing } from "app/hooks/BudsEditing";

export async function pickFromPend(divStore: BinStore, editing: Editing, binPick: PickPend): Promise<PickResult[]> {
    let { from: entityPend, bin } = binPick;
    const pendProxyHander = new PendProxyHandler(entityPend);
    const { modal } = editing;
    let pendStore = divStore.getPickPendStore(binPick, editing.namedResults);
    await pendStore.searchPend();
    let inputed = await modal.open<ValRow[]>(<PagePend pendStore={pendStore} />);
    if (inputed === undefined) return;
    // sheetConsole.steps = undefined;
    // 如果有inputs，直接已经输入进了。就不用返回了。
    if (bin.binDivRoot.inputs !== undefined) return;
    function proxy(obj: any) {
        return new Proxy(obj, pendProxyHander);
    }
    let iArr: (ValRow | [number, ValRow[]])[] = [];
    let iGroup: number[] = [];
    let iColl: { [i: number]: ValRow[] } = {};
    // group 按 i 分组
    // 行拆分。暂时没有内容
    for (let r of inputed) {
        let { i, x } = r;
        let rProxy = proxy(r);
        if (x === undefined) {
            iArr.push(rProxy);
        }
        else {
            let group = iColl[i];
            if (group === undefined) {
                group = [rProxy];
                iColl[i] = group;
                iGroup.push(i);
            }
            else {
                group.push(rProxy);
            }
        }
    }
    for (let g of iGroup) {
        iArr.push([g, iColl[g]]);
    }
    // 随后的pickFromPend，不再显示步骤
    divStore.sheetStore.sheetConsole.steps = undefined;
    return iArr;
}