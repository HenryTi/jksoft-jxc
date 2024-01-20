import { EntityIOApp } from "app/Biz";

export interface BudColl {
    [id: number]: string | number;
}

export interface DuoOuterApp {
    id: number;         // duo id
    // x: number;
    i: number;          // outer id
    ioApp: EntityIOApp;
    buds: BudColl;
}

export function budArrToColl(arr: any[]): BudColl {
    const ret: BudColl = {};
    if (arr !== undefined) {
        for (let [id, value] of arr) {
            ret[id] = value;
        }
    }
    return ret;
}