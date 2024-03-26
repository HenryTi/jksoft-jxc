import { useCallback } from "react";
import { CoreDetail, Row, Section, SheetStore } from "../store";
import { RearPickResultType, useBinPicks } from "../binPick";
import { useRowEdit } from "./rowEdit";
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
                let sec = new Section(coreDetail);
                coreDetail.addSection(sec);

                namedResults[binPick.name] = rowProps;
                let binEditing = new BinEditing(entityBin);
                binEditing.setNamedParams(namedResults);
                let { valRow } = binEditing;
                if (valRow.value === undefined) {
                    binEditing.setValue('value', 1, undefined);
                }
                const { origin, pend, pendValue } = rowProps;
                /*
                let row = new Row(sec);
                row.setLoading(true);
                await sec.addRowProps(row, Object.assign(
                    {},
                    // rowProps, 这是多选明细，不应该加这里。在前面rowStore.init已经处理了字段带入
                    valRow as any,
                    { origin, pend, pendValue },
                ));
                */
                await coreDetail.sheetStore.reloadRow(valRow);
                // row.setLoading(false);
            }
        }
        else {
            // 直接跳出输入界面，开始编辑
            let section = new Section(coreDetail);
            let row = new Row(section);
            row.setLoading(true);
            coreDetail.addSection(section);
            const binEditing = new BinEditing(entityBin, row.valRow);
            binEditing.setNamedParams(namedResults);
            let ret = await rowEdit(binEditing);
            if (ret === true) {
                const { valRow } = binEditing;
                Object.assign(row.valRow, valRow);
                await row.addToSection();
                await coreDetail.sheetStore.reloadRow(valRow);
            }
            row.setLoading(false);
        }
    }
    return useCallback(addNewDirect, []);
}
