import { ViceTitle } from "app/coms";
import { PartProps } from "app/template/Part";
import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { IDView, Page, useModal } from "tonwa-app";
import { FA, List, LMR, SearchBox } from "tonwa-com";
import { DetailBase, SheetBase } from "../EditingBase";
import { PartDerive } from "./PartDerive";

interface SheetGroup {
    target: number;
    sheets: any[];
}

export function PageDeriveSelect<S extends SheetBase, D extends DetailBase>({ Part }: PartProps<PartDerive<S, D>>) {
    const uqApp = useUqApp();
    const { closeModal } = useModal();
    const part = uqApp.partOf(Part);
    const { editing } = part;
    const uq = uqApp.uqs.JsTicket;
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
    return <Page header={`选择${part.origin.caption}`}>
        <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={'供应商号或名称，或者单据号'} />
        <List items={items} ViewItem={ViewItemGroup} />
    </Page>
}
