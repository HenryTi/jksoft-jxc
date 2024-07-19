import { useUqApp } from "app/UqApp";
import { ButtonRightAdd } from "app/coms";
import { IDViewUserSite } from "app/tool";
import { centers } from "app/views/center";
import { Page, SelectUser, useModal } from "tonwa-app";
import { FA, LMR, List } from "tonwa-com";
import { User } from "tonwa-uq";
import { Item, UserItems, useUserSumStore } from "./UserSumStore";
import { useAtomValue } from "jotai";
import { PageUserMap } from "./PageUserMap";
import { ListHeader, ViewAtomItem } from "./tools";

export function PageUserSum() {
    const { uq } = useUqApp();
    const modal = useModal();
    const userStore = useUserSumStore();
    const list = useAtomValue(userStore.atomList);
    /*
    const [list, setList] = useState<UserItems[]>(undefined);
    useEffectOnce(() => {
        (async function () {
            let userItemsList = await getUserItemsList(undefined);
            setList(userItemsList);
        })();
    })
    async function getUserItemsList(userSite: number) {
        let { users, atoms } = await uq.GetIxMySum.query({ userSite });
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
    async function onChanged(userSite: number) {
        let [userItems] = await getUserItemsList(userSite);
        let index = list.findIndex(v => v.userSite === userSite);
        if (index < 0) {
            list.unshift(userItems);
        }
        else {
            list.splice(index, 1, userItems);
        }
        setList([...list]);
    }
    */
    async function onChanged(userSite: number) {
        userStore.loadUserSite(userSite);
    }
    async function onAdd() {
        let user = await modal.open<User>(<SelectUser />);
        if (!user) return;
        // let { userSite } = await uq.UserSiteFromTonwaUser.submit({ tonwaUser: user.id });
        let userSite = await userStore.getUserSiteFromUserId(user.id);
        //let [userItems] = await getUserItemsList(userSite);
        let userItems = await userStore.loadUserSite(userSite);
        // let userItems = getAtomValue(userStore.atomList);
        await modal.open(<PageUserMap userItems={userItems} onChanged={onChanged} />);
    }
    function ViewItem({ value }: { value: UserItems }) {
        const { userSite, persons, groups } = value;
        function ViewItems({ caption, items }: { caption: string; items: Item[] }) {
            if (items.length === 0) return null;
            return <div className="bg-white">
                <ListHeader caption={caption} onEdit={undefined} />
                <List items={items} className="d-flex" ViewItem={ViewAtomItem} itemKey={item => item.id} />
            </div>;
        }
        async function onEdit() {
            let userItems = await userStore.loadUserSite(userSite);
            let ret = await modal.open(<PageUserMap userItems={userItems} onChanged={onChanged} />);
            if (ret === undefined) return;
        }
        return <div className="pt-3 mb-3 border-bottom bg-white">
            <LMR className="px-3 pb-3">
                <IDViewUserSite uq={uq} userSite={userSite} />
                <div className="text-info cursor-pointer" onClick={onEdit}>
                    <FA name="pencil" />
                </div>
            </LMR>
            <ViewItems caption="个人" items={persons} />
            <ViewItems caption="小组" items={groups} />
        </div>
    }
    return <Page header={centers.userSum.caption} right={<ButtonRightAdd onClick={onAdd} />}>
        <div className="tonwa-bg-gray-3">
            <List items={list} ViewItem={ViewItem} itemKey={item => item.userSite} />
        </div>
    </Page>;
}
