import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { UqQuery } from "tonwa-uq";
import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { PartProps } from "../Part";
import { PartID } from "./PartID";
import { useModal } from "tonwa-app";
import { QueryMore } from "app/tool";

interface PageIDSelectProps {
    ViewItem?: ({ value }: { value: any }) => JSX.Element;
    query?: QueryMore;
}

export function PageIDSelect({ Part, query, ViewItem }: PartProps<PartID> & PageIDSelectProps) {
    const { closeModal } = useModal();
    const uqApp = useUqApp();
    const { caption, placeholder, searchItems: searchItemsInPart, ViewItemID: ViewItemInPart, autoLoadOnOpen } = uqApp.objectOf(Part);
    query = query ?? searchItemsInPart;
    ViewItem = ViewItem ?? ViewItemInPart;
    const [searchParam, setSearchParam] = useState(autoLoadOnOpen === true ? { key: undefined as string } : undefined);
    const searchBox = <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={placeholder} />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    async function onItemClick(selectedItem: any) {
        closeModal(selectedItem);
    }
    return <PageQueryMore header={`选择${caption}`}
        query={query}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
        pageSize={8}
        pageMoreSize={2}
    >
        {searchBox}
    </PageQueryMore>;
}
