import { useParams } from "react-router-dom";
import { Page, useModal } from "tonwa-app";
import { from62 } from "tonwa-com";
import { ControllerSheetDash } from "../../Controller";
import { useBiz } from "../../Hooks";
import { EntitySheet } from "../../Biz";
import { useMemo } from "react";

export function PageSheetDash() {
    const modal = useModal();
    const biz = useBiz();
    const params = useParams();
    const { sheet } = params;
    const sheetId = Number(sheet); //from62(sheet);
    const entitySheet = biz.entityFromId(sheetId) as EntitySheet;
    const sheetDashController = useMemo(() => new ControllerSheetDash(modal, biz, entitySheet), []);
    function onClick() {
        sheetDashController.openPageSheetNew();
    }
    return <Page header="sheet dashboard">
        <div>{sheetDashController.entitySheet.caption}</div>
        <div>{sheetDashController.keyId}</div>
        <button onClick={onClick}>click</button>
    </Page>
}
