import { UqApp, useUqApp } from "app/UqApp";
import { atom } from "jotai";
import { useRef } from "react";
import { setAtomValue } from "tonwa-com";
import { ParamGetUsers, ReturnGetUsers$page, UqExt } from "uqs/UqDefault";

/*
export interface UserBudValues extends ReturnGetUsers$page {
    buds: { [budId: number]: string | number };
}
*/
export class UsersStore {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    readonly atomUserBuds = atom(undefined as { [bud: number]: (string | number)[] });

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.uq = uqApp.uq;
    }

    readonly content = 'is implementing';

    getUserBuds = async (param: ParamGetUsers, pageStart: any, pageSize: number) => {
        let { $page } = await this.uq.GetUsers.page(param, pageStart, pageSize);
        // let budColl: { [userId: number]: { [bud: number]: string | number } } = {};
        // let ret: UserBudValues[] = [];
        /*
        for (let budValue of buds) {
            const { userSite, bud, value } = budValue
            let item = budColl[userSite];
            if (item === undefined) {
                budColl[userSite] = item = {};
            }
            item[bud] = value;
        }
        for (let p of $page as UserBudValues[]) {
            const { userSite } = p;
            (p as UserBudValues).buds = budColl[userSite];
            ret.push(p);
        }
        */
        return $page; // ret;
    }

    async loadUserBuds(userId: number) {
        setAtomValue(this.atomUserBuds, undefined);
        let { buds } = await this.uq.GetUserBuds.query({ userId });
        let coll: { [bud: number]: (string | number)[]; } = {};
        for (let { bud, value } of buds) {
            coll[bud] = JSON.parse(value);
        }
        setAtomValue(this.atomUserBuds, coll);
    }

    async saveUserBuds(userId: number, data: any) {
        let budsArr = data;
        await this.uq.SaveUserBuds.submit({ id: userId, budsArr });
    }
}

export function useUsersStore() {
    const uqApp = useUqApp();
    const { current: usersStore } = useRef(new UsersStore(uqApp));
    return usersStore;
}
