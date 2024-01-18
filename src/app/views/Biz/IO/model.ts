export interface BudColl {
    [id: number]: string | number;
}

export interface DuoObj {
    id: number;
    x: number;
    i: number;
    buds: BudColl;
}

export function budArrToColl(arr: any[]): BudColl {
    const ret: BudColl = {};
    for (let [id, value] of arr) {
        ret[id] = value;
    }
    return ret;
}