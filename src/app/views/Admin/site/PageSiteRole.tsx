import { EnumSysRole } from "tonwa-uq";
import { ViewOwner } from "../../Site/owner";
import { roleT } from "../../Site/res";
import { ViewRoles } from "../../Site/roles";
import { useSiteRole } from "../../Site/useSiteRole";
import { Page } from "tonwa-app";
import { ViewAdmin } from "../../Site/admin";

interface Props {
    admin: EnumSysRole, // 'admin' | 'owner';
    viewTop: JSX.Element;
}

export function PageSiteRole({ admin, viewTop }: Props) {
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
