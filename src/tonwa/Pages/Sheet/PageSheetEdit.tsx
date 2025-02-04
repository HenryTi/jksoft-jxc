import React, { useState, JSX, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useAtomValue } from "jotai";
import { Page, PageConfirm } from "tonwa-app";
import { env, FA, SpinnerSmall, theme } from "tonwa-com";
import { BizBud } from "../../Biz";
import { Toolbar, ToolItem, ViewReaction } from "../../View";
import { setAtomValue, getAtomValue } from "../../tools";
import { buttonDefs, headerSheet } from "./HeaderSheet";
import { SubmitState } from "./ControllerSheet";
import { ControllerSheetEdit } from "./ControllerSheetEdit";
import { ViewSheetContent } from "./ViewSheetContent";
import { useSiteRole } from "../../Site";
import { detailNewLoop } from "./detailNew";

export function PageSheetEdit({ controller }: { controller: ControllerSheetEdit; }) {
    const { modal, storeSheet, mainStore, binStore, atomReaction, atomSubmitState } = controller;
    const { caption } = storeSheet;
    const [editable, setEditable] = useState(true);
    let submitState = useAtomValue(atomSubmitState);
    let useSiteRoleReturn = useSiteRole();
    let { isAdmin } = useSiteRoleReturn.userSite;
    async function onSubmit() {
        setEditable(false);
        await controller.onSubmit();
        setEditable(true);
    }

    async function onDiscardSheet() {
        let message = `${caption} ${mainStore.no} 真的要作废吗？`;
        let ret = await modal.open(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await controller.onDiscard();
        }
    }
    async function onExit() {
        controller.closeModal();
    }

    // let { id } = useAtomValue(mainStore._valRow);
    let btnExit = buttonDefs.exit(onExit, false);
    let headerGroup = [btnExit];
    let toolGroups: (ToolItem[] | JSX.Element)[];
    let reaction = <ViewReaction atomContent={atomReaction} />;

    function mainOnlyEdit() {
        let btnSubmit = buttonDefs.submit(onSubmit);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, true, editable === false);
        toolGroups = [[btnSubmit], reaction, null, [btnDiscard]];
    }

    function mainDetailEdit() {
        const { entity: entityBin } = binStore;
        async function onAddRow() {
            await detailNewLoop(storeSheet);
        }
        let submitHidden: boolean;
        submitHidden = false;
        let submitDisabled = (function () {
            submitState = getAtomValue(atomSubmitState);
            return submitState === SubmitState.none || submitState === SubmitState.disable;
        })();
        let btnSubmit = buttonDefs.submit(onSubmit, submitDisabled, submitHidden);
        let btnAddDetail = entityBin.pend === undefined ?
            buttonDefs.addDetail(onAddRow) : buttonDefs.addPend(onAddRow);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, false, editable === false);
        let leftGroup = [btnAddDetail];
        leftGroup.push(btnSubmit);
        toolGroups = [leftGroup, reaction, null, [btnDiscard]];
    }

    if (binStore === undefined) mainOnlyEdit();
    else mainDetailEdit();
    let { header, top, right } = headerSheet({ store: storeSheet, toolGroups, headerGroup });
    return <Page header={header} back={null}
        top={top}
        right={right}
    >
        <ViewSheetContent controller={controller} readonly={false} />
    </Page>;
}
