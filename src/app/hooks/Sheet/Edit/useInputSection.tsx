import { useCallback } from "react";
import { DetailMain, DetailRow, DetailSection } from "./SheetStore";
import { useModal } from "tonwa-app";
import { usePick } from "app/hooks/BizPick";
import { ModalInputPend } from "./ModalInputPend";
import { ModalInputRow } from "./ModalInputRow";

export function useInputSection(detailMan: DetailMain) {
    const { openModal } = useModal();
    const pick = usePick();
    async function input() {
        let section = new DetailSection(detailMan);
        const { detail } = section;
        const { entityDetail } = detail;
        const { pend, item } = entityDetail;
        if (pend !== undefined) await addPend();
        else await addInput();
        return section;
        async function addPend() {
            let inputed = await openModal(<ModalInputPend />);
            // await detail.addRow();
        }
        async function addInput() {
            let ret = await pick(item);
            if (ret === undefined) return;
            let { spec } = ret;
            let row = new DetailRow(section);
            row.item = spec;
            await openModal(<ModalInputRow row={row} />);
            await row.addToSection();
        }
    }
    return useCallback(input, []);
}
