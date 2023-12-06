import { WritableAtom, atom } from "jotai";
import { Action } from "./action";
import { Query } from "./query";
import { UqMan } from "./uqMan";
import { getAtomValue, setAtomValue } from "tonwa-com";

export interface UserSite<T = any> {
    id: number;
    user: number;
    siteId: number;
    site: T;
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
    owners: UserSite[];
    admins: UserSite[];
    users: UserSite[];
    usersOfRole: { [role: string]: UserSite[] };
}

export enum EnumSysRole {
    user = 0,
    admin = 1,
    owner = 2,
}

export class UqSites {
    readonly uqMan: UqMan;
    private mySitesColl: { [unit: number]: UserSite };
    userSite0: UserSite;        // the root uq unit = 0;
    mySites: UserSite[];
    userSite: UserSite;         // current unit;

    constructor(uqMan: UqMan) {
        this.uqMan = uqMan;
    }

    async login() {
        await this.loadMyRoles();
    }

    loginUnit(userSite: UserSite) {
        this.userSite = userSite;   // 每次只允许一个unit展示
    }

    logoutUnit() {
        this.userSite = undefined; // this.userSite0;
    }

    hasRole(role: string[] | string) {
        if (this.userSite === undefined) return false;
        let { rolesAtom, isAdmin } = this.userSite;
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
                    site: site,
                    rolesAtom: atom<UserSite[]>([]) as any,
                    permits: {},
                } as UserSite;
                this.mySitesColl[site] = mySite;
                if (site !== 0) {
                    this.mySites.push(mySite);
                }
                else {
                    this.userSite0 = mySite;
                }
            }
            return mySite;
        }
        let userSiteDef: UserSite;
        for (let siteRow of sites) {
            let { id, site, admin, entity, assigned, def } = siteRow;
            let mySite = getMySite(site);
            mySite.id = id;
            mySite.siteId = site;
            mySite.isAdmin = ((admin & 1) === 1);
            mySite.isOwner = ((admin & 2) === 2);
            mySite.entity = entity;
            mySite.assigned = assigned;
            if (userSiteDef === undefined && mySite !== this.userSite0) {
                userSiteDef = mySite;
            }
            if (def === 1) {
                userSiteDef = mySite;
            }
        }
        this.userSite = userSiteDef;
        if (userSiteDef !== undefined) {
            let i = this.mySites.findIndex(v => v === userSiteDef);
            if (i >= 0) {
                this.mySites.splice(i, 1);
                this.mySites.unshift(userSiteDef);
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
}
