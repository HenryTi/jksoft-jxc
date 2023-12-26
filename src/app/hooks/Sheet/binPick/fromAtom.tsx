import { BinPick, PickAtom } from "app/Biz";
import { useModal } from "tonwa-app";
import { PageAtomSelect } from "app/hooks/BizAtom";
import { AtomPhrase } from "app/tool";
import { useCallback } from "react";
import { NamedResults, PickResult } from "../NamedResults";
import { DivStore } from "../store";

export function usePickFromAtom() {
    const modal = useModal();
    async function func(divStore: DivStore/* pickResults: NamedResults*/, binPick: BinPick): Promise<PickResult> {
        let { name, caption, pick } = binPick;
        let pickBase = pick as PickAtom;
        let ret = await modal.open<AtomPhrase>(<PageAtomSelect atom={pickBase.from[0]} caption={caption ?? name} />);
        return ret as PickResult;
    }
    return useCallback(func, []);
}
