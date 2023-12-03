import { PendInput, PendInputAtom, PendInputSpec, EntityBin } from "app/Biz";
import { useInputAtom } from "./inputAtom";
import { useInputSpec } from "./inputSpec";
import { useCallback } from "react";
import { BizPhraseType } from "uqs/UqDefault";
import { PendBandEditProps } from "../tool";
import { NamedResults } from "../NamedResults";

export interface InputProps<T extends PendInput = any> extends PendBandEditProps {
    binInput: T;
}

export function usePendInputs(bin: EntityBin) {
    const inputAtom = useInputAtom();
    const inputSpec = useInputSpec();
    return useCallback(async function (props: InputProps<any>): Promise<NamedResults> {
        const { inputs } = bin;
        if (inputs === undefined) return;
        let ret: NamedResults = { ...props.namedResults };
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
                        // base: 1,
                        //entitySpec, 
                        // viewTop: undefined,
                        // buttonCaption: undefined,
                        // buttonClassName: undefined,
                    });
                    break;
            }
            if (retInput === undefined) return;
            ret[input.name] = retInput;
        }
        return ret;
    }, []);
}
