import { PendInputAtom, PendInputSpec, BinRow } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, UseInputsProps, ValDiv } from "../store";
import { InputDivProps, inputDiv } from "./inputDiv";
import { useUqApp } from "app";
import { useModal } from "tonwa-app";
import { PendProxyHander, ValRow } from "../tool";
import { NamedResults } from "../NamedResults";
import { getAtomValue } from "tonwa-com";

export function useInputs() {
    const uqApp = useUqApp();
    const modal = useModal();
    return useCallback(async function (props: UseInputsProps): Promise<ValDiv> {
        let { divStore, pendRow, binDiv, valDiv } = props;
        let { entityBin } = divStore;
        let { rearPick } = entityBin;
        let namedResults: NamedResults = {
            [rearPick.name]: new Proxy(pendRow, new PendProxyHander(entityBin.pend)),
        };
        let ret: ValDiv, parent: ValDiv;
        let valRow: ValRow = { id: undefined, buds: {}, owned: {}, pend: undefined };
        if (valDiv !== undefined) {
            let { atomValRow } = valDiv;
            let valDivRow = getAtomValue(atomValRow);
            mergeValRow(valRow, valDivRow);
            valRow.id = undefined;
        }
        for (let p = binDiv; p !== undefined; p = p.div) {
            const { inputs } = p;
            if (inputs !== undefined) {
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
                let divEditing = new DivEditing(divStore, namedResults, binDiv.div, valDiv, valRow);
                mergeValRow(valRow, divEditing.valRow);
            }
            const inputDivProps: InputDivProps = {
                ...props,
                binDiv: p,
                valRow: valRow,
                modal,
                uqApp,
                namedResults,
            }
            let retValRow: ValRow = await inputDiv(inputDivProps);
            if (retValRow === undefined) return;
            mergeValRow(valRow, retValRow);
            let origin = valDiv === undefined ? pendRow.origin : valDiv.id;
            valRow.origin = origin;
            valRow.pend = pendRow.pend;
            // save detail;
            let id = await divStore.saveDetail(p, valRow);

            valDiv = new ValDiv(p, { ...valRow, id, pend: pendRow.pend, origin });
            divStore.setValColl(valDiv);
            if (ret === undefined) {
                parent = ret = valDiv;
            }
            else {
                parent.setIXBase(valRow);
                parent.addValDiv(valDiv);
                parent = valDiv;
            }
        }
        return ret;
    }, []);
}

function mergeValRow(dest: ValRow, src: ValRow) {
    if (src === undefined) return;
    const { id, i, x, value, price, amount, buds, owned, pend, pendValue, origin } = src;
    dest.id = id;
    dest.i = i;
    dest.x = x;
    dest.value = value;
    dest.price = price;
    dest.amount = amount;
    if (buds !== undefined) Object.assign(dest.buds, buds);
    if (owned !== undefined) Object.assign(dest.owned, owned);
    dest.pend = pend;
    dest.pendValue = pendValue;
    dest.origin = origin;
}
