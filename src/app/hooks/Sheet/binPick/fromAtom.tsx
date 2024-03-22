import { BinPick, PickAtom } from "app/Biz";
import { useModal } from "tonwa-app";
import { PageAtomSelect } from "app/hooks/BizAtom";
import { AtomPhrase } from "app/tool";
import { useCallback } from "react";
import { NamedResults, PickResult } from "../store";
import { DivStore } from "../store";

export function usePickFromAtom() {
    const modal = useModal();
    async function func(divStore: DivStore, namedResults: NamedResults, binPick: BinPick): Promise<PickResult> {
        let { name, caption, from } = binPick as PickAtom;
        // let pickBase = pick as PickAtom;
        let ret = await modal.open<AtomPhrase>(<PageAtomSelect atom={from[0]} caption={caption ?? name} />);
        return ret as PickResult;
    }
    return useCallback(func, []);
}
