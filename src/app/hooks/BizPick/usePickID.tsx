import { AtomData, EntityID } from "tonwa";
import { ViewAtom } from "../BizAtom";
import { useCallback } from "react";
import { useIDSelect } from "./PageIDSelect";

export function usePickID() {
    const IDSelect = useIDSelect();
    return useCallback(async function (ID: EntityID, viewTop: any): Promise<{ retID: AtomData; retViewTop: any; }> {
        let retID = await IDSelect(ID, [], viewTop);
        if (retID === undefined) return;
        let retViewTop = <div>
            {viewTop}
            <ViewAtom value={retID} />
        </div>;
        return {
            retID,
            retViewTop,
        };
    }, []);
}
