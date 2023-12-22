import { PendInputAtom, PendInputSpec, BinRow } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { DivEditing, UseInputsProps, ValDiv } from "../store";
import { InputDivProps, inputDiv } from "./inputDiv";
import { useUqApp } from "app";
import { useModal } from "tonwa-app";

export function useInputs() {
    const uqApp = useUqApp();
    const modal = useModal();
    return useCallback(async function (props: UseInputsProps): Promise<ValDiv> {
        let { divStore, pendRow, binDiv, valDiv } = props;
        let { namedResults, entityBin } = divStore;
        let { rearPick } = entityBin;
        if (namedResults === undefined) {
            divStore.namedResults = namedResults = {};
        }
        namedResults[rearPick.name] = pendRow;
        let ret: ValDiv, parent: ValDiv;
        let binRow: BinRow = { id: undefined, buds: {}, owned: {} };
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
                let divEditing = new DivEditing(divStore, binDiv.div, binRow);
                mergeBinRow(binRow, divEditing.binRow);
            }
            const inputDivProps: InputDivProps = {
                ...props,
                binDiv: p,
                binRow,
                modal,
                uqApp,
            }
            let retBinRow: BinRow = await inputDiv(inputDivProps);
            if (retBinRow === undefined) return;
            mergeBinRow(binRow, retBinRow);
            let origin = valDiv === undefined ? pendRow.origin : valDiv.id;

            // save detail;
            let id = await divStore.saveDetail(p, binRow, pendRow.pend, origin);

            valDiv = new ValDiv(p, { ...binRow, id, pend: pendRow.pend, origin });
            divStore.setValColl(valDiv);
            if (ret === undefined) {
                parent = ret = valDiv;
            }
            else {
                parent.setIXBase(binRow);
                parent.addValDiv(valDiv);
            }
            parent = valDiv;
        }
        return ret;
    }, []);
}

function mergeBinRow(dest: BinRow, src: BinRow) {
    if (src === undefined) return;
    const { id, i, x, value, price, amount, buds, owned } = src;
    dest.id = id;
    dest.i = i;
    dest.x = x;
    dest.value = value;
    dest.price = price;
    dest.amount = amount;
    if (buds !== undefined) Object.assign(dest.buds, buds);
    if (owned !== undefined) Object.assign(dest.owned, owned);
}
