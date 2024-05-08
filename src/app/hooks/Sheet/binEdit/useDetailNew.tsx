import { useCallback } from "react";
import { RearPickResultType, SheetStore } from "../store";
import { useBinPicks } from "../binPick";
import { useRowEdit } from "./useRowEdit";
import { BinEditing } from "../store";
import { PickResult } from "../store";

export function useDetailNew(sheetStore: SheetStore) {
    const rowEdit = useRowEdit();
    const pick = useBinPicks();
    return useCallback(async function (): Promise<boolean> {
        const { divStore } = sheetStore;
        if (divStore === undefined) {
            alert('Pick Pend on main not implemented');
            return false;
        }
        const { entityBin, binDivRoot } = divStore;
        let ret = await pick(sheetStore, entityBin);
        if (ret === undefined) return false;
        let { namedResults, rearBinPick, rearResult, rearPickResultType } = ret;
        if (rearPickResultType === RearPickResultType.array) {
            // 直接选入行集，待修改
            for (let rowProps of rearResult as PickResult[]) {
                namedResults[rearBinPick.name] = rowProps;
                let binEditing = new BinEditing(sheetStore, entityBin);
                binEditing.setNamedParams(namedResults);
                let { values: valRow } = binEditing;
                if (valRow.value === undefined) {
                    binEditing.setNamedValue('value', 1, undefined);
                }
                const { origin, pend, pendValue } = rowProps;
                valRow.origin = origin;
                valRow.pend = pend;
                valRow.pendValue = pendValue;
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
            binEditing.setNamedParams(namedResults);
            let ret = await rowEdit(binEditing, undefined);
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
    }, []);
}
