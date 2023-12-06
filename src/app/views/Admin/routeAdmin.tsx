import { routePageAdmin } from "./PageAdmin";
import { routeAchieve } from "./achieve";
import { UqApp } from "app/UqApp";
import { routeUser } from "./user";
import { routeCompile } from "./compile";

export function routeAdmin(uqApp: UqApp) {
    return <>
        {routePageAdmin}
        {routeAchieve}
        {routeCompile}
        {routeUser}
    </>;
}
