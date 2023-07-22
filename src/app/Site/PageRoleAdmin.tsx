import { EnumSysRole } from "tonwa-uq";
import { ViewOwner } from "./owner";
import { roleT } from "./res";
import { ViewRoles } from "./roles";
import { useSiteRole } from "./useSiteRole";
import { Page } from "tonwa-app";
import { ViewAdmin } from "./admin";

interface Props {
    admin: EnumSysRole, // 'admin' | 'owner';
    viewTop: JSX.Element;
}

export function PageRoleAdmin({ admin, viewTop }: Props) {
    let useSiteRoleReturn = useSiteRole();
    let { isOwner, isAdmin } = useSiteRoleReturn.userSite;
    return <Page header={roleT(admin === EnumSysRole.admin ? 'admin' : 'owner')}>
        {viewTop}
        {isOwner === true && <>
            <ViewOwner siteRole={useSiteRoleReturn} />
            <ViewAdmin siteRole={useSiteRoleReturn} />
        </>}
        {isAdmin === true && <ViewRoles siteRole={useSiteRoleReturn} />}
    </Page>;
}
