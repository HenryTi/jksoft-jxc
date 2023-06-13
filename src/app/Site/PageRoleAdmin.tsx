import { EnumSysRole } from "tonwa-uq";
import { ViewOwner } from "./owner";
import { roleT } from "./res";
import { ViewRoles } from "./roles";
import { SiteRole } from "./SiteRole";
import { Page, PageSpinner } from "tonwa-app";
import { useUqApp } from "app/UqApp";
import { ViewAdmin } from "./admin";
import { useAtomValue } from "jotai";
import { useEffectOnce } from "tonwa-com";


interface Props {
    admin: EnumSysRole, // 'admin' | 'owner';
    onAdminChanged: () => Promise<void>;
    viewTop: JSX.Element;
}

export function PageRoleAdmin({ admin, onAdminChanged, viewTop }: Props) {
    const uqApp = useUqApp();
    const store = uqApp.objectOf(SiteRole);
    let { users } = useAtomValue(store.unitRoles);
    useEffectOnce(() => {
        store.init();
    });
    if (users === undefined) return <PageSpinner />;

    store.onAdminChanged = onAdminChanged;
    let { isOwner, isAdmin } = uqApp.userUnit;
    return <Page header={roleT(admin === EnumSysRole.admin ? 'admin' : 'owner')}>
        {viewTop}
        {isOwner === true && <>
            <ViewOwner />
            <ViewAdmin />
        </>}
        {isAdmin === true && <ViewRoles />}
    </Page>;
}

