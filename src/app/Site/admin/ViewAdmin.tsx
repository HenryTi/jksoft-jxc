import { LMR } from "tonwa-com";
import { propertyOf, UserUnit } from "tonwa-uq";
import { ButtonAddUser } from "../ButtonAddUser";
import { Me } from "../Me";
import { roleT } from "../res";
import { SiteRole } from "../SiteRole";
import { ViewUser } from "../ViewUser";
import { ListEdit, ListEditContext, None, useUqAppBase } from "tonwa-app";
import { useAtomValue } from "jotai";
import { consts } from "../consts";

export function ViewAdmin() {
    const uqApp = useUqAppBase();
    let store = uqApp.objectOf(SiteRole);
    let { onAdminAdded } = store;
    let user = useAtomValue(store.uqApp.user);
    let unitRoles = useAtomValue(store.unitRoles);
    let { admins } = unitRoles;
    let listEditContext = new ListEditContext<UserUnit>(admins, propertyOf<UserUnit>('unit'));
    let tAdmin = roleT('admin');
    function ViewItem({ value }: { value: UserUnit }) {
        if (value.user === user.id) return <Me />;
        return <div className="px-3 py-2">
            <ViewUser userUnit={value} />
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
