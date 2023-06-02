import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { GenAtom } from "./GenAtom";
import { useModal } from "tonwa-app";
import { GenAMSBudsSearch, GenAtomBudsSearch, GenBuds, RowMed } from "../Bud";
import { useUqApp } from "app/UqApp";

interface PageAtomSelectProps {
    genAtom: GenAtom;
    assigns?: string[];
    loadOnOpen?: boolean;
    // genBudsSearch: GenBudsSearch;
}

export function PageAtomSelect({ genAtom, assigns, loadOnOpen }: PageAtomSelectProps) {
    const uqApp = useUqApp();
    const { closeModal } = useModal();
    const { caption, placeholder, entity } = genAtom.genAtomSelect;
    const [searchParam, setSearchParam] = useState(loadOnOpen === false ? undefined : { key: undefined as string });
    const searchBox = <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={placeholder} />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    async function onItemClick(selectedItem: RowMed) {
        closeModal(selectedItem.atom);
    }
    async function searchAtoms(param: any, pageStart: any, pageSize: number) {
        let genBuds = new GenBuds(uqApp, entity, assigns);
        let genBudsSearch = new GenAtomBudsSearch(genBuds, genBuds.entity.phrase);
        let ret = await genBudsSearch.search(param, pageStart, pageSize);
        return ret;
    }

    function ViewItem({ value }: { value: RowMed }) {
        return <div className="px-3 py-2">
            <genAtom.ViewItemAtom value={value.atom} />
        </div>;
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
