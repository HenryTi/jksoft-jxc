import { useUqApp } from "app/UqApp";
import { IDViewUserSite } from "app/tool";
import { useRef, useState } from "react";
import { Page, useModal } from "tonwa-app";
import { List, useEffectOnce } from "tonwa-com";
import { Item, Selection, UserItems } from "./UserSumStore";
import { PageSelectAtom } from "./PageSelectAtom";
import { ListHeader, ViewAtomItem } from "./tools";

export function PageUserMap({ userItems, onChanged }: { userItems: UserItems; onChanged: (userSite: number) => Promise<void> }) {
    const { uq, biz } = useUqApp();
    const { userSite, persons, groups } = userItems;
    function ViewAtoms({ caption, atomPhrase, items }: { caption: string; atomPhrase: number; items: Item[]; }) {
        const { openModal } = useModal();
        const refAtoms = useRef<any[]>(undefined);
        const refChanged = useRef<boolean>(false);
        const [selectedItems, setSelectedItems] = useState<Item[]>(items);
        useEffectOnce(() => {
            (async function () {
                const { $page: atoms } = await uq.SearchAtom.page({ atom: atomPhrase, key: undefined }, undefined, 1000);
                refAtoms.current = atoms;
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
            if (refChanged.current === true as any) {
                await onChanged(userSite);
            }
        }
        return <>
            <ListHeader caption={caption} onEdit={onEdit} />
            <List items={selectedItems} className="d-flex" ViewItem={ViewAtomItem} />
        </>;
    }

    const atomPerson = biz.entities['person'];
    const atomSumGroup = biz.entities['sumgroup'];
    return <Page header="用户账户">
        <div className="p-3">
            <IDViewUserSite uq={uq} userSite={userSite} />
        </div>
        <ViewAtoms caption="个人" atomPhrase={atomPerson.id} items={persons} />
        <ViewAtoms caption="小组" atomPhrase={atomSumGroup.id} items={groups} />
    </Page>;
}
