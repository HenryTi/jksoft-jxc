import { EnumSysRole } from "tonwa-uq";
import { ViewOwner } from "./owner";
import { roleT } from "./res";
import { ViewRoles } from "./roles";
import { GenSiteRole } from "./GenSiteRole";
import { Page, PageSpinner } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { ViewAdmin } from "./admin";

interface Props {
    admin: EnumSysRole, // 'admin' | 'owner';
    onAdminChanged: () => Promise<void>;
    viewTop: JSX.Element;
    siteRole: GenSiteRole;
}

export function PageRoleAdmin({ admin, onAdminChanged, viewTop, siteRole }: Props) {
    const uqApp = useUqApp();
    siteRole.onAdminChanged = onAdminChanged;
    let { isOwner, isAdmin } = siteRole.userSite;
    return <Page header={roleT(admin === EnumSysRole.admin ? 'admin' : 'owner')}>
        {viewTop}
        {isOwner === true && <>
            <ViewOwner siteRole={siteRole} />
            <ViewAdmin siteRole={siteRole} />
        </>}
        {isAdmin === true && <ViewRoles siteRole={siteRole} />}
    </Page>;
}

