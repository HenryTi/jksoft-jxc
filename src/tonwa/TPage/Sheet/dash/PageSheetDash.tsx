import { useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { from62 } from "tonwa-com";
import { EntitySheet } from "../../../Biz";
import { useBiz } from "../../../Hooks";
import { ViewStateStart } from "./ViewStateStart";
import { ViewStateTabs } from "./ViewStateTabs";

export function PageSheetDash() {
    const biz = useBiz();
    const params = useParams();
    const { sheet } = params;
    const sheetId = from62(sheet);
    const entitySheet = biz.entityFromId(sheetId) as EntitySheet;
    const { states, caption } = entitySheet;
    let pageHeader = caption + ' - 工作台';
    let viewContent: any;
    if (states === undefined) {
        viewContent = <ViewStateStart entitySheet={entitySheet} />;
    }
    else {
        viewContent = <ViewStateTabs entitySheet={entitySheet} />;
    }
    return <Page header={pageHeader}>
        {viewContent}
    </Page>
}
