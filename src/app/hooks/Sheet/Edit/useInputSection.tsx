import { useCallback } from "react";
import { DetailMain, DetailRow, DetailSection } from "./SheetStore";
import { useModal } from "tonwa-app";
import { usePick } from "app/hooks/BizPick";
import { ModalInputPend } from "./ModalInputPend";
import { ModalInputRow } from "./ModalInputRow";

export function useInputSection(detailMan: DetailMain) {
    const { openModal } = useModal();
    const pick = usePick();
    const { entityDetail } = detailMan;
    const { pend, i: item } = entityDetail;

    async function inputFromPend(detailSection: DetailSection) {
        let inputed = await openModal(<ModalInputPend propPend={pend} />);
        // await detail.addRow();
    }
    async function inputSection(detailSection: DetailSection) {
        let ret = await pick(item);
        if (ret === undefined) return;
        let { spec } = ret;
        let isNewSection = false;
        if (detailSection === undefined) {
            detailSection = new DetailSection(detailMan);
            isNewSection = true;
        }
        let row = new DetailRow(detailSection);
        row.i = spec;
        let retInput = await openModal(<ModalInputRow row={row} />);
        if (retInput === true) {
            await row.addToSection();
            if (isNewSection === true) detailMan.addSection(detailSection);
        }
    }
    return useCallback(pend !== undefined ? inputFromPend : inputSection, []);
}
