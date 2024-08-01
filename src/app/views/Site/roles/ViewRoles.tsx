import { ReactNode } from "react";
import { FA, LMR, setAtomValue } from "tonwa-com";
import { UserSite } from "tonwa-uq";
import { ButtonAddUser } from "../ButtonAddUser";
import { roleT } from "../res";
import { ViewUser } from "../ViewUser";
import { ListEdit, ListEditContext, None } from "tonwa-app";
import { atom, useAtomValue } from "jotai";
import { consts } from "../consts";
import { UseSiteRoleReturn } from "../useSiteRole";
import { useUqApp } from "app/UqApp";

export function ViewRoles({ siteRole }: { siteRole: UseSiteRoleReturn; }) {
    let uqApp = useUqApp();
    const { biz } = uqApp;
    let unitRoles = useAtomValue(siteRole.unitRoles);
    let { users } = unitRoles;

    let listEditContext = new ListEditContext(users, (item1, item2) => item1.user === item2.user);

    function ViewItem({ value }: { value: UserSite }) {
        let { rolesAtom, isAdmin, isOwner, user } = value;
        let uqAppUser = useAtomValue(uqApp.user);
        let roles = useAtomValue(rolesAtom);
        if (user === uqAppUser.id) return null;
        let bizRoles = biz.roles;
        function Checked({ children }: { children: ReactNode; }) {
            return <label className="me-5">
                <input type="checkbox" className="form-check-input" checked={true} disabled={true} />
                <span>{children}</span>
            </label>;
        }
        let vRoles = <div className="ms-4 mt-2 form-check form-check-inline">{isOwner === true ?
            <Checked>roleT('owner')</Checked>
            : (
                isAdmin === true ?
                    <Checked>roleT('admin')</Checked>
                    :
                    <>{roles.map(role => {
                        let roleEntity = bizRoles.find(v => v.id === role);
                        let content: string;
                        if (roleEntity === undefined) {
                            content = `role is not defined in biz`;
                        }
                        else {
                            let { name, caption } = roleEntity;
                            content = caption ?? name;
                        }
                        return <span key={role} className="d-inline-block w-min-6c me-3">
                            <FA name="user" className="text-info me-1" /> {content}
                        </span>;
                    })}</>
            )
        }</div>;
        return <div className="px-3 py-2">
            <ViewUser userSite={value} siteRole={siteRole} />
            {vRoles}
        </div >;
    }
    async function onUserAdded(user: number, assigned: string) {
        // user is tonwa id, -use
        let retUser = await siteRole.addUser(-user, assigned);
        if (retUser === undefined) {
            console.error('uqUnit.addUser error', user, assigned);
        }
        let { items, atomItems } = listEditContext;
        let index = items.findIndex(v => v.user === user);
        if (index >= 0) {
            items.splice(index, 1);
        }
        let unitUser = {
            ...retUser,
            id: 0,
            user: retUser.id,
            unit: 0,
            admin: 0,
            rolesAtom: atom([]),
        };
        if (assigned !== undefined) {
            unitUser.assigned = assigned;
        }
        items = [unitUser, ...items];
        setAtomValue(atomItems, items);
    }
    return <>
        <div className={consts.cnCard}>
            <div className="card-header pe-0 py-0">
                <LMR className="align-items-center">
                    <span>{roleT('user')}</span>
                    <ButtonAddUser onUserAdded={onUserAdded} />
                </LMR>
            </div>
            <ListEdit context={listEditContext} ViewItem={ViewItem} none={<None />} />
        </div>
    </>;
}
