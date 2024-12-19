import { Page, useModal } from "tonwa-app";
import { Cmd } from "./Cmd";
import { PageSites } from "./PageSites";
import { Sep } from "tonwa-com";
import { ViewOwner } from "../owner";
import { ViewAdmin } from "../admin";
// import { useSiteRole0 } from "../useSiteRole";
import { useUqApp } from "app/UqApp";

export function PageSys() {
    const uqApp = useUqApp();
    const modal = useModal();
    // const siteRole = useSiteRole0();
    const roleStore = uqApp.roleStore0;
    function onSites() {
        modal.open(<PageSites />);
    }
    let { isOwner } = roleStore.userSite;
    let viewRoles = isOwner === true ? <>
        <Sep />
        <ViewOwner siteRole={roleStore} />
        <ViewAdmin siteRole={roleStore} />
    </> : undefined;
    return <Page header="系统管理">
        <Cmd content="机构管理" onClick={onSites} />
        {viewRoles}
        <Sep />
    </Page>;
}
