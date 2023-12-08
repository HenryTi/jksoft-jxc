import { useCallback } from "react";
import { PickResult } from "../NamedResults";
import { PendInputAtom } from "app/Biz";
import { InputProps } from "./input";

export interface InputAtomProps extends InputProps<PendInputAtom> {
}

export function useInputAtom() {
    async function func(props: InputAtomProps): Promise<PickResult> {
        alert('input atom');
        return;
    }
    return useCallback(func, []);
}
