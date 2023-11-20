import { Page } from "tonwa-app";
import { useBuildViewBiz } from "../Admin/compile";
import { centers } from "../pathes";

export function TabCode() {
    const { right, view } = useBuildViewBiz();
    return <Page header={centers.compile.caption} back="none" right={right}>
        {view}
    </Page>;
}

export function PageCode() {
    const { right, view } = useBuildViewBiz();
    return <Page header={centers.compile.caption} right={right}>
        {view}
    </Page>;
}