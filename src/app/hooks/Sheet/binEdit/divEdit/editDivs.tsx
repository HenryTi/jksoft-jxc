import { BinInputAtom, BinInputFork } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputFork } from "./inputFork";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, BinStore, PendRow, ValDivBase } from "../../store";
import { PendProxyHandler } from "../../store";
import { ModalInputRow } from "./ModalInputRow";

export interface UseEditDivsProps {
    binStore: BinStore;
    pendRow: PendRow;
    valDiv: ValDivBase;         // 当前需要edit的valDiv, 如果新建，则先创建空的valDiv. 所以也不需要返回
    skipInputs: boolean;
}

export async function editDivs(props: UseEditDivsProps): Promise<boolean> {
    let { binStore, pendRow, valDiv } = props;
    let { entity: entityBin, sheetStore } = binStore;
    let { rearPick, pend: entityPend } = entityBin;
    let pendResult = new Proxy(pendRow, new PendProxyHandler(entityPend));
    for (; ;) {
        let divEditing = new DivEditing(binStore, valDiv);
        if (rearPick !== undefined) {
            divEditing.setNamedValues(rearPick.name, pendResult);
        }
        divEditing.setNamedValues('pend', pendResult);
        divEditing.setNamedValues('%pend', pendResult);
        divEditing.calcAll();
        let retIsInputed = await runInputDiv(props, divEditing);
        if (retIsInputed !== true) return;
        let { binDiv } = valDiv;
        // 无下级，退出
        if (binDiv.subBinDiv === undefined) {
            // 仅仅表示有值
            // return true;
            break;
        }
        let valDivNew = valDiv.createValDivSub(pendRow);
        valDiv.addValDiv(valDivNew, true);
        valDiv = valDivNew;
    }
    sheetStore.notifyRowChange();
    return true;
}

async function runInputDiv(props: UseEditDivsProps, divEditing: DivEditing) {
    let { binStore, skipInputs } = props;
    const { modal } = binStore;
    const { valDiv } = divEditing;
    let { binDiv } = valDiv;
    let retInputs = await runInputs(props, divEditing);
    if (retInputs === false) return;

    valDiv.mergeValRow(divEditing.values);
    if (skipInputs !== true) {
        if (divEditing.isInputNeeded() === true) {
            if (await modal.open(<ModalInputRow binEditing={divEditing} valDiv={valDiv} />) !== true) {
                return;
            }
            valDiv.mergeValRow(divEditing.values);
        }
    }
    async function saveDetail() {
        let { valRow } = valDiv;
        await binStore.saveDetails(binDiv, [valRow]);
        valDiv.setValRow(valRow);
        valDiv.setIXBaseFromInput(divEditing);
    }
    await saveDetail();
    return true;
}

async function runInputs(props: UseEditDivsProps, editing: DivEditing) {
    const { valDiv } = editing;
    const { binDiv } = valDiv;
    const { inputs } = binDiv;
    if (inputs === undefined) return;
    let { skipInputs } = props;
    if (skipInputs == true) return;
    for (let input of inputs) {
        const { bizPhraseType } = input;
        let retInput: any = undefined;
        switch (bizPhraseType) {
            default:
            case BizPhraseType.fork:
                retInput = await inputFork({
                    ...props,
                    editing,
                    binInput: input as BinInputFork,
                });
                break;
            case BizPhraseType.atom:
                retInput = await inputAtom({
                    ...props,
                    editing,
                    binInput: input as BinInputAtom,
                });
                break;
        }
        if (retInput === undefined) return false;
        editing.setNamedValue(input.name, retInput);
    }
    editing.calcAll();
    return true;
}
