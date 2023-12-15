import { PendInput, PendInputAtom, PendInputSpec, EntityBin, BinRow } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { NamedResults } from "../NamedResults";
import { DivEditing, UseInputsProps, ValDiv } from "../store";
import { InputDivProps, inputDiv } from "./inputDiv";
import { ValRow } from "../tool";
import { useUqApp } from "app";
import { useModal } from "tonwa-app";
import { getMockId } from "../binEdit/model";

export function useInputs() {
    const uqApp = useUqApp();
    const modal = useModal();
    return useCallback(async function (props: UseInputsProps): Promise<ValDiv> {
        let { divStore, pendRow, binDiv } = props;
        const { namedResults } = divStore;
        // let nr: NamedResults = { ...namedResults };
        let valDiv: ValDiv, ret: ValDiv, parent: ValDiv;
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
                // valDiv,
                binRow,
                // namedResults: nr,
                modal,
                uqApp,
            }
            let retBinRow: BinRow = await inputDiv(inputDivProps);
            if (retBinRow === undefined) return;
            // let vd = valDiv;
            // vd.setValRow(valRow);
            mergeBinRow(binRow, retBinRow);
            let origin = valDiv === undefined ? pendRow.origin : valDiv.id;
            let id = getMockId();
            valDiv = new ValDiv(p, { ...binRow, id, pend: pendRow.pend, origin });
            divStore.setValColl(valDiv);
            if (ret === undefined) {
                parent = ret = valDiv;
            }
            else {
                parent.setValDiv(valDiv);
            }
            parent = valDiv;
            // save detail;
        }
        return ret;
    }, []);
}

function mergeBinRow(dest: BinRow, src: BinRow) {
    /*
    id: number;
    i?: number;
    x?: number;
    value?: number;
    price?: number;
    amount?: number;
    buds?: { [bud: number]: string | number };
    owned?: { [bud: number]: [number, BudValue][] };
    */
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
