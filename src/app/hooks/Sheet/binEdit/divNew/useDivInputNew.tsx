import { PendInputAtom, PendInputSpec, BinRow } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, UseInputsProps, ValDiv, ValDivBase, ValDivRoot } from "../../store";
import { InputDivProps, inputDiv } from "./inputDiv";
import { useUqApp } from "app";
import { useModal } from "tonwa-app";
import { PendProxyHander, ValRow, mergeValRow } from "../../store";
import { NamedResults } from "../../store";
import { getAtomValue } from "tonwa-com";

export function useDivInputNew() {
    const uqApp = useUqApp();
    const modal = useModal();
    return useCallback(async function (props: UseInputsProps, skipInputs: boolean = false): Promise<ValDivBase> {
        let { divStore, pendRow, binDiv, val0Div } = props;
        let { entityBin } = divStore;
        let { rearPick } = entityBin;
        let namedResults: NamedResults = {
            [rearPick.name]: new Proxy(pendRow, new PendProxyHander(entityBin.pend)),
        };
        let valRowInit: ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
        let divEditingFromPend = new DivEditing(divStore, namedResults, binDiv, val0Div, valRowInit);
        let valRow = divEditingFromPend.valRow; // : ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
        let ret: ValDivBase, parents: ValDivBase[] = [], parent: ValDivBase;
        let valDiv: ValDivBase = val0Div;
        for (let p = binDiv; p !== undefined; p = p.subBinDiv) {
            if (valDiv === undefined) {
                debugger;
                console.error('valDiv impossible to be undefined')
            }

            let iValue: number, iBase: number, xValue: number, xBase: number;

            const { inputs } = p;
            if (inputs !== undefined && skipInputs !== true) {
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
                    if (retInput === undefined) return;
                    namedResults[input.name] = retInput;
                }
                let divEditing = new DivEditing(divStore, namedResults, binDiv.subBinDiv, valDiv, valRow);
                let { iValue: iValueNew, iBase: iBaseNew, xValue: xValueNew, xBase: xBaseNew } = divEditing;
                if (iValueNew !== undefined) iValue = iValueNew;
                if (iBaseNew !== undefined) iBase = iBaseNew;
                if (xValueNew !== undefined) xValue = xValueNew
                if (xBaseNew !== undefined) xBase = xBaseNew;
                mergeValRow(valRow, divEditing.valRow);
            }
            let origin = valDiv === undefined ? pendRow.origin : valDiv.id;
            valRow.origin = origin;
            valRow.pend = pendRow.pend;
            valRow.pendValue = pendRow.value;
            const inputDivProps: InputDivProps = {
                ...props,
                binDiv: p,
                valRow,
                modal,
                namedResults,
            }
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
            if (skipInputs !== true) {
                let retValRow: ValRow = await inputDiv(inputDivProps);
                if (retValRow === undefined) return;
                mergeValRow(valRow, retValRow);
            }
            // save detail;
            let id = await divStore.saveDetail(p, valRow);
            valRow.id = id;
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
            parent = ret = valDiv;
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
        }
        return ret;
    }, []);
}
