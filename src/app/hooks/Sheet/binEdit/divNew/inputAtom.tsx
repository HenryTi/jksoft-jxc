import { BinInputAtom } from "app/Biz";
import { InputProps } from "./inputBase";
import { PickResult } from "app/hooks/Calc";

export interface InputAtomProps extends InputProps<BinInputAtom> {
}

export async function inputAtom(props: InputAtomProps): Promise<PickResult> {
    alert('input atom');
    return;
}
