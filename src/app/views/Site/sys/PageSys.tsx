import { Page, useModal } from "tonwa-app";
import { Cmd } from "./Cmd";
import { PageSites } from "./PageSites";
import { Sep } from "tonwa-com";
import { ViewOwner } from "../owner";
import { ViewAdmin } from "../admin";
import { useSiteRole0 } from "../useSiteRole";

export function PageSys() {
    const modal = useModal();
    const siteRole = useSiteRole0();
    function onSites() {
        modal.open(<PageSites />);
    }
    let { isOwner } = siteRole.userSite;
    let viewRoles = isOwner === true ? <>
        <Sep />
        <ViewOwner siteRole={siteRole} />
        <ViewAdmin siteRole={siteRole} />
    </> : undefined;
    return <Page header="系统管理">
        <Cmd content="机构管理" onClick={onSites} />
        {viewRoles}
        <Sep />
    </Page>;
}
