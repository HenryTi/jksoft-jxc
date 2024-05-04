import { routePageAdmin } from "./PageAdmin";
import { routeAchieve } from "./achieve";
import { UqApp } from "app/UqApp";
import { routeUserSum } from "./userSum";
import { routeCompile } from "./compile";
import { routeUsers } from "./users";

export function routeAdmin(uqApp: UqApp) {
    return <>
        {routePageAdmin}
        {routeAchieve}
        {routeCompile}
        {routeUsers}
        {routeUserSum}
    </>;
}
