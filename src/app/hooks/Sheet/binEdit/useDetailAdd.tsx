import { useCallback } from "react";
import { SheetStore } from "../store";
import { RearPickResultType, useBinPicks } from "../binPick";
import { useRowEdit } from "./useRowEdit";
import { BinEditing } from "../store";
import { PickResult } from "../store";

export function useDetailAdd(sheetStore: SheetStore) {
    const rowEdit = useRowEdit();
    const { detail } = sheetStore;
    const entityBin = detail?.entityBin;
    const pick = useBinPicks(entityBin);
    async function addNewDirect(): Promise<boolean> {
        let ret = await pick(sheetStore);
        if (ret === undefined) return false;
        let { namedResults, rearBinPick, rearResult, rearPickResultType } = ret;
        if (rearPickResultType === RearPickResultType.array) {
            // 直接选入行集，待修改
            if (detail === undefined) {
                alert('Pick Pend on main not implemented');
                return false;
            }
            for (let rowProps of rearResult as PickResult[]) {
                namedResults[rearBinPick.name] = rowProps;
                let binEditing = new BinEditing(sheetStore, entityBin);
                binEditing.setNamedParams(namedResults);
                let { valRow } = binEditing;
                if (valRow.value === undefined) {
                    binEditing.setValue('value', 1, undefined);
                }
                const { origin, pend, pendValue } = rowProps;
                valRow.origin = origin;
                valRow.pend = pend;
                valRow.pendValue = pendValue;
                if (valRow.id !== undefined) debugger;
                let id = await sheetStore.saveDetail(entityBin, entityBin.buds, valRow);
                valRow.id = id;
                await sheetStore.reloadValRow(valRow);
            }
        }
        else {
            // 直接跳出输入界面，开始编辑
            //let section = new Section(coreDetail);
            //let row = new Row(section);
            //row.setLoading(true);
            //coreDetail.addSection(section);
            //const binEditing = new BinEditing(entityBin, row.valRow);
            const binEditing = new BinEditing(sheetStore, entityBin);
            binEditing.setNamedParams(namedResults);
            let ret = await rowEdit(binEditing, undefined);
            if (ret === true) {
                const { valRow } = binEditing;
                // Object.assign(row.valRow, valRow);
                // await row.addToSection();
                if (valRow.id !== undefined) debugger;
                let id = await sheetStore.saveDetail(entityBin, entityBin.buds, valRow);
                valRow.id = id;
                await sheetStore.reloadValRow(valRow);
            }
            // row.setLoading(false);
        }
        sheetStore.notifyRowChange();
        return true;
    }
    return useCallback(addNewDirect, []);
}
