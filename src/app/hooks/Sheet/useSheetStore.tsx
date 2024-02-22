import { SheetStore } from "./store";
import { from62 } from "tonwa-com";
import { useNavigate, useParams } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { useMemo, useRef } from "react";
import { EntitySheet } from "app/Biz";

export function useSheetStore() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    // const navigate = useNavigate();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const sheetId = from62(id);
    /*
    const { name, caption } = entitySheet;
    const sheetStore = new SheetStore(
        uq,
        biz,
        entitySheet,
        sheetId
    );
    */
    /*
    async function onSubmit() {
    }

    async function onDiscard() {

    }

    async function onExit() {
        navigate(-1);
    }

    const btnSubmit: ToolButton = { caption: '提交', icon: 'send-o', act: onSubmit };
    const btnDiscard: ToolButton = { caption: '作废', act: onDiscard };
    const btnExit: ToolButton = { caption: '退出', act: onExit };
    const groups: ToolButton[][] = [
        [btnSubmit,],
        null,
        [btnDiscard, btnExit,]
    ];
    const toolbar = <Toolbar groups={groups} />;
    const ret = useMemo(() => ({
        sheetStore,
        toolbar,
        groups,
        buttons: {
            submit: btnSubmit,
            discard: btnDiscard,
            exit: btnExit,
        },
        header: caption ?? name,
        back: 'file-text-o',
    }), []);
    */
    const refSheetStore = useRef(new SheetStore(
        uq,
        biz,
        entitySheet,
        sheetId
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