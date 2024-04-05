import { PickResult } from "../../store";
import { PendInputAtom } from "app/Biz";
import { InputProps } from "./inputBase";

export interface InputAtomProps extends InputProps<PendInputAtom> {
}

export async function inputAtom(props: InputAtomProps): Promise<PickResult> {
    alert('input atom');
    return;
}
