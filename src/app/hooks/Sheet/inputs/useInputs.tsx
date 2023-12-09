import { PendInput, PendInputAtom, PendInputSpec, EntityBin } from "app/Biz";
import { inputAtom } from "./inputAtom";
import { inputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { NamedResults } from "../NamedResults";
import { UseInputsProps } from "../store";
import { InputDivProps, inputDiv } from "./inputDiv";
import { ValRow } from "../tool";
import { useUqApp } from "app";
import { useModal } from "tonwa-app";

export function useInputs() {
    const uqApp = useUqApp();
    const modal = useModal();
    return useCallback(async function (props: UseInputsProps): Promise<NamedResults> {
        const { binDiv, valDiv } = props;
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
                    ret[input.name] = retInput;
                }
            }
            const inputDivProps: InputDivProps = {
                ...props,
                binDiv: p,
                valDiv,
                namedResults: ret,
                modal,
                uqApp,
            }
            let valRow: ValRow = await inputDiv(inputDivProps);
            if (valRow === undefined) return;
            if (valDiv !== undefined) {
                valDiv.setValRow(valRow);
            }
            // save detail;
        }
        return ret;
    }, []);
}
