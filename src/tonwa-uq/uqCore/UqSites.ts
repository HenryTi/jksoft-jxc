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
    rolesAtom: WritableAtom<number[], any, any>;
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

abstract class LocalValue<T> {
    readonly name: string;
    value: T;
    constructor(name: string) {
        this.name = name;
        let ret = localStorage.getItem(this.name);
        this.value = this.fromString(ret);
    }

    protected abstract fromString(v: string): T;
    protected abstract toString(): string;
    set(v: T) {
        this.value = v;
        let r = this.toString();
        localStorage.setItem(this.name, r);
    }
    remove() {
        localStorage.removeItem(this.name);
    }
}
class LocalNumber extends LocalValue<number> {
    protected override fromString(v: string): number {
        let r = Number(v);
        if (Number.isNaN(r) === true) return;
        return r;
    }
    protected override toString(): string {
        return String(this.value);
    }
}

export class UqSites {
    private readonly localSiteId: LocalNumber;
    readonly uqMan: UqMan;
    private mySitesColl: { [unit: number]: UserSite };
    userSite0: UserSite;        // the root uq unit = 0;
    mySites: UserSite[];
    userSite: UserSite;         // current unit;

    constructor(uqMan: UqMan) {
        this.uqMan = uqMan;
        this.localSiteId = new LocalNumber('localSiteId');
        const { value } = this.localSiteId;
        if (!value) debugger;
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

    hasRole(role: number[] | number) {
        if (this.userSite === undefined) return false;
        let { rolesAtom, isAdmin } = this.userSite;
        if (isAdmin === true) return true;
        if (rolesAtom === undefined) return false;
        let roles = getAtomValue(rolesAtom);
        if (Array.isArray(role) === true) {
            let arr = role as number[];
            for (let item of arr) {
                let ret = roles.indexOf(item) >= 0;
                if (ret === true) return true;
            }
            return false;
        }
        else {
            return roles.indexOf(role as number) >= 0;
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
        this.localSiteId.set(site);
        let act: Action = this.uqMan.entities['$setsite'] as any;
        await act.submit({ site });
        await this.reloadMyRoles();
    }

    private getMySite(site: number) {
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

    private async loadMyRoles(): Promise<void> {
        if (this.mySitesColl !== undefined) return;
        this.mySites = [];
        this.mySitesColl = {};
        let query: Query = this.uqMan.entities['$role_my'] as any;
        let results = await query.query({});
        let { sites, roles, permits } = results;
        let localSiteId = this.localSiteId.value;
        if (localSiteId === 0) localSiteId = undefined;
        let userSiteDef: UserSite, localSite: UserSite;
        for (let siteRow of sites) {
            let { id, site, admin, entity, assigned, def } = siteRow;
            let mySite = this.getMySite(site);
            mySite.id = id;
            mySite.siteId = site;
            mySite.isAdmin = ((admin & 1) === 1);
            mySite.isOwner = ((admin & 2) === 2);
            mySite.entity = entity;
            mySite.assigned = assigned;

            if (site === localSiteId) {
                localSite = mySite;
            }
            if (userSiteDef === undefined && mySite !== this.userSite0) {
                userSiteDef = mySite;
            }
            if (def === 1) {
                userSiteDef = mySite;
            }
        }
        if (localSite !== undefined) userSiteDef = localSite;
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
            let mySite = this.getMySite(site);
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
            let mySite = this.getMySite(site);
            mySite.permits[permit] = true;
        }
    }
}
