import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { useUqApp } from "app/UqApp";
import { GenProps } from "app/tool";
import { GenAtom } from "./GenAtom";
import { useModal } from "tonwa-app";
import { OpAtomAssigns } from "app/Biz";

interface PageAtomSelectProps<G extends GenAtom> extends GenProps<G> {
    ViewItem?: ({ value }: { value: any }) => JSX.Element;
    assigns?: string[]
}

export function PageAtomSelect<G extends GenAtom>({ Gen, ViewItem, assigns }: PageAtomSelectProps<G>) {
    const { closeModal } = useModal();
    const uqApp = useUqApp();
    const { caption, placeholder, bizAtom, autoLoadOnOpen } = uqApp.objectOf(Gen);
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
    async function searchAtoms(param: any, pageStart: any, pageSize: number) {
        let opAtomAssigns = new OpAtomAssigns(bizAtom, assigns);
        let ret = await opAtomAssigns.search(param, pageStart, pageSize);
        return ret;
    }

    return <PageQueryMore header={`选择${caption}`}
        query={searchAtoms}
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
