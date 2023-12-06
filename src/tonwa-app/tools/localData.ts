import { LocalCache, LocalMap } from "./localMap";

export class LocalData {
    private readonly localMap: LocalMap;
    readonly user: LocalCache;
    readonly guest: LocalCache;
    readonly unit: LocalCache;
    constructor(testing: boolean) {
        this.localMap = new LocalMap(testing === true ? '$$' : '$');
        this.user = this.localMap.child('user');
        this.guest = this.localMap.child('guest');
        this.unit = this.localMap.child('unit');
    }

    private _user: string;
    private _guest: string;
    private _unit: string;
    readToMemory() {
        this._user = this.user.get();
        this._guest = this.guest.get();
        this._unit = this.unit.get();
    }
    saveToLocalStorage() {
        this.user.set(this._user);
        this.guest.set(this._guest);
        this.unit.set(this._unit);
    }

    logoutClear() {
        [
            this.user,
            this.unit,
        ].forEach(d => d.remove());
    }
}
