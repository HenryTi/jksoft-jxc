import { EntityAtom } from "app/Biz";
import { ViewAtom, useSelectAtom } from "../BizAtom";
import { useCallback } from "react";
import { AtomPhrase } from "app/tool";

export function usePickAtom() {
    const selectAtom = useSelectAtom();
    async function pickAtom(atom: EntityAtom, viewTop: any): Promise<{ retAtom: AtomPhrase; retViewTop: any; }> {
        let retAtom = await selectAtom(atom, [], viewTop);
        if (retAtom === undefined) return;
        let retViewTop = <div>
            {viewTop}
            <ViewAtom value={retAtom} />
        </div>;
        return {
            retAtom,
            retViewTop,
        };
    }
    return useCallback(pickAtom, []);
}
