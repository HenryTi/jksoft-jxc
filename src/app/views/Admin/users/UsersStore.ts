import { UqApp, useUqApp } from "app/UqApp";
import { atom } from "jotai";
import { useRef } from "react";
import { setAtomValue } from "tonwa-com";
import { ParamGetUsers, UqExt } from "uqs/UqDefault";

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
        return $page;
    }

    async loadUserBuds(userId: number) {
        setAtomValue(this.atomUserBuds, undefined);
        // let { buds } = await this.uq.GetUserBuds.query({ userId });
        let buds = await this.uqApp.client.GetUserBuds(userId);
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
