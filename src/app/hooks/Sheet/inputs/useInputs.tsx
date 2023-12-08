import { PendInput, PendInputAtom, PendInputSpec, EntityBin } from "app/Biz";
import { useInputAtom } from "./inputAtom";
import { useInputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { NamedResults } from "../NamedResults";
import { UseInputsProps } from "../BinEditing";
import { inputDiv } from "./inputDiv";
import { ValRow } from "../tool";

export function useInputs() {
    const inputAtom = useInputAtom();
    const inputSpec = useInputSpec();
    return useCallback(async function (props: UseInputsProps): Promise<NamedResults> {
        const { binStore, binDiv, valDiv } = props;
        let ret: NamedResults = { ...props.namedResults };
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
                                binInput: input as PendInputAtom,
                            });
                            break;
                        case BizPhraseType.spec:
                            retInput = await inputSpec({
                                ...props,
                                binInput: input as PendInputSpec,
                            });
                            break;
                    }
                    if (retInput === undefined) return;
                    ret[input.name] = retInput;
                }
            }
            let valRow: ValRow = await inputDiv(binStore, p, valDiv, ret);
            if (valRow === undefined) return;
            valDiv.setValRow(valRow);
            // save detail;
        }
        return ret;
    }, []);
}
