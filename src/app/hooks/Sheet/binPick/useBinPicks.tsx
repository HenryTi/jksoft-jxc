import { BinPick, EntityBin } from "app/Biz";
import { BizPhraseType } from "uqs/UqDefault";
import { useCallback } from "react";
import { usePickFromAtom } from "./fromAtom";
import { usePickFromSpec } from "./fromSpec";
import { usePickFromPend } from "./fromPend";
import { usePickFromQuery } from "./fromQuery";
import { BinRow } from "../SheetStore";

export type PickResult = { [prop: string]: any };
export interface NamedResults {
    [name: string]: PickResult | (PickResult[]);
}

export type ReturnUseBinPicks = [NamedResults, BinPick, PickResult | PickResult[]];

export enum PickResultType {
    single,
    multiple,
}

export function useBinPicks(bin: EntityBin, sheetBinRow?: BinRow) {
    const { picks: binPicks } = bin;
    const pickFromAtom = usePickFromAtom();
    const pickFromSpec = usePickFromSpec();
    const pickFromPend = usePickFromPend();
    const pickFromQuery = usePickFromQuery();

    // if no detailSection add new, else edit
    return useCallback(async function pick(pickResultType: PickResultType = PickResultType.multiple) {
        if (binPicks === undefined) return;
        let namedResults: NamedResults = {
            '%sheet': sheetBinRow ?? {},
        };
        let pickResult: PickResult | (PickResult[]);
        let lastBinPick: BinPick;
        for (const binPick of binPicks) {
            const { name, pick } = binPick;
            const { bizPhraseType } = pick;
            if (bizPhraseType === undefined) break;
            switch (bizPhraseType) {
                default: break;
                case BizPhraseType.atom:
                    pickResult = await pickFromAtom(namedResults, binPick);
                    break;
                case BizPhraseType.spec:
                    pickResult = await pickFromSpec(namedResults, binPick);
                    break;
                case BizPhraseType.query:
                    pickResult = await pickFromQuery(namedResults, binPick, pickResultType);
                    break;
                case BizPhraseType.pend:
                    pickResult = await pickFromPend(namedResults, binPick);
                    break;
            }
            if (pickResult === undefined) return undefined;
            lastBinPick = binPick;
            namedResults[name] = pickResult;
        }
        return [namedResults, lastBinPick, pickResult] as ReturnUseBinPicks;
    }, []);
}
