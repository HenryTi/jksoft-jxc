import { BinInputAtom, BinInputFork } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, BinStore, PendRow, ValDivBase } from "../../store";
import { PendProxyHandler } from "../../store";
import { ModalInputRow } from "./ModalInputRow";

export interface UseEditDivsProps {
    divStore: BinStore;
    pendRow: PendRow;
    valDiv: ValDivBase;         // 当前需要edit的valDiv, 如果新建，则先创建空的valDiv. 所以也不需要返回
    skipInputs: boolean;
}

export async function editDivs(props: UseEditDivsProps): Promise<boolean> {
    let { divStore, pendRow, valDiv } = props;
    let { entity: entityBin } = divStore;
    let { rearPick, pend: entityPend } = entityBin;
    let pendResult = new Proxy(pendRow, new PendProxyHandler(entityPend));
    for (; ;) {
        let divEditing = new DivEditing(divStore, valDiv);
        divEditing.setNamedValues(rearPick.name, pendResult);
        divEditing.setNamedValues('pend', pendResult);
        divEditing.calcAll();
        let retIsInputed = await runInputDiv(props, divEditing);
        if (retIsInputed !== true) return;
        let { binDiv } = valDiv;
        // 无下级，退出
        if (binDiv.subBinDiv === undefined) {
            // 仅仅表示有值
            return true;
        }
        let valDivNew = valDiv.createValDivSub(pendRow);
        valDiv.addValDiv(valDivNew, true);
        valDiv = valDivNew;
    }
}

async function runInputDiv(props: UseEditDivsProps, divEditing: DivEditing) {
    let { divStore, skipInputs } = props;
    const { modal } = divStore;
    const { valDiv } = divEditing;
    let { binDiv } = valDiv;
    let retInputs = await runInputs(props, divEditing);
    if (retInputs === false) return;

    valDiv.mergeValRow(divEditing.values);
    if (skipInputs !== true) {
        if (divEditing.isInputNeeded() === true) {
            //if (await modal.open(<PageInputDiv divEditing={divEditing} />) !== true) {
            if (await modal.open(<ModalInputRow binEditing={divEditing} valDiv={valDiv} />) !== true) {
                return;
            }
            else {
                valDiv.mergeValRow(divEditing.values);
            }
        }
    }
    async function saveDetail() {
        let { valRow } = valDiv;
        let id = await divStore.saveDetail(binDiv, valRow);
        await divStore.reloadBinProps(id);
        valRow.id = id;
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
                debugger;
                throw new Error('unknown BizPhraseType:' + bizPhraseType);
            case BizPhraseType.atom:
                retInput = await inputAtom({
                    ...props,
                    editing,
                    binInput: input as BinInputAtom,
                });
                break;
            case BizPhraseType.fork:
                retInput = await inputSpec({
                    ...props,
                    editing,
                    binInput: input as BinInputFork,
                });
                break;
        }
        if (retInput === undefined) return false;
        editing.setNamedValue(input.name, retInput);
    }
    editing.calcAll();
    return true;
}
