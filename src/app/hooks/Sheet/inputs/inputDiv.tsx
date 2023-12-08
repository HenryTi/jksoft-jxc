import { BinDiv } from "app/Biz";
import { BinStore, ValDiv } from "../BinEditing";
import { NamedResults } from "../NamedResults";
import { getAtomValue } from "tonwa-com";
import { Calc } from "app/hooks";
import { ValRow } from "../tool";

export async function inputDiv(binStore: BinStore, binDiv: BinDiv, valDiv: ValDiv, namedResults: NamedResults): Promise<ValRow> {
    const { buds } = binDiv;
    let { atomValRow } = valDiv;
    let valRow = getAtomValue(atomValRow);
    const { id, pend, origin } = valRow;
    let retValRow: ValRow = {
        id,
        pend,
        origin,
    };
    Calc
    return retValRow;
}
