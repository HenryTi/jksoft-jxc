import { UqApp, useUqApp } from "app/UqApp";
import { atom } from "jotai";
import { useRef } from "react";
import { getAtomValue, setAtomValue, useEffectOnce } from "tonwa-com";

export interface Item {
    id: number;
    no: string;
    ex: string;
}
export interface UserItems {
    tonwaUser: number;
    userSite: number;
    persons: Item[];
    groups: Item[];
}

export class UserSumStore {
    readonly uqApp: UqApp;
    readonly atomList = atom(undefined as UserItems[]);

    constructor(uqApp: UqApp) {
        this.uqApp = uqApp;
    }

    private async getUserItemsList(userSite: number) {
        let { users, atoms } = await this.uqApp.uq.GetIxMySum.query({ userSite });
        let userItemsList: UserItems[] = [];
        let coll: { [user: number]: UserItems } = {}
        for (let { tonwaUser, userSite } of users) {
            let userItems: UserItems = {
                tonwaUser,
                userSite,
                persons: [],
                groups: [],
            };
            coll[userSite] = userItems;
            userItemsList.push(userItems);
        }

        for (let { userSite, atom, phrase, no, ex } of atoms) {
            let userItems = coll[userSite];
            let items: Item[];
            switch (phrase) {
                default: debugger; break;
                case 'person': items = userItems.persons as any[]; break;
                case 'sumgroup': items = userItems.groups as any[]; break;
            }
            items.push({ id: atom, no, ex });
        }
        return userItemsList;
    }

    async load() {
        let list = await this.getUserItemsList(undefined);
        setAtomValue(this.atomList, list);
    }

    async loadUserSite(userSite: number) {
        let [userItems] = await this.getUserItemsList(userSite);
        let list = getAtomValue(this.atomList);
        let index = list.findIndex(v => v.userSite === userSite);
        if (index < 0) {
            list.unshift(userItems);
        }
        else {
            list.splice(index, 1, userItems);
        }
        setAtomValue(this.atomList, [...list]);
        return userItems;
    }

    async getUserSiteFromUserId(userId: number) {
        let { userSite } = await this.uqApp.uq.UserSiteFromTonwaUser.submit({ tonwaUser: userId });
        return userSite;
    }
}

export function useUserSumStore() {
    let uqApp = useUqApp();
    let { current: userStore } = useRef(new UserSumStore(uqApp));
    useEffectOnce(() => {
        userStore.load();
    });
    return userStore;
}

export interface Selection {
    selected: number[];
    added: number[];
    removed: number[];
}
