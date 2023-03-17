import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { useState } from "react";
import { useModal } from "tonwa-app";
import { FA, LMR, SearchBox } from "tonwa-com";
import { PartProps } from "../../Part";
import { DetailQuantityBase, SheetBase } from "../EditingBase";
import { PartOrigin } from "./PartOrigin";

export function PageOriginNew<S extends SheetBase, D extends DetailQuantityBase>({ Part }: PartProps<PartOrigin<S, D>>) {
    const uqApp = useUqApp();
    const { closeModal } = useModal();
    const part = uqApp.partOf(Part);
    const { editing, caption, QuerySearchSheetItem } = part;
    const [searchParam, setSearchParam] = useState({ key: undefined as string });
    const right = <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder="往来单位" />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    function ItemView({ value }: { value: any }) {
        return <LMR className="px-3 py-2 align-items-center">
            <FA name="angle-right" className="me-3" />
            <span>{JSON.stringify(value)}</span>
            <span />
        </LMR>;
    }
    const query = QuerySearchSheetItem; //JsTicket.SearchContact;
    async function onItemClick(item: any) {
        let sheet = await editing.newSheet(item.id);
        closeModal(sheet);
    }
    return <PageQueryMore header={`新建${caption}`}
        query={query}
        param={searchParam}
        sortField="id"
        ViewItem={ItemView}
        onItemClick={onItemClick}
        pageSize={4}
        pageMoreSize={1}
    >
        {right}
    </PageQueryMore>;
}
