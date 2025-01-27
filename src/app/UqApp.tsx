import { use, useContext } from 'react';
import * as jsonpack from 'jsonpack';
import { getAtomValue, setAtomValue } from 'tonwa-com';
import { AppConfig, UqAppBase, UqAppContext, ViewUqApp } from "tonwa-app";
import { UqConfig, UqMan, UqQuery, UqSites } from 'tonwa-uq';
import { UQs, uqsSchema } from "uqs";
import uqconfigJson from '../uqconfig.json';
import { appEnv } from './appEnv';
import { BizPhraseType, UqExt } from 'uqs/UqDefault';
import { atom } from 'jotai';
import { Biz } from './Biz';
import { ViewsRoutes } from './views';
import { RoleStore } from './RoleStore';

// const pathBase = 'jksoft-jxc';
const pathBase = '';
const appConfig: AppConfig = {
    version: '1.0.1',
    center: 'https://tonwa.jjol.cn',
    noUnit: true,
    oem: undefined,
    pathBase,
};

function uqConfigsFromJson(json: { devs: { [dev: string]: any }; uqs: any[]; }): UqConfig[] {
    let ret: UqConfig[] = [];
    let { devs, uqs } = json;
    for (let uq of uqs) {
        let { dev, name, alias } = uq;
        ret.push({
            dev: devs[dev],
            name,
            alias,
        });
    }
    return ret;
}

export function useUqApp() {
    let uqApp = useContext<UqApp>(UqAppContext);
    return uqApp;
}

export interface Title {
    title: string;
    vice?: string;
    unit?: string;
    fixed?: number;
}

export class UqApp extends UqAppBase<UQs> {
    timezone: number;
    unitTimezone: number;
    unitBizDate: number;
    unitBizMonth: number;
    biz: Biz;
    uq: UqExt;
    roleStore: RoleStore;
    roleStore0: RoleStore;
    readonly cache: any = {};

    get pathLogin() { return '/login'; }
    // 数据服务器提醒客户端刷新，下面代码重新调入的数据
    refresh = async () => {
        let d = Date.now() / 1000;
        let refreshTime = getAtomValue(this.refreshTime);
        if (d - refreshTime < 30) return;
        setAtomValue(this.refreshTime, d);
    }

    get uqMan(): UqMan {
        return (this.uq.$ as any).$_uqMan;
    }

    private async loadUnitTime($getTimezone: UqQuery<any, any>) {
        let ret = await $getTimezone.query({});
        let tz = ret.ret[0];
        this.timezone = tz.timezone ?? 8;
        this.unitTimezone = tz.unitTimeZone ?? 8;
        this.unitBizMonth = (tz.unitBizMonth ?? 1) - 1;
        this.unitBizDate = tz.unitBizDate ?? 1;
    }

    protected loadWithoutLogin(): Promise<void> {
        return;
    }

    protected onLoadUQs() {
        this.uq = this.uqs.UqDefault;
    }

    // 1. 可以支持多个site
    // 2. $user存放当前默认的site
    // 3. 第一次登录，允许用户选择site
    // 4. 对于多site的处理，还需要再设计
    protected override async loadOnLogined(): Promise<void> {
        await this.loginSite();
        console.log('site logined');
        await this.initRoleStore0();
    }

    _notifyCounts = atom<{ [phrase: number | BizPhraseType]: number }>({});
    get refreshAction() {
        return async (): Promise<void> => {
            let { ret } = await this.uq.GetPendsNotify.query({});
            let nc = getAtomValue(this._notifyCounts);
            let sum = 0;
            for (let pend of this.biz.pends) {
                nc[pend.id] = 0;
            }
            for (let row of ret) {
                let { phrase, count } = row;
                nc[phrase] = count;
                sum += count;
            }
            nc[BizPhraseType.sheet] = sum;
            setAtomValue(this._notifyCounts, { ...nc });
        }
    }

    clearNotifyCount(phrase: number | BizPhraseType) {
        let nc = getAtomValue(this._notifyCounts);
        nc[phrase] = 0;
        setAtomValue(this._notifyCounts, { ...nc });
    }

    atomSiteLogined = atom(false);
    loginSite = async () => {
        if (this.uqSites !== undefined) return this.biz;
        this.uqSites = new UqSites(this.uqMan);
        await this.uqSites.login();
        let { userSite } = this.uqSites;
        let siteLogined: boolean;
        if (userSite !== undefined) {
            this.uqMan.unit = userSite.siteId;
            siteLogined = true;
            let { uqApi } = this.uqMan;
            let { schemas, logs } = await uqApi.biz();
            if (schemas === undefined) {
                debugger;
                console.error('uq-api compile saved bizobject error', logs);
                this.biz = new Biz(this, undefined, logs);
            }
            else {
                console.log('schemas size: ', schemas.length);
                let bizSchema = jsonpack.unpack(schemas);
                this.biz = new Biz(this, bizSchema, undefined);
            }
            await this.initRoleStore();
        }
        else {
            siteLogined = false;
        }
        setAtomValue(this.atomSiteLogined, siteLogined);
        return this.biz;
    }

    private async initRoleStore() {
        this.roleStore = new RoleStore(this, this.uqSites.userSite);
        await this.roleStore.init();
    }

    private async initRoleStore0() {
        this.roleStore0 = new RoleStore(this, this.uqSites.userSite0);
        await this.roleStore0.init();
    }

    async setSite(site: number) {
        await this.uqSites.setSite(site);
        await this.initRoleStore();
    }
}

const uqConfigs = uqConfigsFromJson(uqconfigJson);
export function ViewMain() {
    const createUqApp = () => new UqApp(appConfig, uqConfigs, uqsSchema, appEnv);
    return <ViewUqApp createUqApp={createUqApp}>
        <ViewsRoutes />
    </ViewUqApp>;
}
