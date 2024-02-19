import { SheetStore } from "./store";
import { from62 } from "tonwa-com";
import { useNavigate, useParams } from "react-router-dom";
import { useUqApp } from "app/UqApp";
import { useMemo } from "react";
import { EntitySheet } from "app/Biz";
import { ToolButton, Toolbar } from "./Toolbar";

export function useSheet() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const { sheet: entityId62, id } = useParams();
    const navigate = useNavigate();
    const entitySheet = biz.entityFrom62<EntitySheet>(entityId62);
    const { name, caption } = entitySheet;
    const sheetId = from62(id);
    const sheetStore = new SheetStore(
        uq,
        biz,
        entitySheet,
        sheetId
    );

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
    return ret;
}
