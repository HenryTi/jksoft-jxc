import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { useModal } from "tonwa-app";
import { RowMed, useAtomBudsSearch } from "../BudSelect";
import { useUqApp } from "app/UqApp";
import { AtomPhrase, PropsAtomSelect } from "app/tool";
import { EntityAtom } from "app/Biz";
import { Atom } from "uqs/UqDefault";

export function useSelectAtom() {
    const { openModal } = useModal();
    return async function (atom: EntityAtom, buds?: number[], viewTop?: any) {
        let ret = await openModal<AtomPhrase>(<PageAtomSelect atom={atom} buds={buds} />);
        return ret;
    }
}

export function PageAtomSelect(props: PropsAtomSelect) {
    const { buds, loadOnOpen, caption, placeholder, atom } = props;
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { closeModal } = useModal();

    // const ViewItemAtom = uqApp.gAtoms[entityAtom.name]?.ViewItem; //useBizAtomViewItem(entityAtom)
    // const { caption, placeholder, entity } = genAtom.genAtomSelect;
    const [searchParam, setSearchParam] = useState(loadOnOpen === false ? undefined : { key: undefined as string });
    const entityAtomCaption = atom.caption ?? atom.name;
    const searchBox = <SearchBox className="px-3 py-2"
        onSearch={onSearch}
        placeholder={placeholder ?? (entityAtomCaption + ' 编号或描述')} />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    async function onItemClick(selectedItem: RowMed) {
        let ret = selectedItem.atom;
        closeModal(ret);
    }
    let atomBudsSearch = useAtomBudsSearch({ entity: atom, buds, });
    async function searchAtoms(param: any, pageStart: any, pageSize: number) {
        let ret = await atomBudsSearch.search(param, pageStart, pageSize);
        return ret;
    }

    function ViewItem({ value }: { value: RowMed }) {
        return <div className="px-3 py-2">
            <ViewAtom value={value.atom} />
        </div>;
    }
    return <PageQueryMore header={`选择${caption ?? entityAtomCaption}`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
    >
        {searchBox}
    </PageQueryMore>;
}

function ViewAtom({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <div>
        <div><b>{ex}</b></div>
        <div className='small text-secondary'>{no}</div>
    </div>;
}
