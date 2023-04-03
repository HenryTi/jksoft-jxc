import { ViceTitle } from "app/coms";
import { GenProps } from "app/tool";
import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { IDView, Page, useModal } from "tonwa-app";
import { FA, List, LMR, SearchBox } from "tonwa-com";
import { GenDerive } from "./GenDerive";

interface SheetGroup {
    target: number;
    sheets: any[];
}

export function PageDeriveSelect({ Gen }: GenProps<GenDerive>) {
    const uqApp = useUqApp();
    const { closeModal } = useModal();
    const gen = uqApp.objectOf(Gen);
    const { editing } = gen;
    const uq = uqApp.uqs.UqDefault;
    const [items, setItems] = useState(null as SheetGroup[]);
    async function onSearch(key: string) {
        let sheetGroups = await editing.search(key);
        setItems(sheetGroups);
    }
    function onSelected(item: any) {
        closeModal(item.id);
    }
    function ViewItemGroup({ value }: { value: SheetGroup }) {
        const { target, sheets } = value;
        return <div className="py-2">
            <ViceTitle>
                <IDView uq={uq} id={target} />
            </ViceTitle>
            <List items={sheets} ViewItem={ViewItemSheet} onItemClick={onSelected} />
        </div>
    }
    function ViewItemSheet({ value }: { value: any[] }) {
        return <LMR className="px-3 py-2">
            <span>{JSON.stringify(value)}</span>
            <FA name="angle-right" />
        </LMR>;
    }
    return <Page header={`新建${gen.caption}`}>
        <div className="m-3">
            选择{gen.origin.caption}
        </div>
        <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={'供应商号或名称，或者单据号'} />
        <List items={items} ViewItem={ViewItemGroup} />
    </Page>
}
