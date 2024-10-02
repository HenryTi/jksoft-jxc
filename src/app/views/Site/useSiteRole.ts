import { Action, EnumSysRole, Query, UnitRoles, UqMan, UqSites, UserSite } from "tonwa-uq";
import { WritableAtom, atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { useUqApp } from "app/UqApp";
import { useEffect } from "react";

export interface UseSiteRoleReturn {
    userSite: UserSite;
    quitOwner: () => Promise<void>;
    unitRoles: WritableAtom<UnitRoles, any, any>;
    onAdminAdded: (userId: number, assigned: string) => Promise<void>;
    onOwnerAdded: (userId: number, assigned: string) => Promise<void>;
    addUser: (user: number, assigned: string) => Promise<any>;
    delAdmin: (userId: number, admin: EnumSysRole) => Promise<void>;
    setUserRole: (userId: number, role: number, on: boolean) => Promise<void>;
}

export function useSiteRole() {
    const uqApp = useUqApp();
    return useSiteRoleBase(uqApp.uqSites?.userSite);
}

export function useSiteRole0() {
    const uqApp = useUqApp();
    return useSiteRoleBase(uqApp.uqSites.userSite0);
}

function useSiteRoleBase(userSite: UserSite): UseSiteRoleReturn {
    const uqApp = useUqApp();
    let unitRoles = atom({} as UnitRoles);
    useEffect(() => {
        if (userSite === undefined) return;
        init();
    });
    if (userSite === undefined) return {} as any;

    let site: number = userSite.siteId;
    let uqMan: UqMan = uqApp.uqSites.uqMan;

    async function init() {
        try {
            if (userSite.isAdmin === false) return;
            let ret = await loadUnitUsers();
            if (ret === undefined) return;
            setAtomValue(unitRoles, ret);
        }
        catch (err) {
            console.error(err);
        }
    }

    let onAdminChanged: () => Promise<void> = undefined;

    async function loadUnitUsers(): Promise<UnitRoles> {
        let result: any;
        const $role_site_users = '$role_site_users';
        let $role_site_usersCache = uqApp.cache[$role_site_users];
        if ($role_site_usersCache !== undefined) {
            result = $role_site_usersCache[site];
        }
        if (result === undefined) {
            let query: Query = uqMan.entities[$role_site_users] as any;
            result = await query.query({ site });
            if (result === undefined) return;
            if ($role_site_usersCache === undefined) {
                uqApp.cache[$role_site_users] = $role_site_usersCache = {};
            }
            $role_site_usersCache[site] = result;
        }
        let { users: userRows, roles: roleRows } = result;
        let users: UserSite[] = [];
        let owners: UserSite[] = [];
        let admins: UserSite[] = [];
        let coll: { [user: number]: UserSite } = {};
        for (let userRow of userRows) {
            let userSite: UserSite = { ...userRow, rolesAtom: atom([]), permits: {} };
            let { id, admin } = userRow;
            coll[id] = userSite;
            let isAdmin = userSite.isAdmin = ((admin & 1) === 1);
            let isOwner = userSite.isOwner = ((admin & 2) === 2);
            if (isOwner === true) owners.push(userSite);
            else if (isAdmin === true) admins.push(userSite);
            else users.push(userSite);
        }

        let rolesColl: { [role: string]: UserSite[] } = {};
        let usersOfRole: { [role: string]: UserSite[]; } = {};
        for (let roleRow of roleRows) {
            let { user, role } = roleRow;
            let userSite = coll[user];
            if (userSite !== undefined) {
                let { rolesAtom } = userSite;
                let roleArr = getAtomValue(rolesAtom);
                if (roleArr === undefined) roleArr = [];
                roleArr.push(role);
                setAtomValue(rolesAtom, roleArr);
            }
            let roleUsers = rolesColl[role];
            if (roleUsers === undefined) {
                rolesColl[role] = roleUsers = [];
                usersOfRole[role] = roleUsers;
            }
            roleUsers.push(userSite);
        }
        return { owners, admins, users, usersOfRole };
    }

    async function reloadAdmin() {
        await onAdminChanged?.();
        await init();
    }

    async function onAdminAdded(userId: number, assigned: string) {
        let admin: EnumSysRole = EnumSysRole.admin;
        await addAdmin(userId, admin, assigned);
    }

    async function onOwnerAdded(userId: number, assigned: string) {
        let admin: EnumSysRole = EnumSysRole.owner | EnumSysRole.admin;
        await addAdmin(userId, admin, assigned);
    }

    async function addAdmin(userId: number, admin: EnumSysRole, assigned: string) {
        await internalAddAdmin(-userId, admin, assigned);
        reloadAdmin();
    }

    async function quitOwner() {
        await internalQuitOwner();
        await reloadAdmin();
    }

    async function delAdmin(userId: number, admin: EnumSysRole) {
        await internalDelAdmin(userId, admin);
        reloadAdmin();
    }

    async function addUser(user: number, assigned: string) {
        let act: Action = uqMan.entities['$role_site_add_user'] as any;
        await act.submit({
            site,
            user,
            assigned,
        });
        return await syncUser(user);
    }

    async function setUserRole(userId: number, role: number, on: boolean) {
        await internalSetUserRole(userId, role, on);
    }

    async function clearUserRole(userId: number) {
        await internalClearUserRole(userId);
    }

    async function internalAddAdmin(user: number, admin: EnumSysRole, assigned: string) {
        let act: Action = uqMan.entities['$role_site_add_admin'] as any;
        await act.submit({
            site,
            user,
            admin,
            assigned,
        });
        return await syncUser(user);
    }

    async function syncUser(user: number) {
        // 提醒uq，需要同步center user
        let ret = await uqMan.syncUser(user);
        uqMan.idCacheDel(ret.id);
        return ret;
    }

    async function internalSetUserRole(user: number, role: number, on: boolean) {
        let action: 'add' | 'del' | 'clear' = on === true ? 'add' : 'del';
        let act: Action = uqMan.entities['$role_site_user_role'] as any;
        await act.submit({
            site,
            user,
            action,
            role
        });
    }

    async function internalClearUserRole(user: number) {
        let action = 'clear';
        let act: Action = uqMan.entities['$role_site_user_role'] as any;
        await act.submit({
            site,
            user,
            action,
            undefined,
        });
    }

    async function internalQuitOwner() {
        let act: Action = uqMan.entities['$role_site_quit_owner'] as any;
        await act.submit({
            site,
        });
    }

    async function internalDelAdmin(user: number, admin: EnumSysRole) {
        let act: Action = uqMan.entities['$role_site_del_admin'] as any;
        await act.submit({
            site,
            user,
            admin,
        });
    }

    return {
        userSite,
        quitOwner,
        unitRoles,
        onAdminAdded,
        onOwnerAdded,
        addUser,
        delAdmin,
        setUserRole,
    };
}
