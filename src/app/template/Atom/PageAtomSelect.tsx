import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { GenAtom } from "./GenAtom";
import { useModal } from "tonwa-app";
import { OpAtomAssigns } from "app/Biz";

interface PageAtomSelectProps {
    genAtom: GenAtom;
    assigns?: string[];
    loadOnOpen?: boolean;
}

export function PageAtomSelect({ genAtom, assigns, loadOnOpen }: PageAtomSelectProps) {
    const { closeModal } = useModal();
    const { caption, placeholder, entity: bizAtom } = genAtom.genAtomSelect;
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
        ViewItem={genAtom.ViewItemAtom}
        onItemClick={onItemClick}
    >
        {searchBox}
    </PageQueryMore>;
}
