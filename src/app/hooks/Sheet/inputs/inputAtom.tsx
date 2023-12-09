import { useCallback } from "react";
import { PickResult } from "../NamedResults";
import { PendInputAtom } from "app/Biz";
import { InputProps } from "./inputBase";

export interface InputAtomProps extends InputProps<PendInputAtom> {
}

export async function inputAtom(props: InputAtomProps): Promise<PickResult> {
    alert('input atom');
    return;
}
