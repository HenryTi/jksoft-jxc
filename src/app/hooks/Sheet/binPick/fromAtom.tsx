import { BinPick, PickAtom } from "app/Biz";
import { useModal } from "tonwa-app";
import { PageAtomSelect } from "app/hooks/BizAtom";
import { AtomPhrase } from "app/tool";
import { useCallback } from "react";
import { NamedResults } from "./useBinPicks";

export function usePickFromAtom() {
    const modal = useModal();
    async function func(pickResults: NamedResults, binPick: BinPick) {
        let { name, caption, pick } = binPick;
        let pickBase = pick as PickAtom;
        let ret = await modal.open<AtomPhrase>(<PageAtomSelect atom={pickBase.from[0]} caption={caption ?? name} />);
        return ret as any;
    }
    return useCallback(func, []);
}
