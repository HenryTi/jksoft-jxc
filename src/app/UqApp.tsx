import { useContext } from 'react';
import { getAtomValue, setAtomValue } from 'tonwa-com';
import { AppConfig, UqAppBase, UqAppContext } from "tonwa-app";
import { UqConfig, UqQuery, UqUnit, UserUnit } from 'tonwa-uq';
import { UQs, uqsSchema } from "uqs";
import uqconfigJson from '../uqconfig.json';
import { appEnv } from './appEnv';
//import { SeedUnit } from './tool';
import { UqExt } from 'uqs/UqDefault';
import { GenAtom } from './template';
import { GenSheet } from './template/Sheet';
import { Gen, GenBizEntity } from './tool';

const appConfig: AppConfig = {
    version: '0.1.0',
    center: 'https://tv.jkchemical.com',
    noUnit: true,
    oem: undefined,
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
    return useContext<UqApp>(UqAppContext);
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

    get pathLogin() { return '/login'; }
    // 数据服务器提醒客户端刷新，下面代码重新调入的数据
    refresh = async () => {
        let d = Date.now() / 1000;
        let refreshTime = getAtomValue(this.refreshTime);
        if (d - refreshTime < 30) return;
        await Promise.all([
            // this.cHome.load(),
            // this.cUnitPortal?.load(),
        ]);
        setAtomValue(this.refreshTime, d);
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

    uq: UqExt;
    // 1. 可以支持多个site
    // 2. $user存放当前默认的site
    // 3. 第一次登录，允许用户选择site
    // 4. 对于多site的处理，还需要再设计
    protected override async loadOnLogined(): Promise<void> {
        this.uq = this.uqs.UqDefault;
        await this.loginSite();
        /*
        let { ret } = await this.uq.MySites.query({});
        if (ret.length > 0) {
            // 找到第一个非0的site，做为默认的site
            for (let { id: site } of ret) {
                if (site === 0) continue;
                await this.loginSite(site);
                break;
            }
        }
        */
    }

    async loginSite() {
        let { $_uqMan } = (this.uq.$ as any);
        this.uqUnit = new UqUnit($_uqMan);
        //let user = getAtomValue(this.user);
        await this.uqUnit.login(/*user.id, site*/);
        $_uqMan.unit = this.uqUnit.userUnit?.unitId;
    }

    get siteLogined(): boolean {
        return this.uqUnit?.userUnit !== undefined;
    }

    readonly genAtoms: { [name: string]: GenAtom } = {}
    readonly genSheets: { [name: string]: GenSheet } = {}
    protected override onObjectBuilt(object: GenBizEntity<any>) {
        let { bizEntityType, bizEntityName, phrase } = object;
        switch (bizEntityType) {
            case 'atom':
                this.genAtoms[bizEntityName] = object as GenAtom;
                this.genAtoms[phrase] = object as GenAtom;
                break;
            case 'sheet':
                this.genSheets[bizEntityName] = object as GenSheet;
                this.genSheets[phrase] = object as GenSheet;
                break;
        }
    }
}

const uqConfigs = uqConfigsFromJson(uqconfigJson);
export function createUqApp() {
    return new UqApp(appConfig, uqConfigs, uqsSchema, appEnv);
}
