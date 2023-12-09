import { useCallback } from "react";
import { CoreDetail, Row, Section } from "../store";

export function useCoreDetailEdit(coreDetail: CoreDetail) {
    async function edit(section: Section, row: Row) {
    }
    return useCallback(edit, []);
}
