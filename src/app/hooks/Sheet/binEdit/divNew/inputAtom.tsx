import { PickResult } from "../../store";
import { BinInputAtom } from "app/Biz";
import { InputProps } from "./inputBase";

export interface InputAtomProps extends InputProps<BinInputAtom> {
}

export async function inputAtom(props: InputAtomProps): Promise<PickResult> {
    alert('input atom');
    return;
}
