import { WritableAtom, atom } from "jotai";
import { Action } from "./action";
import { Query } from "./query";
import { UqMan } from "./uqMan";
import { getAtomValue, setAtomValue } from "tonwa-com";

export interface UserUnit<T = any> {
    id: number;
    user: number;
    unitId: number;
    unit: T;
    isOwner: boolean;
    isAdmin: boolean;
    assigned: string;
    name: string;
    nick: string;
    icon: string;
    rolesAtom: WritableAtom<string[], any, any>;
    permits: { [permit: string]: boolean };
    entity: string;
    addBy: number;
}

export interface UnitRoles {
    owners: UserUnit[];
    admins: UserUnit[];
    users: UserUnit[];
    usersOfRole: { [role: string]: UserUnit[] };
}

export enum EnumSysRole {
    admin = 1,
    owner = 2,
}

export class UqUnit {
    private readonly uqMan: UqMan;
    private mySitesColl: { [unit: number]: UserUnit };
    userUnit0: UserUnit;        // the root uq unit = 0;
    mySites: UserUnit[];
    userUnit: UserUnit;         // current unit;

    constructor(uqMan: UqMan) {
        this.uqMan = uqMan;
    }

    async login() {
        await this.loadMyRoles();
    }

    loginUnit(userUnit: UserUnit) {
        this.userUnit = userUnit;   // 每次只允许一个unit展示
    }

    logoutUnit() {
        this.userUnit = undefined; // this.userUnit0;
    }

    hasRole(role: string[] | string) {
        if (this.userUnit === undefined) return false;
        let { rolesAtom, isAdmin } = this.userUnit;
        if (isAdmin === true) return true;
        if (rolesAtom === undefined) return false;
        let roles = getAtomValue(rolesAtom);
        if (Array.isArray(role) === true) {
            let arr = role as string[];
            for (let item of arr) {
                let ret = roles.indexOf(item) >= 0;
                if (ret === true) return true;
            }
            return false;
        }
        else {
            return roles.indexOf(role as string) >= 0;
        }
    }

    async Poked(): Promise<boolean> {
        let query: Query = this.uqMan.entities['$poked'] as any;
        let ret = await query.query({});
        let arr: { poke: number; }[] = ret.ret;
        if (arr.length === 0) return false;
        let row = arr[0];
        return row["poke"] === 1;
    }

    async reloadMyRoles(): Promise<void> {
        this.mySitesColl = undefined;
        await this.loadMyRoles();
    }

    async setSite(site: number): Promise<void> {
        let act: Action = this.uqMan.entities['$setsite'] as any;
        await act.submit({ site });
        await this.reloadMyRoles();
    }

    private async loadMyRoles(): Promise<void> {
        if (this.mySitesColl !== undefined) return;
        this.mySites = [];
        this.mySitesColl = {};
        let query: Query = this.uqMan.entities['$role_my'] as any;
        let results = await query.query({});
        let { sites, roles, permits } = results;
        const getMySite = (site: number) => {
            let mySite = this.mySitesColl[site];
            if (mySite === undefined) {
                mySite = {
                    unit: site,
                    rolesAtom: atom<UserUnit[]>([]) as any,
                    permits: {},
                } as UserUnit;
                this.mySitesColl[site] = mySite;
                if (site !== 0) {
                    this.mySites.push(mySite);
                }
                else {
                    this.userUnit0 = mySite;
                }
            }
            return mySite;
        }
        let userUnitDef: UserUnit;
        for (let siteRow of sites) {
            let { id, site, admin, entity, assigned, def } = siteRow;
            let mySite = getMySite(site);
            mySite.id = id;
            mySite.unitId = site;
            mySite.isAdmin = ((admin & 1) === 1);
            mySite.isOwner = ((admin & 2) === 2);
            mySite.entity = entity;
            mySite.assigned = assigned;
            if (userUnitDef === undefined && mySite !== this.userUnit0) {
                userUnitDef = mySite;
            }
            if (def === 1) {
                userUnitDef = mySite;
            }
        }
        this.userUnit = userUnitDef;
        if (userUnitDef !== undefined) {
            let i = this.mySites.findIndex(v => v === userUnitDef);
            if (i >= 0) {
                this.mySites.splice(i, 1);
                this.mySites.unshift(userUnitDef);
            }
        }
        for (let roleRow of roles) {
            let { site, role } = roleRow;
            let mySite = getMySite(site);
            let { rolesAtom } = mySite;
            let roles = getAtomValue(rolesAtom);
            if (roles === undefined) {
                roles = [];
            }
            roles.push(role);
            setAtomValue(rolesAtom, roles);
            mySite.permits[role] = true;
        }
        for (let permitRow of permits) {
            let { site, permit } = permitRow;
            let mySite = getMySite(site);
            mySite.permits[permit] = true;
        }
    }

    async loadUnitUsers(): Promise<UnitRoles> {
        let owners: UserUnit[] = [];
        let admins: UserUnit[] = [];
        let coll: { [user: number]: UserUnit } = {};
        let query: Query = this.uqMan.entities['$role_site_users'] as any;
        let result = await query.query({ site: this.userUnit.unitId });
        if (result === undefined) return;
        let { users: userRows, roles: roleRows } = result;
        let users: UserUnit[] = [];
        for (let userRow of userRows) {
            let userUnit: UserUnit = { ...userRow, rolesAtom: atom([]), permits: {} };
            let { id, admin } = userRow;
            coll[id] = userUnit;
            let isAdmin = userUnit.isAdmin = ((admin & 1) === 1);
            let isOwner = userUnit.isOwner = ((admin & 2) === 2);
            if (isOwner === true) owners.push(userUnit);
            else if (isAdmin === true) admins.push(userUnit);
            else users.push(userUnit);
        }

        let rolesColl: { [role: string]: UserUnit[] } = {};
        let usersOfRole: { [role: string]: UserUnit[]; } = {};
        for (let roleRow of roleRows) {
            let { user, role } = roleRow;
            let userUnit = coll[user];
            if (userUnit !== undefined) {
                let { rolesAtom } = userUnit;
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
            roleUsers.push(userUnit);
        }
        return { owners, admins, users, usersOfRole };
    }

    async addAdmin(user: number, admin: EnumSysRole, assigned: string) {
        let act: Action = this.uqMan.entities['$role_site_add_admin'] as any;
        await act.submit({
            site: this.userUnit.unitId,
            user,
            admin,
            assigned,
        });
        return await this.uqMan.syncUser(user);
    }

    async addUser(user: number, assigned: string) {
        let act: Action = this.uqMan.entities['$role_site_add_user'] as any;
        await act.submit({
            site: this.userUnit.unitId,
            user,
            assigned,
        });
        return await this.uqMan.syncUser(user);
    }

    async setUserRole(user: number, role: string, on: boolean) {
        let action: 'add' | 'del' | 'clear' = on === true ? 'add' : 'del';
        let act: Action = this.uqMan.entities['$role_site_user_role'] as any;
        await act.submit({
            site: this.userUnit.unitId,
            user,
            action,
            role
        });
    }

    async clearUserRole(user: number) {
        let action = 'clear';
        let act: Action = this.uqMan.entities['$role_site_user_role'] as any;
        await act.submit({
            site: this.userUnit.unitId,
            user,
            action,
            undefined,
        });
    }

    async quitOwner() {
        let act: Action = this.uqMan.entities['$role_site_quit_owner'] as any;
        await act.submit({
            site: this.userUnit.unitId,
        });
    }

    async delAdmin(user: number, admin: EnumSysRole) {
        let act: Action = this.uqMan.entities['$role_site_del_admin'] as any;
        await act.submit({
            site: this.userUnit.unitId,
            user,
            admin,
        });
    }
}
