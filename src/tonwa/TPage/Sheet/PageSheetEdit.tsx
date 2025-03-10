import { useState, JSX } from "react";
import { useAtomValue } from "jotai";
import { Page, PageConfirm } from "tonwa-app";
import { EnumToolButtonState, ToolButton, ToolItem, ViewReaction } from "../../View";
import { getAtomValue } from "../../tools";
import { buttonDefs, headerSheet } from "./HeaderSheet";
import { SubmitState } from "./TControlSheet";
import { useSiteRole } from "../../Site";
import { ControlSheetEdit } from "../../Control";
import { ViewSheetEdit } from "./ViewSheetEdit";

export function PageSheetEdit({ control }: { control: ControlSheetEdit; }) {
    const { modal, storeSheet, mainStore, binStore, atomReaction, atomSubmitState, atomError } = control;
    const { caption } = storeSheet;
    const [editable, setEditable] = useState(true);
    let error = useAtomValue(atomError);
    let submitState = useAtomValue(atomSubmitState);
    let useSiteRoleReturn = useSiteRole();
    let { isAdmin } = useSiteRoleReturn.userSite;
    async function onSubmit() {
        setEditable(false);
        await control.onSubmit();
        setEditable(true);
    }

    async function onDiscardSheet() {
        let message = `${caption} ${mainStore.no} 真的要作废吗？`;
        let ret = await modal.open(<PageConfirm header="确认" message={message} yes="单据作废" no="不作废" />);
        if (ret === true) {
            await control.onDiscard();
        }
    }
    async function onExit() {
        control.closeModal();
    }

    // let { id } = useAtomValue(mainStore._valRow);
    let btnExit = buttonDefs.exit(onExit, false);
    let headerGroup = [btnExit];
    let toolGroups: (ToolItem[] | JSX.Element)[];
    let reaction = <ViewReaction atomContent={atomReaction} />;

    let btnSubmit: ToolButton;
    function mainOnlyEdit() {
        btnSubmit = buttonDefs.submit(onSubmit);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, true, editable === false);
        toolGroups = [[btnSubmit], reaction, null, [btnDiscard]];
    }

    function mainDetailEdit() {
        const { controlDetailEdit } = control;
        const { entity: entityBin } = binStore;
        const { onAddRow } = controlDetailEdit;
        let submitHidden: boolean;
        submitHidden = false;
        let submitDisabled = (function () {
            submitState = getAtomValue(atomSubmitState);
            return submitState === SubmitState.none || submitState === SubmitState.disable;
        })();
        btnSubmit = buttonDefs.submit(onSubmit, submitDisabled, submitHidden);
        let btnAddDetail = entityBin.pend === undefined ?
            buttonDefs.addDetail(onAddRow) : buttonDefs.addPend(onAddRow);
        let btnDiscard = buttonDefs.discard(onDiscardSheet, false, editable === false);
        let leftGroup = [btnAddDetail];
        leftGroup.push(btnSubmit);
        toolGroups = [leftGroup, reaction, null, [btnDiscard]];
    }

    if (binStore === undefined) mainOnlyEdit();
    else mainDetailEdit();
    if (error !== undefined) btnSubmit.state = EnumToolButtonState.error;
    let { header, top, right } = headerSheet({ store: storeSheet, toolGroups, headerGroup });
    return <Page header={header} back={null}
        top={top}
        right={right}
    >
        <ViewSheetEdit control={control} readonly={false} />
    </Page>;
}
