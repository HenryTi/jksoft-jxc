import { useCallback } from "react";
import { useModal } from "tonwa-app";
import { CoreDetail, Row, Section } from "./SheetStore";
import { ModalInputRow } from "./ModalInputRow";
import { PickResult, RowStore, useBinPicks } from "./binPick";

export function useCoreDetailAdd(coreDetail: CoreDetail) {
    const { openModal } = useModal();
    const { entityBin } = coreDetail;
    const pick = useBinPicks(entityBin);
    async function addNewDirect() {
        let ret = await pick();
        if (ret === undefined) return;
        let [namedResults, binPick, pickResult] = ret;
        if (Array.isArray(pickResult) === true) {
            // 直接选入行集，待修改
            if (coreDetail === undefined) {
                alert('Pick Pend on main not implemented');
                return;
            }
            for (let rowProps of pickResult as PickResult[]) {
                // rowProps = convertRowProps(rowProps);
                let sec = new Section(coreDetail);
                coreDetail.addSection(sec);

                namedResults[binPick.name] = rowProps;
                let rowStore = new RowStore(entityBin);
                rowStore.init(namedResults);
                let { binDetail } = rowStore;
                if (binDetail.value === undefined) {
                    rowStore.setValue('value', 0, undefined);
                }
                await sec.addRowProps(Object.assign({}, rowProps, binDetail as any));
            }
        }
        else {
            // 直接跳出输入界面，开始编辑
            let section = new Section(coreDetail);
            let row = new Row(section);
            coreDetail.addSection(section);
            const rowStore = new RowStore(entityBin);
            rowStore.init(namedResults);
            let ret = await openModal(<ModalInputRow row={row} rowStore={rowStore} />);
            if (ret === true) {
                Object.assign(row.props, rowStore.binDetail);
                await row.addToSection();
            }
        }
    }
    return useCallback(addNewDirect, []);
}
