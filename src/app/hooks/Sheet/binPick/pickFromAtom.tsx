import { PickAtom } from "app/Biz";
import { AtomPhrase } from "app/tool";
import { BudsEditing, PageIDSelect, PickResult } from "app/hooks";

export async function pickFromAtom(editing: BudsEditing, binPick: PickAtom): Promise<PickResult> {
    const { modal } = editing;
    let { caption, from } = binPick;
    let ret = await modal.open<AtomPhrase>(<PageIDSelect entity={from[0]} caption={caption} />);
    editing.store.cacheAtom(ret);
    return ret as any as PickResult;
}
