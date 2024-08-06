import { RearPickResultType, SheetStore } from "../store";
import { BinEditing } from "../store";
import { runBinPicks } from "../binPick";
import { rowEdit } from "./divEdit";
import { PickResult } from "app/hooks/Calc";
/*
export function useDetailNew(sheetStore: SheetStore) {
    // const rowEdit = useRowEdit();
    // const pick = useBinPicks();
    return useCallback(detailNew, []);
}
*/
export async function detailNew(sheetStore: SheetStore): Promise<boolean> {
    const { modal, divStore } = sheetStore;
    if (divStore === undefined) {
        alert('Pick Pend on main not implemented');
        return false;
    }
    const { entity: entityBin, binDivRoot } = divStore;
    //let ret = await pick(sheetStore, entityBin);
    let ret = await runBinPicks(sheetStore, entityBin);
    if (ret === undefined) return false;
    let { editing/*namedResults*/, rearBinPick, rearResult, rearPickResultType } = ret;
    const { valueSpace } = editing;
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
                binEditing.setNamedValue('value', 1, undefined);
            }
            const { origin, pend, pendValue } = rowProps;
            valRow.origin = origin as number;
            valRow.pend = pend as number;
            valRow.pendValue = pendValue as number;
            if (valRow.id !== undefined) debugger;
            let id = await divStore.saveDetail(binDivRoot, valRow);
            valRow.id = id;
            await divStore.reloadValRow(valRow);
            divStore.setValRowRoot(valRow, true);
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
            let id = await divStore.saveDetail(binDivRoot, valRow);
            valRow.id = id;
            await divStore.reloadValRow(valRow);
        }
    }
    sheetStore.notifyRowChange();
    return true;
}