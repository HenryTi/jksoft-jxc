import { Page } from "tonwa-app";
import { buildViewBiz } from "../Admin/compile";
import { centers } from "../pathes";

export function TabCode() {
    const { right, view } = buildViewBiz();
    return <Page header={centers.compile.caption} back="none" right={right}>
        {view}
    </Page>;
}

export function PageCode() {
    const { right, view } = buildViewBiz();
    return <Page header={centers.compile.caption} right={right}>
        {view}
    </Page>;
}