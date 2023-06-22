import { Action, EnumSysRole, Query, UnitRoles, UqMan, UqSites, UserSite } from "tonwa-uq";
import { Gen } from "app/tool";
import { atom } from "jotai";
import { getAtomValue, setAtomValue } from "tonwa-com";
import { UqApp } from "app/UqApp";

export class GenSiteRole extends Gen {
    readonly unitRoles = atom({} as UnitRoles);
    private readonly uqMan: UqMan;
    private readonly site: number;
    readonly userSite: UserSite;

    constructor(uqApp: UqApp, uqSites: UqSites, userSite: UserSite) {
        super(uqApp);
        this.uqMan = uqSites.uqMan;
        this.userSite = userSite;
        this.site = userSite.siteId;
    }

    async init() {
        try {
            let ret = await this.loadUnitUsers();
            if (ret === undefined) return;
            setAtomValue(this.unitRoles, ret);
        }
        catch (err) {
            console.error(err);
        }
    }

    onAdminChanged: () => Promise<void>;

    private async loadUnitUsers(): Promise<UnitRoles> {
        let owners: UserSite[] = [];
        let admins: UserSite[] = [];
        let coll: { [user: number]: UserSite } = {};
        let query: Query = this.uqMan.entities['$role_site_users'] as any;
        let result = await query.query({ site: this.site });
        if (result === undefined) return;
        let { users: userRows, roles: roleRows } = result;
        let users: UserSite[] = [];
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

    private reloadAdmin = async () => {
        await this.onAdminChanged?.();
        await this.init();
    }

    onAdminAdded = async (userId: number, assigned: string) => {
        let admin: EnumSysRole = EnumSysRole.admin;
        await this.addAdmin(userId, admin, assigned);
    }

    onOwnerAdded = async (userId: number, assigned: string) => {
        let admin: EnumSysRole = EnumSysRole.owner | EnumSysRole.admin;
        await this.addAdmin(userId, admin, assigned);
    }

    private async addAdmin(userId: number, admin: EnumSysRole, assigned: string) {
        await this.internalAddAdmin(-userId, admin, assigned);
        this.reloadAdmin();
    }

    quitOwner = async () => {
        await this.internalQuitOwner();
        await this.reloadAdmin();
    }

    delAdmin = async (userId: number, admin: EnumSysRole) => {
        await this.internalDelAdmin(userId, admin);
        this.reloadAdmin();
    }

    addUser = async (user: number, assigned: string) => {
        let act: Action = this.uqMan.entities['$role_site_add_user'] as any;
        await act.submit({
            site: this.site,
            user,
            assigned,
        });
        return await this.syncUser(user);
    }

    setUserRole = async (userId: number, role: string, on: boolean) => {
        await this.internalSetUserRole(userId, role, on);
    }

    clearUserRole = async (userId: number) => {
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

    private async syncUser(user: number) {
        // 提醒uq，需要同步center user
        let ret = await this.uqMan.syncUser(user);
        this.uqMan.idCacheDel(ret.id);
        return ret;
    }

    private async internalSetUserRole(user: number, role: string, on: boolean) {
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
