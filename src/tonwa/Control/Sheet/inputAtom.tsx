import { PickResult } from "../../Store";
import { BinInputAtom } from "../../Biz";
import { InputProps } from "./inputBase";

export interface InputAtomProps extends InputProps<BinInputAtom> {
}

export async function inputAtom(props: InputAtomProps): Promise<PickResult> {
    alert('input atom');
    return;
}
