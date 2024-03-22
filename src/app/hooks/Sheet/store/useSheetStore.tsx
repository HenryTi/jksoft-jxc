import { SheetStore } from "./SheetStore";
import { from62 } from "tonwa-com";
import { useNavigate, useParams } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { useMemo, useRef } from "react";
import { EntitySheet } from "app/Biz";

export function useSheetStore() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    // const sheetId = from62(id);

    const refSheetStore = useRef(new SheetStore(
        uq,
        biz,
        entitySheet,
        // sheetId
    ));
    return refSheetStore.current;
}

export function useSheetHeader(sheetStore: SheetStore) {
    const { entitySheet } = sheetStore;
    const { name, caption } = entitySheet;
    return {
        header: caption ?? name,
        back: 'file-text-o',
    }
}