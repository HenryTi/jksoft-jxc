import { Action } from "./action";
import { Query } from "./query";
import { UqMan } from "./uqMan";

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
    roles: string[];
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
    private userUnit0: UserUnit;        // the root uq unit = 0;
    #isLogined: boolean;
    MySites: UserUnit[];
    userUnit: UserUnit;         // current unit;

    constructor(uqMan: UqMan) {
        this.uqMan = uqMan;
    }

    async login() {
        /*
        let userUnit: UserUnit = {
            id: 0,
            user,
            unit: site,
        } as UserUnit;
        ?
        this.loginUnit(userUnit);
        */
        await this.loadMyRoles();
    }

    loginUnit(userUnit: UserUnit) {
        this.userUnit = userUnit;   // 每次只允许一个unit展示
    }

    logoutUnit() {
        this.userUnit = this.userUnit0;
    }

    hasRole(role: string[] | string) {
        if (this.userUnit === undefined) return false;
        let { roles, isAdmin } = this.userUnit;
        if (isAdmin === true) return true;
        if (roles === undefined) return false;
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

    private async loadMyRoles(): Promise<void> {
        if (this.mySitesColl !== undefined) return;
        this.MySites = [];
        this.mySitesColl = {};
        let query: Query = this.uqMan.entities['$role_my'] as any;
        let { admins, roles, unitProps } = await query.query({});
        const getMySite = (site: number) => {
            let mySite = this.mySitesColl[site];
            if (mySite === undefined) {
                mySite = {
                    unit: site,
                } as UserUnit;
                this.mySitesColl[site] = mySite;
                this.MySites.push(mySite);
            }
            return mySite;
        }
        for (let adminRow of admins) {
            let { id, site, admin, entity, assigned } = adminRow;
            let myUnit = getMySite(site);
            myUnit.id = id;
            myUnit.unitId = site;
            myUnit.isAdmin = ((admin & 1) === 1);
            myUnit.isOwner = ((admin & 2) === 2);
            myUnit.entity = entity;
            myUnit.assigned = assigned;
            if (this.userUnit === undefined) {
                if (site !== 0) {
                    this.userUnit = myUnit;
                }
            }
            if (site === 0) {
                this.userUnit0 = myUnit;
            }
        }
        for (let roleRow of roles) {
            let { site, role } = roleRow;
            let mySite = getMySite(site);
            let roles = mySite.roles;
            if (roles === undefined) {
                mySite.roles = roles = [];
            }
            roles.push(role);
        }
        if (unitProps) {
            for (let propsRow of unitProps) {
                let { unit, props } = propsRow;
                let mySite = getMySite(unit);
                let ID = this.uqMan.getID(mySite.entity);
                mySite.unit = ID.valueFromString(props);
            }
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
            let { user, admin } = userRow;
            coll[user] = userRow;
            let isAdmin = userRow.isAdmin = ((admin & 1) === 1);
            let isOwner = userRow.isOwner = ((admin & 2) === 2);
            /*
            if (user === me) {
                if (isOwner === true) meOwner = true;
                else if (isAdmin === true) meAdmin = true;
            }
            else {
            */
            if (isOwner === true) owners.push(userRow);
            else if (isAdmin === true) admins.push(userRow);
            else users.push(userRow);
            //}
        }

        let rolesColl: { [role: string]: UserUnit[] } = {};
        let usersOfRole: { [role: string]: UserUnit[]; } = {};
        for (let roleRow of roleRows) {
            let { user, role } = roleRow;
            let userUnit = coll[user];
            if (userUnit !== undefined) {
                let { roles: roleArr } = userUnit;
                if (roleArr === undefined) {
                    userUnit.roles = roleArr = [];
                }
                roleArr.push(role);
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

    async setUserRole(user: number, action: 'add' | 'del' | 'clear', role: string) {
        let act: Action = this.uqMan.entities['$role_site_user_role'] as any;
        await act.submit({
            site: this.userUnit.unitId,
            user,
            action,
            role
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
