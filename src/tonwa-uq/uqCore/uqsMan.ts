import { UqMan } from './uqMan';
import { TuidImport, TuidInner } from './tuid';
import { Net, UqData } from '../net';
import { UqConfig } from '../tool';

export class UQsMan {
    private readonly net: Net;
    private readonly uqsSchema: { [uq: string]: any; };
    private collection: { [uqLower: string]: UqMan };
    uqMans: UqMan[] = [];

    constructor(net: Net, uqsSchema: { [uq: string]: any; }) {
        this.net = net;
        this.uqsSchema = uqsSchema;
        this.uqMans = [];
        this.collection = {};
    }

    buildUqs(uqDataArr: UqData[], version: string, uqConfigs: UqConfig[], isBuildingUQ: boolean) {
        this.init(uqDataArr);

        let localMap = this.net.createLocalMap('$app');
        let localCacheVersion = localMap.child('version');
        let cacheVersion = localCacheVersion.get();
        if (version !== cacheVersion) {
            for (let uqMan of this.uqMans) {
                uqMan.localMap.removeAll();
            }
            localCacheVersion.set(version);
        }

        // let retErrors = await 
        this.buildUqEntities();
        /*
        if (retErrors.length > 0) return retErrors;
        if (isBuildingUQ === false) {
            this.setTuidImportsLocal();
        }
        if (retErrors.length > 0) return retErrors;
        */
        if (uqConfigs) {
            for (let uqConfig of uqConfigs) {
                let { dev, name, alias } = uqConfig;
                let { name: owner, alias: ownerAlias } = dev;
                let uqLower = (ownerAlias ?? owner).toLowerCase() + '/' + (alias ?? name).toLowerCase();
                let uq = this.collection[uqLower];
                uq.config = uqConfig;
            }
        }
        // this.proxy = this.buildUQs();
    }

    uq(uqName: string): UqMan {
        return this.collection[uqName.toLowerCase()];
    }

    async getUqUserRoles(uqLower: string): Promise<string[]> {
        let uqMan = this.collection[uqLower];
        if (uqMan === undefined) return null;
        let roles = await uqMan.getRoles();
        return roles;
    }

    init(uqsData: UqData[]) {
        for (let uqData of uqsData) {
            let { uqOwner, ownerAlias, uqName, uqAlias } = uqData;

            // 原名加入collection
            let uqFullName = uqOwner + '/' + uqName;
            let uqFull = this.collection[uqFullName];
            let uq: UqMan;
            if (uqFull) {
                uq = uqFull;
            }
            else {
                let uqSchema = this.uqsSchema[uqFullName];
                uq = new UqMan(this.net, uqData, uqSchema);
                this.collection[uqFullName] = uq;
            }
            this.uqMans.push(uq);
            let lower = uqFullName.toLowerCase();
            this.collection[lower] = uq;

            // 别名加入collection
            if (uqAlias) uqName = uqAlias;
            if (ownerAlias) uqOwner = ownerAlias;
            uqFullName = uqOwner + '/' + uqName;
            lower = uqFullName.toLowerCase();
            this.collection[lower] = uq;
        }
    }

    buildUqEntities(): void {
        //let retErrors: string[] = [];
        //let promises: PromiseLike<string>[] = [];
        //let lowerUqNames:string[] = [];
        // collection有小写名字，还有正常名字
        //for (let i in this.collection) {
        for (let uqMan of this.uqMans) {
            //let lower = (i as string).toLowerCase();
            //if (lowerUqNames.indexOf(lower) >= 0) continue;
            //lowerUqNames.push(lower);
            //let uq = this.collection[i];
            // promises.push(uqMan.loadEntities());
            uqMan.buildEntities();
        }
        /*
        let results = await Promise.all(promises);
        for (let result of results) {
            let retError = result; // await cUq.loadSchema();
            if (retError !== undefined) {
                retErrors.push(retError);
            }
        }
        return retErrors;
        */
    }

    /*
    private buildUQs(): any {
        let uqs: any = {};
        function setUq(uqKey: string, proxy: any): void {
            if (!uqKey) return;
            let lower = uqKey.toLowerCase();
            uqs[uqKey] = proxy;
            if (lower !== uqKey) uqs[lower] = proxy;
        }
        for (let uqMan of this.uqMans) {
            let proxy = uqMan.createProxy();
            setUq(uqMan.getUqKey(), proxy);
            setUq(uqMan.getUqKeyWithConfig(), proxy);
        }
        return new Proxy(uqs, {
            get: (target, key, receiver) => {
                let lk = (key as string).toLowerCase();
                let ret = target[lk];
                if (ret !== undefined) return ret;
                this.errUndefinedUq(String(key));
            },
        });
    }

    private errUndefinedUq(uq: string) {
        let message = `UQ ${uq} not defined`;
        let err = new Error(message);
        err.name = UqError.unexist_uq;
        throw err;
    }
*/

    getUqMans() {
        return this.uqMans;
    }

    setTuidImportsLocal(): string[] {
        let ret: string[] = [];
        for (let uqMan of this.uqMans) {
            for (let tuid of uqMan.tuidArr) {
                if (tuid.isImport === true) {
                    let error = this.setInner(tuid as TuidImport);
                    if (error) ret.push(error);
                }
            }
        }
        return ret;
    }

    private setInner(tuidImport: TuidImport): string {
        let { from } = tuidImport;
        let fromName = from.owner + '/' + from.uq;
        let uq = this.collection[fromName];
        if (uq === undefined) {
            //debugger;
            //if (this.net.props.buildingUq !== true) {
            //    console.error(`setInner(tuidImport: TuidImport): uq ${fromName} is not loaded`);
            //}
            return;
        }
        let iName = tuidImport.name
        let tuid = uq.tuid(iName);
        if (tuid === undefined) {
            //debugger;
            return `setInner(tuidImport: TuidImport): uq ${fromName} has no Tuid ${iName}`;
        }
        if (tuid.isImport === true) {
            //debugger;
            return `setInner(tuidImport: TuidImport): uq ${fromName} Tuid ${iName} is import`;
        }
        tuidImport.setFrom(tuid as TuidInner);
    }
}
