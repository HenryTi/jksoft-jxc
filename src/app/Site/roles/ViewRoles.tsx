import { ReactNode } from "react";
import { FA, LMR, setAtomValue } from "tonwa-com";
import { UserUnit } from "tonwa-uq";
//import { ListEdit, ListEditContext } from "../../ListEdit";
import { ButtonAddUser } from "../ButtonAddUser";
import { roleT } from "../res";
import { SiteRole } from "../SiteRole";
import { ViewUser } from "../ViewUser";
import { ListEdit, ListEditContext, None, useUqAppBase } from "tonwa-app";
import { useAtomValue } from "jotai";
import { consts } from "../consts";

export function ViewRoles(/*{ roleItems, users }: { roleItems: string[], users: UserUnit[] }*/) {
    let uqApp = useUqAppBase();
    let store = uqApp.objectOf(SiteRole);
    let unitRoles = useAtomValue(store.unitRoles);
    // let roleItems: string[] = [];
    let { users } = unitRoles;

    let listEditContext = new ListEditContext(users, (item1, item2) => item1.user === item2.user);

    function ViewItem({ value }: { value: UserUnit }) {
        let { rolesAtom, isAdmin, isOwner, user } = value;
        let uqAppUser = useAtomValue(uqApp.user);
        let roles = useAtomValue(rolesAtom);
        if (user === uqAppUser.id) return null;
        /*
        function RoleCheck({ caption, roleItem }: { caption: string; roleItem: string; }) {
            async function onCheckChange(evt: React.ChangeEvent<HTMLInputElement>) {
                await uqApp.uqUnit.setUserRole(
                    value.user,
                    roleItem,
                    evt.currentTarget.checked,
                );
            }
            let defaultChecked = roles?.findIndex(v => v === roleItem) >= 0;
            return <label className="me-5">
                <input type="checkbox" className="form-check-input"
                    onChange={onCheckChange}
                    defaultChecked={defaultChecked} />
                <span>{caption}</span>
            </label>;
        }
        */
        let bizRoles = store.biz.roles;
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
                        let roleEntity = bizRoles.find(v => v.phrase === role);
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
        // roleItems.map(v => (<RoleCheck key={v} caption={v} roleItem={v} />))
        return <div className="px-3 py-2">
            <ViewUser userUnit={value} />
            {vRoles}
        </div >;
    }
    async function onUserAdded(user: number, assigned: string) {
        let retUser = await uqApp.uqUnit.addUser(user, assigned);
        let { items, atomItems } = listEditContext;
        let index = items.findIndex(v => v.user === user);
        if (index >= 0) {
            items.splice(index, 1);
        }
        setAtomValue(atomItems,
            [{
                ...retUser,
                id: 0,
                user,
                unit: 0,
                admin: 0
            } as any, ...items]
        );
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
