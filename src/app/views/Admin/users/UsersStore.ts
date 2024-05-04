import { UqApp, useUqApp } from "app/UqApp";
import { useRef } from "react";
import { UqExt } from "uqs/UqDefault";

export class UsersStore {
    readonly uqApp: UqApp;
    readonly uq: UqExt;
    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
        this.uq = uqApp.uq;
    }

    readonly content = 'is implementing';

    get getUsers() { return this.uq.GetUsers; }

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
