import { LMR } from "tonwa-com";
import { propertyOf, UserSite } from "tonwa-uq";
import { ButtonAddUser } from "../ButtonAddUser";
import { Me } from "../Me";
import { roleT } from "../res";
import { GenSiteRole } from "../GenSiteRole";
import { ViewUser } from "../ViewUser";
import { ListEdit, ListEditContext, None, useUqAppBase } from "tonwa-app";
import { useAtomValue } from "jotai";
import { consts } from "../consts";

export function ViewAdmin({ siteRole }: { siteRole: GenSiteRole; }) {
    let { onAdminAdded } = siteRole;
    let user = useAtomValue(siteRole.uqApp.user);
    let unitRoles = useAtomValue(siteRole.unitRoles);
    let { admins } = unitRoles;
    let listEditContext = new ListEditContext<UserSite>(admins, propertyOf<UserSite>('unit'));
    let tAdmin = roleT('admin');
    function ViewItem({ value }: { value: UserSite }) {
        if (value.user === user.id) return <Me />;
        return <div className="px-3 py-2">
            <ViewUser userSite={value} siteRole={siteRole} />
        </div>;
    }

    return <>
        <div className={consts.cnCard}>
            <div className="card-header pe-0 py-0">
                <LMR className="align-items-center">
                    <span>{tAdmin}</span>
                    <ButtonAddUser onUserAdded={onAdminAdded} />
                </LMR>
            </div>
            <ListEdit context={listEditContext} none={<None />} ViewItem={ViewItem} />
        </div>
        <ul className="small text-muted mt-2 mb-5 mx-3">
            <li>{roleT('adminMemo1')}</li>
            <li>{roleT('adminMemo2')}</li>
        </ul>
    </>;
}
