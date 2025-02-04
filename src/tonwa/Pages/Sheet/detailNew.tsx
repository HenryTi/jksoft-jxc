// import { BinEditing, RearPickResultType, PickResult, StoreSheet, ValRow } from "../../../Store";
import { ValRow } from "../../Store/ValRow";
import { PickResult, RearPickResultType, StoreSheet } from "../../Store";
// import { runBinPicks } from "../binPick";
// import { rowEdit } from "./divEdit";
import { BinEditing } from "../../Controller/ControllerBuds/BinEditing";
import { BizPhraseType } from "../../Biz";
// import { PageConfirm } from "tonwa-app";

export async function detailNewLoop(sheetStore: StoreSheet): Promise<void> {
    // const { modal, binStore } = sheetStore;
    for (; ;) {
        let ret = await detailNew(sheetStore);
        if (ret !== 1) break;
        /*
        const binEditing = new BinEditing(sheetStore, binStore.entity);
        binEditing.addNamedParams(ret.editing.valueSpace);
        let retEdit = await rowEdit(modal, binEditing, undefined);
        if (retEdit !== true) break;
        */
        // if (await modal.open(<PageConfirm header="输入明细" auth={false} message="继续输入明细吗？" yes="继续" no="不继续" />) !== true) {
        //    break;
        //}
    }
}

export async function detailNew(sheetStore: StoreSheet): Promise<number> {
    const { modal, binStore } = sheetStore;
    if (binStore === undefined) {
        alert('Pick Pend on main not implemented');
        return 0;
    }
    const { entity: entityBin, binDivRoot } = binStore;
    let ret = await runBinPicks(modal, sheetStore, entityBin);
    if (ret === undefined) return 0;
    let { editing, rearBinPick, rearResult, rearPickResultType } = ret;
    if (rearBinPick.fromPhraseType === BizPhraseType.pend) {
        // 中断输入循环
        return 2;
    }
    const { valueSpace } = editing.budsEditing;
    const valRows: ValRow[] = [];
    binStore.setWaiting(true);
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
            if (rearResult.length === 1) {
                let ret = await rowEdit(modal, binEditing, undefined);
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
            if (binStore.hasPickBound(valRow) === false) {
                valRows.push(valRow);
            }
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
    return valRows.length;
}
