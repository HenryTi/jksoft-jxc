import { useContext } from 'react';
import { getAtomValue, setAtomValue } from 'tonwa-com';
import { AppConfig, UqAppBase, UqAppContext } from "tonwa-app";
import { UqConfig, UqQuery } from 'tonwa-uq';
import { UQs, uqsSchema } from "uqs";
import uqconfigJson from '../uqconfig.json';
import { appEnv } from './appEnv';
//import { SeedUnit } from './tool';
import { UqExt } from 'uqs/UqDefault';
import { GenAtom } from './template';

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

    protected override async loadOnLogined(): Promise<void> {
        // this.setUnit(99);
        let { ret } = await this.uq.MyUnits.query({});
        if (ret.length > 0) {
            let { id: unit } = ret[0];
            this.setUnit(unit);
        }
    }

    private uqDefault: any;
    unit: number = 0;
    get uq() {
        let ret: UqExt;
        if (this.uqDefault === undefined) {
            this.uqDefault = ret = this.uqs.UqDefault;
            (ret.$ as any).$_uqMan.unit = this.unit;
        }
        else {
            ret = this.uqDefault;
        }
        return ret;
    }
    setUnit(unit: number) {
        this.unit = unit;
        this.uqDefault = undefined;
    }

    readonly genAtoms: { [name: string]: GenAtom } = {}
    protected onObjectBuilt(object: any) {
        let { bizEntityType, bizEntityName } = object;
        if (bizEntityType === 'atom') {
            this.genAtoms[bizEntityName] = object;
        }
    }
}

const uqConfigs = uqConfigsFromJson(uqconfigJson);
export function createUqApp() {
    return new UqApp(appConfig, uqConfigs, uqsSchema, appEnv);
}
// export const uqApp = new UqApp(appConfig, uqConfigs, uqsSchema, appEnv);
/*
export function ViewUqApp() {
    return <ViewUqAppBase uqApp={uqApp}>
        <ViewsRoutes />
    </ViewUqAppBase>
}
*/