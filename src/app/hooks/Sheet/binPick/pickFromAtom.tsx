import { AtomData, PickAtom } from "tonwa";
import { PageIDSelect } from "app/hooks";
import { FormBudsStore, PickResult } from "app/Store";

export async function pickFromAtom(editing: FormBudsStore, binPick: PickAtom): Promise<PickResult> {
    const { modal } = editing;
    let { caption, from } = binPick;
    let ret = await modal.open<AtomData>(<PageIDSelect entity={from[0]} caption={caption} />);
    editing.store.cacheAtom(ret);
    return ret as any as PickResult;
}
