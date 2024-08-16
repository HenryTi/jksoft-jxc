import { Modal, Page } from "tonwa-app";
import { BinEditing, ValDivBase } from "../../store";
import { ModalInputRow } from "./ModalInputRow";

export async function rowEdit(modal: Modal, binEditing: BinEditing, valDiv: ValDivBase) {
    const { entityBin } = binEditing;
    const { i: budI, x: budX } = entityBin;
    const { atomParams } = budI;
    if (atomParams !== undefined) {
        const { caption } = budI;
        await modal.open(<Page header={caption}>
        </Page>);
    }
    let ret = await modal.open(<ModalInputRow binEditing={binEditing} valDiv={valDiv} />);
    return ret;
}
