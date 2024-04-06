import { useCallback } from "react";
import { SheetStore } from "../store";
import { RearPickResultType, useBinPicks } from "../binPick";
import { useRowEdit } from "./useRowEdit";
import { BinEditing } from "../store";
import { PickResult } from "../store";

export function useCoreDetailAdd(sheetStore: SheetStore) {
    const rowEdit = useRowEdit();
    const { detail: coreDetail } = sheetStore;
    const entityBin = coreDetail?.entityBin;
    const pick = useBinPicks(entityBin);
    async function addNewDirect() {
        let ret = await pick(sheetStore);
        if (ret === undefined) return;
        let { namedResults, rearBinPick: binPick, rearResult: pickResult, rearPickResultType: lastPickResultType } = ret;
        if (lastPickResultType === RearPickResultType.array) {
            // 直接选入行集，待修改
            if (coreDetail === undefined) {
                alert('Pick Pend on main not implemented');
                return;
            }
            for (let rowProps of pickResult as PickResult[]) {
                namedResults[binPick.name] = rowProps;
                let binEditing = new BinEditing(entityBin);
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
                await sheetStore.setValRow(valRow);
            }
        }
        else {
            // 直接跳出输入界面，开始编辑
            //let section = new Section(coreDetail);
            //let row = new Row(section);
            //row.setLoading(true);
            //coreDetail.addSection(section);
            //const binEditing = new BinEditing(entityBin, row.valRow);
            const binEditing = new BinEditing(entityBin);
            binEditing.setNamedParams(namedResults);
            let ret = await rowEdit(binEditing);
            if (ret === true) {
                const { valRow } = binEditing;
                // Object.assign(row.valRow, valRow);
                // await row.addToSection();
                if (valRow.id !== undefined) debugger;
                let id = await sheetStore.saveDetail(entityBin, entityBin.buds, valRow);
                valRow.id = id;
                await sheetStore.setValRow(valRow);
            }
            // row.setLoading(false);
        }
    }
    return useCallback(addNewDirect, []);
}
