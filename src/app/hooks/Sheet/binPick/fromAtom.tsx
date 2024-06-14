import { PickAtom } from "app/Biz";
import { useModal } from "tonwa-app";
import { AtomPhrase } from "app/tool";
import { useCallback } from "react";
import { NamedResults, PickResult } from "../store";
import { DivStore } from "../store";
import { PageIDSelect } from "app/hooks";

export function usePickFromAtom() {
    const modal = useModal();
    async function func(divStore: DivStore, namedResults: NamedResults, binPick: PickAtom): Promise<PickResult> {
        let { name, caption, from } = binPick;
        let ret = await modal.open<AtomPhrase>(<PageIDSelect entity={from[0]} caption={caption ?? name} />);
        return ret as PickResult;
    }
    return useCallback(func, []);
}
