import { Page } from "tonwa-app";
import { buildViewBiz } from "../Admin/compile";
import { centers } from "../pathes";

export function TabBiz() {
    const { right, view } = buildViewBiz();
    return <Page header={centers.compile.caption} back="none" right={right}>
        {view}
    </Page>;
}
