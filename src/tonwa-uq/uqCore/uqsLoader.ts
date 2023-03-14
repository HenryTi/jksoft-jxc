import { UQsMan } from "./uqsMan";
import { UqData, CenterAppApi, Net } from '../net';
import { UqConfig } from "../tool";

const uqDataLocalStore = 'uq-data-local-storage';
interface UqOption {
    owner: string;
    ownerAlias: string;
    name: string;
    alias: string;
    version: string;
}

export class UQsLoader {
    protected readonly net: Net;
    protected readonly uqConfigVersion: string;
    protected readonly uqConfigs: UqConfig[];
    protected readonly uqsSchema: { [uq: string]: any; };
    protected isBuildingUQ: boolean = false;
    uqsMan: UQsMan;         // value

    constructor(net: Net, uqConfigVersion: string, uqConfigs: UqConfig[], uqsSchema: { [uq: string]: any; }) {
        this.net = net;
        this.uqConfigVersion = uqConfigVersion;
        this.uqConfigs = uqConfigs;
        this.uqsSchema = uqsSchema;
    }

    async build() {
        return await this.loadUqs();
    }

    // 返回 errors, 每个uq一行
    async loadUqs(): Promise<void> {
        this.uqsMan = new UQsMan(this.net, this.uqsSchema);
        let uqs = await this.loadUqData(this.uqConfigs);
        this.uqsMan.buildUqs(uqs, this.uqConfigVersion, this.uqConfigs, this.isBuildingUQ);
    }

    private async loadUqData(uqConfigs: UqConfig[]): Promise<UqData[]> {
        let uqs: UqOption[] = uqConfigs.map(
            v => {
                let { dev, name, version, alias } = v;
                let { name: owner, alias: ownerAlias } = dev;
                return { owner, ownerAlias, name, version, alias };
            }
        );

        /*
        let ret: UqData[] = this.loadLocal(uqs);
        if (!ret) {
            let centerAppApi = new CenterAppApi(this.net, 'tv/');
            try {
                ret = uqs.length === 0 ? [] : await centerAppApi.uqs(uqs);
            }
            catch (e) {
                debugger;
            }
            if (ret.length < uqs.length) {
                let err = `下列UQ：\n${uqs.map(v => `${v.owner}/${v.name}`).join('\n')}之一不存在`;
                console.error(err);
                throw Error(err);
            }
            //localStorage
            this.net.setLocalDbItem(uqDataLocalStore, JSON.stringify(ret));
        }
        for (let i = 0; i < uqs.length; i++) {
            let { ownerAlias, alias } = uqs[i];
            ret[i].ownerAlias = ownerAlias;
            ret[i].uqAlias = alias;
        }
        return ret;
        */
        let ret = uqs.map(v => {
            let { name, alias, owner, ownerAlias } = v;
            let uqData: UqData;
            uqData = {
                id: undefined,
                uqName: name,
                uqAlias: alias,
                uqOwner: owner,
                ownerAlias,
                access: undefined,
                newVersion: undefined,
            };
            return uqData;
        });
        return ret;
    }

    private loadLocal(uqs: UqOption[]): UqData[] {
        // localStorage
        let local = this.net.getLocalDbItem(uqDataLocalStore);
        if (!local) return;
        try {
            let ret: UqData[] = JSON.parse(local);
            for (let uq of uqs) {
                let { owner, name } = uq;
                let p = ret.findIndex(v => {
                    let { uqOwner, uqName } = v;
                    return (owner.toLowerCase() === uqOwner.toLowerCase()
                        && name.toLowerCase() === uqName.toLowerCase());
                });
                if (p < 0) return;
            }
            return ret;
        }
        catch {
            return;
        }
    }
}

export class UQsBuildingLoader extends UQsLoader {
    async build() {
        this.isBuildingUQ = true;
        let retErrors = await this.loadUqs();
        return retErrors;
    }
}
