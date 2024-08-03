import { PickAtom } from "app/Biz";
import { AtomPhrase } from "app/tool";
import { BudsEditing, PageIDSelect, PickResult } from "app/hooks";

/*
export function usePickFromAtom() {
    const modal = useModal();
    async function func(divStore: BinStore, namedResults: NamedResults, binPick: PickAtom): Promise<PickResult> {
        let { name, caption, from } = binPick;
        let ret = await modal.open<AtomPhrase>(<PageIDSelect entity={from[0]} caption={caption ?? name} />);
        return ret as PickResult;
    }
    return useCallback(func, []);
}
*/
export async function pickFromAtom(editing: BudsEditing, binPick: PickAtom): Promise<PickResult> {
    const { modal } = editing;
    let { caption, from } = binPick;
    let ret = await modal.open<AtomPhrase>(<PageIDSelect entity={from[0]} caption={caption} />);
    return ret as any as PickResult;
}
