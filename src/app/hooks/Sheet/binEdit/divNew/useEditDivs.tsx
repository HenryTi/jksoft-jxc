import { PendInputAtom, PendInputSpec } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, DivStore, PendRow, ValDiv, ValDivBase } from "../../store";
import { PageEditDiv } from "./PageEditDiv";
import { UqApp, useUqApp } from "app";
import { Modal, useModal } from "tonwa-app";
import { PendProxyHander, ValRow, mergeValRow } from "../../store";
import { NamedResults } from "../../store";

export interface UseEditDivsProps {
    divStore: DivStore;
    pendRow: PendRow;
    namedResults: NamedResults;
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
            [rearPick.name]: new Proxy(pendRow, new PendProxyHander(entityPend)),
        };
        /*
        let binDiv = val0Div.binDiv;
        let valRowInit: ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
        let divEditingFromPend = new DivEditing(divStore, val0Div, namedResults); //, binDiv, val0Div, valRowInit);
        let { valRow } = divEditingFromPend; // : ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
        let ret: ValDivBase, parents: ValDivBase[] = [], parent: ValDivBase;
        let valDiv: ValDivBase = val0Div;
        */
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
            // let valRow: ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
            // 把上一层的数据，带入本层
            // mergeValRow(valRow, valDiv.valRow);
            /*
            这里肯定已经是下一级了
            if (parent === undefined) {
                valDiv = new ValDivRoot(binDiv, valRow);
            }
            else {
            */
            // 新建一级

            let newValRow = {
                ...valDiv.valRow,
                id: undefined as number,
                origin: valDiv.id,
                pend: pendRow.pend,
                pendValue: pendRow.value
            };
            let p = new ValDiv(valDiv, newValRow);
            valDiv.addValDiv(p, true);
            valDiv = p;
            // }
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
    // let iValue: number, iBase: number, xValue: number, xBase: number;
    let retInputs = await runInputs(runInputDivProps, /*binDiv.inputs, */valDiv);
    if (retInputs === false) return;
    /*
    const inputDivsProps: UseEditDivsProps = {
        ...props,
        // binDiv: p,
        // valRow,
        // modal,
        namedResults,
    }
    */
    /*
    if (iBase !== undefined) {
        for (let parent of parents) {
            if (parent.setIBaseFromInput(iBase) === true) break;
        }
    }
    if (xBase !== undefined) {
        for (let parent of parents) {
            if (parent.setXBaseFromInput(xBase) === true) break;
        }
    }
    */
    let divEditing = new DivEditing(divStore, valDiv, namedResults);
    if (skipInputs !== true) {
        if (divEditing.isInputNeeded() === true) {
            if (await modal.open(<PageEditDiv divEditing={divEditing} />) !== true) return;
        }
    }
    valDiv.mergeValRow(divEditing.valRow);
    // save detail;
    let { valRow } = valDiv;
    let id = await divStore.saveDetail(binDiv, valRow);
    valRow.id = id;
    valDiv.setValRow(valRow);
    valDiv.setIXBaseFromInput(divEditing);
    if (retInputs === true) {
        await divStore.reloadBinProps(id);
    }

    /*
    if (parent === undefined) {
        let vd = new ValDivRoot(p, valRow);
        divStore.replaceValDiv(valDiv, vd);
        valDiv = vd;
    }
    else {
        let vd = new ValDiv(parent, valRow);
        parent.addValDiv(vd, true);
        valDiv = vd;
    }
    // valDiv = parent === undefined ?  : new ValDiv(parent, valRow);
    //valDiv = new ValDiv(parent, p, { ...valRow, id, pend: pendRow.pend, origin });
    divStore.setValColl(valDiv);
    parent = valDiv;
    if (ret === undefined) {
        // parent = 
        ret = valDiv;
    }
    else {
        // parent.setIXBase(sheetStore, valRow);
        // parent.addValDiv(valDiv);
        // parent = valDiv;
    }
    parents.push(parent);
    if (iValue !== undefined) {
        for (let p of parents) {
            if (p.setIValueFromInput(iValue) === true) break;
        }
    }
    if (xValue !== undefined) {
        for (let p of parents) {
            if (p.setXValueFromInput(xValue) === true) break;
        }
    }
    valRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
    let { atomValRow } = valDiv;
    let valDivRow = getAtomValue(atomValRow);
    mergeValRow(valRow, valDivRow);
    valRow.id = undefined;                          // 新输入行
    // return valDiv;
    */
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
                    uqApp,
                    modal,
                    binInput: input as PendInputAtom,
                });
                break;
            case BizPhraseType.spec:
                retInput = await inputSpec({
                    ...props,
                    uqApp,
                    modal,
                    binInput: input as PendInputSpec,
                });
                break;
        }
        if (retInput === undefined) return false;
        namedResults[input.name] = retInput;
    }
    return true;
    // let divEditing = new DivEditing(divStore, valDiv, namedResults);
    /*
    let { iValue: iValueNew, iBase: iBaseNew, xValue: xValueNew, xBase: xBaseNew } = divEditing;
    if (iValueNew !== undefined) iValue = iValueNew;
    if (iBaseNew !== undefined) iBase = iBaseNew;
    if (xValueNew !== undefined) xValue = xValueNew
    if (xBaseNew !== undefined) xBase = xBaseNew;
    */
    // mergeValRow(valRow, divEditing.valRow);
}
