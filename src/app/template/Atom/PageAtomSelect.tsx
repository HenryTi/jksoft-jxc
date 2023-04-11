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
    assigns?: string[];
    loadOnOpen?: boolean;
}

export function PageAtomSelect<G extends GenAtom>({ Gen, ViewItem, assigns, loadOnOpen }: PageAtomSelectProps<G>) {
    const { closeModal } = useModal();
    const uqApp = useUqApp();
    const gen = uqApp.objectOf(Gen);
    const { caption, placeholder, bizAtom } = gen.genAtomSelect;
    const [searchParam, setSearchParam] = useState(loadOnOpen === false ? undefined : { key: undefined as string });
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

    // pageSize={8}
    // pageMoreSize={2}
    return <PageQueryMore header={`选择${caption}`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
    >
        {searchBox}
    </PageQueryMore>;
}
