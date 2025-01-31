import { UqApp } from "./UqApp";
import { atom } from "jotai";
import { Store } from "tonwa";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { Action, EnumSysRole, Query, UnitRoles, UqMan, UserSite } from "tonwa-uq";

export class RoleStore extends Store {
    readonly uqApp: UqApp;
    readonly userSite: UserSite;
    readonly site: number;
    readonly uqMan: UqMan;
    readonly unitRoles = atom(undefined as UnitRoles); //: WritableAtom<UnitRoles, any, any>;

    constructor(uqApp: UqApp, userSite: UserSite) {
        super();
        this.uqApp = uqApp;
        this.userSite = userSite;
        this.site = userSite.siteId;
        this.uqMan = uqApp.uqSites.uqMan;
    }

    async onAdminChanged(): Promise<void> {
    }

    async init() {
        try {
            if (this.userSite.isAdmin === false) return;
            let ret = await this.loadUnitUsers();
            if (ret === undefined) return;
            setAtomValue(this.unitRoles, ret);
        }
        catch (err) {
            console.error(err);
        }
    }

    async loadUnitUsers(): Promise<UnitRoles> {
        let result: any;
        const $role_site_users = '$role_site_users';
        let $role_site_usersCache = this.uqApp.cache[$role_site_users];
        if ($role_site_usersCache !== undefined) {
            result = $role_site_usersCache[this.site];
        }
        if (result === undefined) {
            let query: Query = this.uqMan.entities[$role_site_users] as any;
            result = await query.query({ site: this.site });
            if (result === undefined) return;
            if ($role_site_usersCache === undefined) {
                this.uqApp.cache[$role_site_users] = $role_site_usersCache = {};
            }
            $role_site_usersCache[this.site] = result;
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

    async reloadAdmin() {
        await this.onAdminChanged?.();
        await this.init();
    }

    async onAdminAdded(userId: number, assigned: string) {
        let admin: EnumSysRole = EnumSysRole.admin;
        await this.addAdmin(userId, admin, assigned);
    }

    async onOwnerAdded(userId: number, assigned: string) {
        let admin: EnumSysRole = EnumSysRole.owner | EnumSysRole.admin;
        await this.addAdmin(userId, admin, assigned);
    }

    async addAdmin(userId: number, admin: EnumSysRole, assigned: string) {
        await this.internalAddAdmin(-userId, admin, assigned);
        this.reloadAdmin();
    }

    async quitOwner() {
        await this.internalQuitOwner();
        await this.reloadAdmin();
    }

    async delAdmin(userId: number, admin: EnumSysRole) {
        await this.internalDelAdmin(userId, admin);
        this.reloadAdmin();
    }

    async addUser(user: number, assigned: string) {
        let act: Action = this.uqMan.entities['$role_site_add_user'] as any;
        await act.submit({
            site: this.site,
            user,
            assigned,
        });
        return await this.syncUser(user);
    }

    async setUserRole(userId: number, role: number, on: boolean) {
        await this.internalSetUserRole(userId, role, on);
    }

    async clearUserRole(userId: number) {
        await this.internalClearUserRole(userId);
    }

    private async internalAddAdmin(user: number, admin: EnumSysRole, assigned: string) {
        let act: Action = this.uqMan.entities['$role_site_add_admin'] as any;
        await act.submit({
            site: this.site,
            user,
            admin,
            assigned,
        });
        return await this.syncUser(user);
    }

    async syncUser(user: number) {
        // 提醒uq，需要同步center user
        let ret = await this.uqMan.syncUser(user);
        this.uqMan.idCacheDel(ret.id);
        return ret;
    }

    private async internalSetUserRole(user: number, role: number, on: boolean) {
        let action: 'add' | 'del' | 'clear' = on === true ? 'add' : 'del';
        let act: Action = this.uqMan.entities['$role_site_user_role'] as any;
        await act.submit({
            site: this.site,
            user,
            action,
            role
        });
    }

    private async internalClearUserRole(user: number) {
        let action = 'clear';
        let act: Action = this.uqMan.entities['$role_site_user_role'] as any;
        await act.submit({
            site: this.site,
            user,
            action,
            undefined,
        });
    }

    private async internalQuitOwner() {
        let act: Action = this.uqMan.entities['$role_site_quit_owner'] as any;
        await act.submit({
            site: this.site,
        });
    }

    private async internalDelAdmin(user: number, admin: EnumSysRole) {
        let act: Action = this.uqMan.entities['$role_site_del_admin'] as any;
        await act.submit({
            site: this.site,
            user,
            admin,
        });
    }
}
