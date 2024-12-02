import { BinEditing, RearPickResultType, ReturnUseBinPicks, SheetStore, ValRow } from "../store";
import { runBinPicks } from "../binPick";
import { rowEdit } from "./divEdit";
import { PickResult } from "app/hooks/Calc";
import { PageConfirm } from "tonwa-app";

export async function detailNewLoop(sheetStore: SheetStore): Promise<void> {
    const { modal, binStore } = sheetStore;
    for (; ;) {
        let ret = await detailNew(sheetStore);
        if (ret === undefined) break;
        if (ret.rearResult.length > 1) break;
        const binEditing = new BinEditing(sheetStore, binStore.entity);
        binEditing.addNamedParams(ret.editing.valueSpace);
        let retEdit = await rowEdit(modal, binEditing, undefined);
        if (retEdit !== true) break;
        // if (await modal.open(<PageConfirm header="输入明细" auth={false} message="继续输入明细吗？" yes="继续" no="不继续" />) !== true) {
        //    break;
        //}
    }
}

export async function detailNew(sheetStore: SheetStore): Promise<ReturnUseBinPicks> {
    const { modal, binStore } = sheetStore;
    if (binStore === undefined) {
        alert('Pick Pend on main not implemented');
        return;
    }
    const { entity: entityBin, binDivRoot } = binStore;
    let ret = await runBinPicks(sheetStore, entityBin);
    if (ret === undefined) return;

    binStore.setWaiting(true);
    let { editing, rearBinPick, rearResult, rearPickResultType } = ret;
    const { valueSpace } = editing;
    const valRows: ValRow[] = [];
    if (rearPickResultType === RearPickResultType.array) {
        // 直接选入行集，待修改
        for (let rowProps of rearResult as PickResult[]) {
            let binEditing = new BinEditing(sheetStore, entityBin);
            const pickName = rearBinPick.name;
            switch (pickName) {
                default:
                    valueSpace.setValue(pickName, rowProps);
                    binEditing.addNamedParams(valueSpace);
                    break;
                case 'i$pick':
                    binEditing.setNamedValue('i', (rowProps as any).id, undefined);
                    break;
                case 'x$pick':
                    binEditing.setNamedValue('x', (rowProps as any).id, undefined);
                    break;
            }
            let { values: valRow } = binEditing;
            if (valRow.value === undefined) {
                const defaultValue = 1;
                binEditing.setNamedValue('value', defaultValue, undefined);
            }
            const { origin, pend, pendValue } = rowProps;
            valRow.origin = origin as number;
            valRow.pend = pend as number;
            valRow.pendValue = pendValue as number;
            if (valRow.id !== undefined) debugger;
            valRows.push(valRow);
        }
    }
    else {
        // 直接跳出输入界面，开始编辑
        const binEditing = new BinEditing(sheetStore, entityBin);
        binEditing.addNamedParams(valueSpace);
        let ret = await rowEdit(modal, binEditing, undefined);
        if (ret === true) {
            const { values: valRow } = binEditing;
            if (valRow.id !== undefined) debugger;
            valRows.push(valRow);
        }
    }

    if (valRows.length > 0) {
        await binStore.saveDetails(binDivRoot, valRows);
        binStore.setValRowArrayToRoot(valRows);
    }

    binStore.setWaiting(false);
    sheetStore.notifyRowChange();
    return ret;
}
