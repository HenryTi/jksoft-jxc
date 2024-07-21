import { BinInputAtom, BinInputSpec } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, BinStore, PendRow, ValDivBase } from "../../store";
import { PageInputDiv } from "./PageInputDiv";
import { UqApp, useUqApp } from "app";
import { Modal, useModal } from "tonwa-app";
import { PendProxyHandler } from "../../store";
import { NamedResults } from "../../store";

export interface UseEditDivsProps {
    divStore: BinStore;
    pendRow: PendRow;
    valDiv: ValDivBase;         // 当前需要edit的valDiv, 如果新建，则先创建空的valDiv. 所以也不需要返回
    skipInputs: boolean;
}

// 参数：valDiv，改变这个。不需要返回
/*
export function useEditDivs() {
    const uqApp = useUqApp();
    const modal = useModal();
    return useCallback(editDivs, []);
}
*/
export async function editDivs(props: UseEditDivsProps): Promise<boolean> {
    let { divStore, pendRow, valDiv } = props;
    let { entity: entityBin, modal } = divStore;
    let { rearPick, pend: entityPend } = entityBin;
    let namedResults: NamedResults = {
        [rearPick.name]: new Proxy(pendRow, new PendProxyHandler(entityPend)),
    };
    let divEditingFromPend = new DivEditing(divStore, valDiv);
    valDiv.setValRow(divEditingFromPend.values);

    let divEditing = new DivEditing(divStore, valDiv, namedResults);
    // let runInputDivProps: RunInputDivProps = { props, namedResults };
    for (; ;) {
        let retIsInputed = await runInputDiv(props, valDiv, divEditing);
        if (retIsInputed !== true) return;
        // valDiv.mergeValRow(retValRow);
        let { binDiv } = valDiv;
        // 无下级，退出
        if (binDiv.subBinDiv === undefined) {
            // 仅仅表示有值
            return true;
        }
        let valDivNew = valDiv.createValDivSub(pendRow);
        valDiv.setValRow(divEditing.values);
        valDiv.addValDiv(valDivNew, true);
        valDiv = valDivNew;
    }
}

interface RunInputDivProps {
    // uqApp: UqApp;
    // modal: Modal;
    props: UseEditDivsProps;
    namedResults: NamedResults;
}

async function runInputDiv(props: UseEditDivsProps, valDiv: ValDivBase, editing: DivEditing) {
    // let { props, namedResults } = runInputDivProps;
    let { divStore, skipInputs } = props;
    const { modal } = divStore;
    let { binDiv } = valDiv;
    let retInputs = await runInputs(props, valDiv, editing);
    if (retInputs === false) return;
    let divEditing = editing; // new DivEditing(divStore, valDiv, namedResults);
    divEditing.addNamedParams({
        '%sheet': props.divStore.sheetStore.mainProxy,
    })
    valDiv.mergeValRow(divEditing.values);
    if (skipInputs !== true) {
        if (divEditing.isInputNeeded() === true) {
            if (await modal.open(<PageInputDiv divEditing={divEditing} />) !== true) {
                return;
            }
            else {
                valDiv.mergeValRow(divEditing.values);
            }
        }
    }
    let { valRow } = valDiv;
    let id = await divStore.saveDetail(binDiv, valRow);
    valRow.id = id;
    valDiv.setValRow(valRow);
    valDiv.setIXBaseFromInput(divEditing);
    // if (retInputs === true) {
    await divStore.reloadBinProps(id);
    //}
    return true;
}

async function runInputs(props: UseEditDivsProps, valDiv: ValDivBase, editing: DivEditing)
//    runInputDivProps: RunInputDivProps, valDiv: ValDivBase) 
{
    const { binDiv } = valDiv;
    const { inputs } = binDiv;
    if (inputs === undefined) return;
    // let { props, namedResults } = runInputDivProps;
    let { skipInputs } = props;
    if (skipInputs == true) return;
    const { namedResults } = editing;
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
                    valDiv,
                    // uqApp,
                    // modal,
                    binInput: input as BinInputAtom,
                });
                break;
            case BizPhraseType.fork:
                retInput = await inputSpec({
                    ...props,
                    editing,
                    valDiv,
                    // uqApp,
                    // modal,
                    binInput: input as BinInputSpec,
                });
                break;
        }
        if (retInput === undefined) return false;
        namedResults[input.name] = retInput;
    }
    return true;
}
