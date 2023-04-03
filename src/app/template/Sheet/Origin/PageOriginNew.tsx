import { useState } from "react";
import { useModal } from "tonwa-app";
import { FA, LMR, SearchBox } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { GenProps } from "app/tool";
import { GenOrigin } from "./GenOrigin";

export function PageOriginNew({ Gen }: GenProps<GenOrigin>) {
    const uqApp = useUqApp();
    const { closeModal } = useModal();
    const gen = uqApp.objectOf(Gen);
    const { editing, caption, QuerySearchItem, targetCaption } = gen;
    const [searchParam, setSearchParam] = useState<{ key: string; }>(undefined);
    async function onSearch(key: string) {
        setSearchParam({
            key,
        });
    }
    function ItemView({ value }: { value: any }) {
        return <LMR className="px-3 py-2 align-items-center">
            <FA name="angle-right" className="me-3" />
            <span>{JSON.stringify(value)}</span>
            <span />
        </LMR>;
    }
    const query = QuerySearchItem;
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
        <div className="m-3">
            选择{targetCaption}
        </div>
        <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={targetCaption} />
    </PageQueryMore>;
}
