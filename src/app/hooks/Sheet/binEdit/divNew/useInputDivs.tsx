import { PendInputAtom, PendInputSpec, BinRow, BinDiv, PendInput } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, UseInputDivsProps, ValDiv, ValDivBase, ValDivRoot } from "../../store";
import { PageInput } from "./PageInputDiv";
import { UqApp, useUqApp } from "app";
import { Modal, useModal } from "tonwa-app";
import { PendProxyHander, ValRow, mergeValRow } from "../../store";
import { NamedResults } from "../../store";
import { getAtomValue } from "tonwa-com";

export function useInputDivs() {
    const uqApp = useUqApp();
    const modal = useModal();
    return useCallback(async function (props: UseInputDivsProps): Promise<ValDivBase> {
        let { divStore, pendRow, binDiv, valDiv: val0Div } = props;
        let { entityBin } = divStore;
        let { rearPick } = entityBin;
        let namedResults: NamedResults = {
            [rearPick.name]: new Proxy(pendRow, new PendProxyHander(entityBin.pend)),
        };
        let valRowInit: ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
        let divEditingFromPend = new DivEditing(divStore, namedResults, binDiv, val0Div, valRowInit);
        let { valRow } = divEditingFromPend; // : ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
        let ret: ValDivBase, parents: ValDivBase[] = [], parent: ValDivBase;
        let valDiv: ValDivBase = val0Div;
        let runInputDivProps: RunInputDivProps = { props, uqApp, modal, namedResults };
        for (let p = binDiv; p !== undefined; p = p.subBinDiv) {
            valDiv = await runInputDiv(runInputDivProps, p, valDiv);
        }
        return ret;
    }, []);
}

interface RunInputDivProps {
    uqApp: UqApp;
    modal: Modal;
    props: UseInputDivsProps;
    namedResults: NamedResults;
}

async function runInputDiv(runInputDivProps: RunInputDivProps, p: BinDiv, valDivParent: ValDiv) {
    let { uqApp, modal, props, namedResults } = runInputDivProps;
    let { divStore, pendRow, binDiv, valDiv: val0Div, skipInputs } = props;
    let valDiv: ValDiv;
    let valRow: ValRow;
    let iValue: number, iBase: number, xValue: number, xBase: number;
    if (await runInputs(runInputDivProps, p.inputs, valDiv, valRow) === false) return;
    let origin = valDiv === undefined ? pendRow.origin : valDiv.id;
    valRow.origin = origin;
    valRow.pend = pendRow.pend;
    valRow.pendValue = pendRow.value;
    const inputDivsProps: UseInputDivsProps = {
        ...props,
        binDiv: p,
        // valRow,
        // modal,
        namedResults,
    }
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
    if (skipInputs !== true) {
        async function inputDiv(): Promise<ValRow> {
            const { divStore, binDiv, namedResults, valDiv: valDiv } = inputDivsProps;
            let divEditing = new DivEditing(divStore, namedResults, binDiv, valDiv, valRow);
            if (divEditing.isInputNeeded() === true) {
                if (await modal.open(<PageInput divEditing={divEditing} />) !== true) return;
            }
            return divEditing.valRow;
        }

        let retValRow: ValRow = await inputDiv();
        if (retValRow === undefined) return;
        mergeValRow(valRow, retValRow);
    }
    // save detail;
    let id = await divStore.saveDetail(p, valRow);
    valRow.id = id;
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
    */
    valRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
    let { atomValRow } = valDiv;
    let valDivRow = getAtomValue(atomValRow);
    mergeValRow(valRow, valDivRow);
    valRow.id = undefined;                          // 新输入行
    return valDiv;
}

async function runInputs(runInputDivProps: RunInputDivProps, inputs: PendInput[], valDiv: ValDiv, valRow: ValRow) {
    if (inputs === undefined) return;
    let { uqApp, modal, props, namedResults } = runInputDivProps;
    let { divStore, pendRow, binDiv, valDiv: val0Div, skipInputs } = props;
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
    let divEditing = new DivEditing(divStore, namedResults, binDiv.subBinDiv, valDiv, valRow);
    /*
    let { iValue: iValueNew, iBase: iBaseNew, xValue: xValueNew, xBase: xBaseNew } = divEditing;
    if (iValueNew !== undefined) iValue = iValueNew;
    if (iBaseNew !== undefined) iBase = iBaseNew;
    if (xValueNew !== undefined) xValue = xValueNew
    if (xBaseNew !== undefined) xBase = xBaseNew;
    */
    mergeValRow(valRow, divEditing.valRow);
}
