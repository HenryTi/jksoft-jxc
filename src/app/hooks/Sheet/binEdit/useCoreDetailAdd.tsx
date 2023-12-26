import { useCallback } from "react";
import { CoreDetail, Row, Section } from "../store";
import { RearPickResultType, useBinPicks } from "../binPick";
import { useRowEdit } from "./rowEdit";
import { BinEditing } from "../store";
import { PickResult } from "../NamedResults";

export function useCoreDetailAdd(coreDetail: CoreDetail) {
    const rowEdit = useRowEdit();
    const { entityBin, sheetStore } = coreDetail;
    // const { divStore } = sheetStore;
    // divStore.namedResults = undefined;
    const pick = useBinPicks(entityBin);
    async function addNewDirect() {
        // divStore.namedResults = {}; // .initNamedResults();
        // let { namedResults } = divStore;
        let ret = await pick(sheetStore);
        if (ret === undefined) return;
        /*
        if (namedResults === undefined) {
            divStore.namedResults = namedResults = {};
        }
        */
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
                let { binRow: binRow } = binEditing;
                if (binRow.value === undefined) {
                    binEditing.setValue('value', 0, undefined);
                }
                const { origin, pend, pendValue } = rowProps;
                let row = await sec.addRowProps(Object.assign(
                    {},
                    // rowProps, 这是多选明细，不应该加这里。在前面rowStore.init已经处理了字段带入
                    binRow as any,
                    { origin, pend, pendValue },
                ));
                await coreDetail.sheetStore.reloadRow(row.props.id);
            }
        }
        else {
            // 直接跳出输入界面，开始编辑
            let section = new Section(coreDetail);
            let row = new Row(section);
            coreDetail.addSection(section);
            const binEditing = new BinEditing(entityBin, row.props);
            binEditing.setNamedParams(namedResults);
            let ret = await rowEdit(binEditing);
            if (ret === true) {
                Object.assign(row.props, binEditing.binRow);
                await row.addToSection();
                await coreDetail.sheetStore.reloadRow(row.props.id);
            }
        }
    }
    return useCallback(addNewDirect, []);
}
