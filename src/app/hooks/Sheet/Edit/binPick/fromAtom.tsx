import { BinPick, PickAtom } from "app/Biz";
import { useModal } from "tonwa-app";
import { PageAtomSelect } from "app/hooks/BizAtom";
import { AtomPhrase } from "app/tool";
import { useCallback } from "react";
import { PickResults } from "./useBinPicks";

export function usePickFromAtom() {
    const modal = useModal();
    async function func(pickResults: PickResults, binPick: BinPick) {
        let { name, caption, pick } = binPick;
        let pickBase = pick as PickAtom;
        let ret = await modal.open<AtomPhrase>(<PageAtomSelect atomName={pickBase.from[0].phrase} caption={caption ?? name} />);
        if (ret === undefined) return false;
        pickResults.props[name] = ret;
        return true;
    }
    return useCallback(func, []);
}
