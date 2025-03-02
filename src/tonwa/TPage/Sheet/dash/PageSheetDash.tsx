import { useMemo, useState } from "react";
import { useAtomValue } from "jotai";
import { useParams } from "react-router-dom";
import { Page, PageSpinner, useModal } from "tonwa-app";
import { FA, from62, List, useEffectOnce } from "tonwa-com";
import { EntitySheet } from "../../../Biz";
import { BinData, getUserBudValue, SheetData } from "../../../Store";
import { ControlBiz } from "../../../Control";
import { useSiteRole } from "../../../Site";
import { useBiz } from "../../../Hooks";
import { ViewBud, ViewReaction, ViewNotifyCount, ViewItemMain } from "../../../View";
import { TControlSheetDash } from "../TControlSheetDash";
import { TControlBiz } from "../TControlBiz";
import { ViewStateStart } from "./ViewStateStart";
import { ViewStateTabs } from "./ViewStateTabs";

export function PageSheetDash() {
    const modal = useModal();
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
