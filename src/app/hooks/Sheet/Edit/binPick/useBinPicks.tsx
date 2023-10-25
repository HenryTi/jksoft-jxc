import { EntityBin } from "app/Biz";
import { BizPhraseType } from "uqs/UqDefault";
import { useCallback } from "react";
import { usePickFromAtom } from "./fromAtom";
import { usePickFromSpec } from "./fromSpec";
import { usePickFromPend } from "./fromPend";
import { usePickFromQuery } from "./fromQuery";
import { CoreDetail } from "../SheetStore";

export type PickResult = { [prop: string]: any };
export interface PickResults {
    [name: string]: PickResult;
}

export function useBinPicks(bin: EntityBin) {
    const { picks: binPicks } = bin;
    const pickFromAtom = usePickFromAtom();
    const pickFromSpec = usePickFromSpec();
    const pickFromPend = usePickFromPend();
    const pickFromQuery = usePickFromQuery();

    // if no detailSection add new, else edit
    return useCallback(async function pick(coreDetail: CoreDetail) {
        if (binPicks === undefined) return;
        let results: { [pick: string]: PickResult } = {};
        for (const binPick of binPicks) {
            const { name, pick } = binPick;
            const { bizPhraseType } = pick;
            let picked: any;
            switch (bizPhraseType) {
                default: debugger;
                case BizPhraseType.atom: picked = await pickFromAtom(results, binPick); break;
                case BizPhraseType.spec: picked = await pickFromSpec(results, binPick); break;
                case BizPhraseType.query: picked = await pickFromQuery(results, binPick); break;
                case BizPhraseType.pend: picked = await pickFromPend(results, binPick, coreDetail); break;
            }
            if (picked === undefined) return undefined;
            results[name] = picked;
        }
        return results;
    }, []);
}
