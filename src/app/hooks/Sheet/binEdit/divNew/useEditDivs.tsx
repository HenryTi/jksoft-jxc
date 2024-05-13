import { BinInputAtom, BinInputSpec } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, DivStore, PendRow, ValDiv, ValDivBase } from "../../store";
import { PageInputDiv } from "./PageInputDiv";
import { UqApp, useUqApp } from "app";
import { Modal, useModal } from "tonwa-app";
import { PendProxyHandler, ValRow, mergeValRow } from "../../store";
import { NamedResults } from "../../store";

export interface UseEditDivsProps {
    divStore: DivStore;
    pendRow: PendRow;
    // namedResults: NamedResults;
    // binDiv: BinDiv;          // 当前binDiv的下层
    valDiv: ValDivBase;         // 当前需要edit的valDiv, 如果新建，则先创建空的valDiv. 所以也不需要返回
    // valDivParent: ValDiv;
    skipInputs: boolean;
}

// 参数：valDiv，改变这个。不需要返回
export function useEditDivs() {
    const uqApp = useUqApp();
    const modal = useModal();
    return useCallback(async function (props: UseEditDivsProps): Promise<boolean> {
        let { divStore, pendRow, valDiv } = props;
        let { entityBin } = divStore;
        let { rearPick, pend: entityPend } = entityBin;
        let namedResults: NamedResults = {
            [rearPick.name]: new Proxy(pendRow, new PendProxyHandler(entityPend)),
        };
        let divEditingFromPend = new DivEditing(divStore, valDiv, namedResults);
        valDiv.setValRow(divEditingFromPend.values);

        let runInputDivProps: RunInputDivProps = { props, uqApp, modal, namedResults };
        for (; ;) {
            let retIsInputed = await runInputDiv(runInputDivProps, valDiv);
            if (retIsInputed !== true) return;
            // valDiv.mergeValRow(retValRow);
            let { binDiv } = valDiv;
            // 无下级，退出
            if (binDiv.subBinDiv === undefined) {
                // 仅仅表示有值
                return true;
            }
            let valDivNew = valDiv.createValDivSub(pendRow);
            let divEditing = new DivEditing(divStore, valDiv, namedResults);
            valDiv.setValRow(divEditing.values);
            valDiv.addValDiv(valDivNew, true);
            valDiv = valDivNew;
        }
    }, []);
}

interface RunInputDivProps {
    uqApp: UqApp;
    modal: Modal;
    props: UseEditDivsProps;
    namedResults: NamedResults;
}

async function runInputDiv(runInputDivProps: RunInputDivProps, valDiv: ValDivBase) {
    let { modal, props, namedResults } = runInputDivProps;
    let { divStore, skipInputs } = props;
    let { binDiv } = valDiv;
    let retInputs = await runInputs(runInputDivProps, valDiv);
    if (retInputs === false) return;
    let divEditing = new DivEditing(divStore, valDiv, namedResults);
    if (skipInputs !== true) {
        if (divEditing.isInputNeeded() === true) {
            if (await modal.open(<PageInputDiv divEditing={divEditing} />) !== true) return;
        }
    }
    valDiv.mergeValRow(divEditing.values);
    let { valRow } = valDiv;
    let id = await divStore.saveDetail(binDiv, valRow);
    valRow.id = id;
    valDiv.setValRow(valRow);
    valDiv.setIXBaseFromInput(divEditing);
    if (retInputs === true) {
        await divStore.reloadBinProps(id);
    }
    return true;
}

async function runInputs(runInputDivProps: RunInputDivProps, /*inputs: PendInput[], */valDiv: ValDivBase) {
    const { binDiv } = valDiv;
    const { inputs } = binDiv;
    if (inputs === undefined) return;
    let { uqApp, modal, props, namedResults } = runInputDivProps;
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
                    namedResults,
                    valDiv,
                    uqApp,
                    modal,
                    binInput: input as BinInputAtom,
                });
                break;
            case BizPhraseType.spec:
                retInput = await inputSpec({
                    ...props,
                    namedResults,
                    valDiv,
                    uqApp,
                    modal,
                    binInput: input as BinInputSpec,
                });
                break;
        }
        if (retInput === undefined) return false;
        namedResults[input.name] = retInput;
    }
    return true;
}
