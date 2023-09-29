import { Page } from "tonwa-app";
import { buildViewBiz, captionCompile } from "../Admin/compile";

export function TabBiz() {
    const { right, view } = buildViewBiz();
    return <Page header={captionCompile} back="none" right={right}>
        {view}
    </Page>;
}
