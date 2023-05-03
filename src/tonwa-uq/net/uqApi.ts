import { HttpChannel } from './httpChannel';
import { ApiBase } from './apiBase';
import { LocalMap } from '../tool';
import { Net } from './Net';
import { UqMan } from '../uqCore';

interface UqLocal {
    user: number;
    unit: number;
    value: any;
    tick?: number;
    isNet?: boolean;
}

export class UqApi extends ApiBase {
    private readonly uq: UqMan;

    constructor(uqMan: UqMan) {
        let { net, baseUrl } = uqMan;
        super(net, baseUrl);
        this.uq = uqMan;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        return await this.net.getHttpChannel(this.uq.name);
    }

    protected customHeader(): { [key: string]: string } {
        let { unit } = this.uq;
        if (unit === undefined) return;
        return { unit: String(unit) };
    }

    async loadEntities(): Promise<any> {
        let ret = await this.get('entities');
        return ret;
    }
    async bizSheet(id: number, act: string): Promise<void> {
        await this.post('biz', { id, act });
    }
    async bizSheetAct(id: number, detail: string, act: string): Promise<any[]> {
        let ret = await this.post('biz-sheet-act', { id, detail, act });
        return ret;
    }
    async getAdmins(): Promise<any[]> {
        let ret = await this.get('get-admins');
        return ret;
    }
    async setMeAdmin(): Promise<void> {
        await this.get('set-me-admin');
    }
    async setAdmin(user: number, role: number, assigned: string): Promise<void> {
        await this.post('set-admin', { user, role, assigned });
    }
    async isAdmin(): Promise<boolean> {
        let ret = await this.get('is-admin');
        return ret;
    }
    async getRoles(): Promise<string[]> {
        let ret = await this.get('get-roles',);
        if (!ret) return null;
        let arr: string[] = (ret as string).split('|');
        let s: string[] = [];
        for (let p of arr) {
            p = p.trim();
            if (!p) continue;
            s.push(p);
        }
        if (s.length === 0) return null;
        return s;
    }
    async getAllRoleUsers(): Promise<{ user: number, admin: number, roles: string }[]> {
        let ret = await this.get('get-all-role-users');
        return ret;
    }
    async setUserRoles(theUser: number, roles: string): Promise<void> {
        await this.post('set-user-roles', { theUser, roles });
    }
    async deleteUserRoles(theUser: number): Promise<void> {
        await this.get('delete-user-roles', { theUser });
    }

    async allSchemas(): Promise<any> {
        return await this.get('all-schemas');
    }

    async schema(name: string): Promise<any> {
        return await this.get('schema/' + name);
    }

    async queueModify(start: number, page: number, entities: string) {
        return await this.post('queue-modify', { start: start, page: page, entities: entities });
    }

    async syncUser(user: number) {
        return await this.post('sync-user', { user });
    }
}

export abstract class CenterApiBase extends ApiBase {
    protected async getHttpChannel(): Promise<HttpChannel> {
        return this.net.getCenterChannel();
    }
}

const uqTokensName = 'uqTokens';
export class UqTokenApi extends CenterApiBase {
    private readonly localMap: LocalMap;

    constructor(net: Net, path: string) {
        super(net, path);
        this.localMap = net.createLocalMap(uqTokensName);
    }

    clearLocal() {
        this.localMap.removeAll();
    }

    async uq(params: { unit: number, uqOwner: string, uqName: string }): Promise<any> {
        let { uqOwner, uqName } = params;
        let un = uqOwner + '/' + uqName;
        let localCache = this.localMap.child(un);
        try {
            let uqLocal: UqLocal = localCache.get();
            if (uqLocal !== undefined) {
                let { unit, user } = uqLocal;
                if (unit !== params.unit || user !== this.net.loginedUserId) {
                    localCache.remove();
                    uqLocal = undefined;
                }
            }
            let nowTick = Math.floor(Date.now() / 1000);
            if (uqLocal !== undefined) {
                let { tick, value } = uqLocal;
                if (value !== undefined && (nowTick - tick) < 24 * 3600) {
                    return Object.assign({}, value);
                }
            }
            let uqParams: any = Object.assign({}, params);
            //uqParams.testing = this.net.hostMan.testing;
            let ret = await this.get('open/uq-token', uqParams);
            if (ret === undefined) {
                let { unit, uqOwner, uqName } = params;
                let err = `center get app-uq(unit=${unit}, '${uqOwner}/${uqName}') - not exists or no unit-service`;
                throw err;
            }

            uqLocal = {
                unit: params.unit,
                user: this.net.loginedUserId,
                tick: nowTick,
                value: ret,
            }
            localCache.set(uqLocal);
            return Object.assign({}, ret);
        }
        catch (err) {
            localCache.remove();
            throw err;
        }
    }
}

export class CallCenterApi extends CenterApiBase {
    directCall(url: string, method: string, body: any): Promise<any> {
        return this.call(url, method, body);
    }
}

export interface UqAppData {
    appName: string;
    appOwner: string;
    id: number;
    version: string;        // AppUI version
    uqs: UqData[];
}

export interface UqData {
    id: number;
    uqOwner: string;
    ownerAlias: string;
    uqName: string;
    uqAlias: string;
    access: string;
    newVersion: boolean;
}

export interface UqServiceData {
    id: number;
    db: string;
    url: string;
    urlTest: string;
    token: string;
}

//const appUqsName = 'appUqs';

export class CenterAppApi extends CenterApiBase {
    async appUqs(appOwner: string, appName: string): Promise<UqAppData> {
        let ret: UqAppData = await this.get('tie/app-uqs', { appOwner, appName });
        return ret;
    }
    async uqs(uqs: { owner: string; name: string; version: string }[]): Promise<UqData[]> {
        return await this.post('open/pure-uqs', uqs);
    }
    async unitxUq(unit: number): Promise<UqServiceData> {
        return await this.get('tie/unitx-uq', { unit: unit });
    }
    async changePassword(param: { orgPassword: string, newPassword: string }) {
        return await this.post('tie/change-password', param);
    }

    async userQuit(): Promise<void> {
        await this.get('tie/user-ask-quit', {});
    }
}
