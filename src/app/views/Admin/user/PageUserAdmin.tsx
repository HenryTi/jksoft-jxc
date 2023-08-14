import { useUqApp } from "app/UqApp";
import { ButtonRightAdd } from "app/coms";
import { ViewAtom } from "app/views/ViewAtom";
import { ChangeEvent, useRef, useState } from "react";
import { IDView, Page, SelectUser, ViewUserAssigned, useModal } from "tonwa-app";
import { FA, LMR, List, useEffectOnce } from "tonwa-com";
import { Uq, User } from "tonwa-uq";
import { Atom } from "uqs/UqDefault";

export const pathUser = 'admin-user';
export const captionUser = '用户管理';

interface Item {
    id: number;
    no: string;
    ex: string;
}
interface UserItems {
    tonwaUser: number;
    userSite: number;
    persons: Item[];
    groups: Item[];
}
export function PageUserAdmin() {
    const { uq } = useUqApp();
    const { openModal } = useModal();
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
                case 'atom.person': items = userItems.persons as any[]; break;
                case 'atom.sumgroup': items = userItems.groups as any[]; break;
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
    async function onAdd() {
        let user = await openModal<User>(<SelectUser />);
        if (!user) return;
        let { userSite } = await uq.UserSiteFromTonwaUser.submit({ tonwaUser: user.id });
        let [userItems] = await getUserItemsList(userSite);
        await openModal(<PageUserMap userItems={userItems} onChanged={onChanged} />);
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
            let [userItems] = await getUserItemsList(userSite);
            let ret = await openModal(<PageUserMap userItems={userItems} onChanged={onChanged} />);
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
    return <Page header={captionUser} right={<ButtonRightAdd onClick={onAdd} />}>
        <div className="tonwa-bg-gray-3">
            <List items={list} ViewItem={ViewItem} itemKey={item => item.userSite} />
        </div>
    </Page>;
}

function ListHeader({ caption, onEdit }: { caption: string; onEdit: () => Promise<void>; }) {
    const cnHeader = ' tonwa-bg-gray-1 small d-flex align-items-end';
    let vEditButton: any;
    if (onEdit !== undefined) {
        vEditButton = <div className="text-primary cursor-pointer py-2 px-3" onClick={onEdit}><FA name="pencil" /></div>;
    }
    return <div className={cnHeader}>
        <div className="flex-grow-1 ps-3 py-2">{caption}</div>
        {vEditButton}
    </div>
}

function ViewAtomItem({ value }: { value: any }) {
    return <div className="px-3 py-2 mx-3 my-2 border rounded-2 w-min-12c">
        <ViewAtom value={value} />
    </div>
}

function PageUserMap({ userItems, onChanged }: { userItems: UserItems; onChanged: (userSite: number) => Promise<void> }) {
    const { uq } = useUqApp();
    const { userSite, persons, groups } = userItems;
    function ViewAtoms({ caption, atomPhrase, items }: { caption: string; atomPhrase: string; items: Item[]; }) {
        const { openModal } = useModal();
        const refAtoms = useRef<any[]>(undefined);
        const refChanged = useRef<boolean>(false);
        const [selectedItems, setSelectedItems] = useState<Item[]>(items);
        useEffectOnce(() => {
            (async function () {
                const { $page: atoms } = await uq.SearchAtom.page({ atom: atomPhrase, key: undefined }, undefined, 1000);
                refAtoms.current = atoms;
                // selectedChanged(selected)
            })();
        })
        function selectedChanged(newSelected: number[]) {
            let ret = refAtoms.current.filter(v => {
                let { id } = v;
                return newSelected.find(s => s === id) >= 0;
            })
            setSelectedItems(ret as any[]);
        }
        async function onEdit() {
            refChanged.current = false;
            async function onSelectChanged(selection: Selection) {
                let { selected: newSelected, added, removed } = selection;
                await uq.ChangeIxMySum.submit({
                    userSite,
                    added: added.map(v => ({ id: v })),
                    removed: removed.map(v => ({ idDel: v })),
                });
                selectedChanged(newSelected);
                refChanged.current = true;
            }
            let selected: number[] = selectedItems.map(v => v.id);
            await openModal<Selection>(<PageSelectAtom atoms={refAtoms.current as any[]} selected={selected} onSelectChanged={onSelectChanged} />);
            // if (ret === undefined) return;
            if (refChanged.current === true as any) {
                await onChanged(userSite);
            }
        }
        return <>
            <ListHeader caption={caption} onEdit={onEdit} />
            <List items={selectedItems} className="d-flex" ViewItem={ViewAtomItem} />
        </>;
    }

    return <Page header="用户账户">
        <div className="p-3">
            <IDViewUserSite uq={uq} userSite={userSite} />
        </div>
        <ViewAtoms caption="个人" atomPhrase="atom.person" items={persons} />
        <ViewAtoms caption="小组" atomPhrase="atom.sumgroup" items={groups} />
    </Page>;
}

interface Selection {
    selected: number[];
    added: number[];
    removed: number[];
}
function PageSelectAtom({ atoms, selected: selectedList, onSelectChanged }: {
    atoms: Atom[];
    selected: number[];
    onSelectChanged: (selection: Selection) => Promise<void>;
}) {
    const { closeModal } = useModal();
    const refSel = useRef<Selection>({ selected: [...selectedList], added: [], removed: [], });
    const list = atoms.map(v => {
        const { id } = v;
        return { atom: v, sel: selectedList.find(s => s === id) !== undefined };
    });
    function ViewItem({ value: { atom, sel } }: { value: { atom: Atom; sel: boolean; }; }) {
        async function onChange(evt: ChangeEvent<HTMLInputElement>) {
            let { id } = atom;
            const { selected, added, removed } = refSel.current;
            let indexSelectedList = selectedList.findIndex(v => v === id);
            let indexSelected = selected.findIndex(v => v === id);
            let indexAdded = added.findIndex(v => v === id);
            let indexRemoved = removed.findIndex(v => v === id);
            if (evt.currentTarget.checked === true) {
                if (indexSelectedList < 0) {
                    added.push(id);
                }
                else {
                    if (indexRemoved >= 0) removed.splice(indexRemoved, 1);
                }
                if (indexSelected < 0) selected.push(id);
            }
            else {
                if (indexSelectedList < 0) {
                    if (indexAdded >= 0) added.splice(indexAdded, 1);
                }
                else {
                    removed.push(id);
                }
                if (indexSelected >= 0) selected.splice(indexSelected, 1);
            }
            await onSelectChanged(refSel.current);
        }
        return <label className="d-flex p-3">
            <input type="checkbox" className="form-check-input me-3" defaultChecked={sel} onChange={onChange} />
            <ViewAtom value={atom} />
        </label>;
    }
    function onClose() {
        closeModal(refSel.current);
    }
    return <Page header="请选择">
        <List items={list} ViewItem={ViewItem} />
        <div className="p-3">
            <button className="btn btn-primary" onClick={onClose}>关闭</button>
        </div>
    </Page>;
}

function IDViewUserSite({ uq, userSite }: { uq: Uq; userSite: number; }) {
    function ViewUserSite({ value }: { value: any }) {
        const { assigned } = value;
        function ViewUserHere({ value }: { value: any }) {
            return <ViewUserAssigned user={value} assigned={assigned} />;
        }
        return <IDView uq={uq} id={value.user} Template={ViewUserHere} />;
    }
    return <IDView uq={uq} id={userSite} Template={ViewUserSite} />
}