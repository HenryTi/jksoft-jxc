import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { uqAppModal, useModal } from "tonwa-app";
import { GenAtomBudsSearch, GenBuds, RowMed } from "../Bud";
import { UqApp, useUqApp } from "app/UqApp";
import { OptionsAtomSelect } from "app/tool";
import { Biz, EntityAtom } from "app/Biz";
import { Atom } from "uqs/UqDefault";

export async function selectAtom(uqApp: UqApp, atom: string | EntityAtom, options: OptionsAtomSelect) {
    const { openModal } = uqAppModal(uqApp);
    options = options ?? {};
    let ret = await openModal<Atom>(<PageAtomSelect {...options} atom={atom} />);
    return ret;
}

export function PageAtomSelect(options: OptionsAtomSelect & { atom: string | EntityAtom; }) {
    const { assigns, loadOnOpen, caption, placeholder, atom } = options;
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { closeModal } = useModal();

    let entityAtom: EntityAtom;
    if (typeof atom === 'string') {
        entityAtom = biz.entities[atom] as EntityAtom;
    }
    else {
        entityAtom = atom;
    }
    const ViewItemAtom = uqApp.gAtoms[entityAtom.name]?.ViewItem; //useBizAtomViewItem(entityAtom)
    // const { caption, placeholder, entity } = genAtom.genAtomSelect;
    const [searchParam, setSearchParam] = useState(loadOnOpen === false ? undefined : { key: undefined as string });
    const searchBox = <SearchBox className="px-3 py-2" onSearch={onSearch} placeholder={placeholder ?? (entityAtom.caption + ' 编号或描述')} />;
    async function onSearch(key: string) {
        setSearchParam({
            key
        });
    }
    async function onItemClick(selectedItem: RowMed) {
        closeModal(selectedItem.atom);
    }
    async function searchAtoms(param: any, pageStart: any, pageSize: number) {
        let genBuds = new GenBuds(uqApp, entityAtom, assigns);
        let genBudsSearch = new GenAtomBudsSearch(genBuds, genBuds.entity.phrase);
        let ret = await genBudsSearch.search(param, pageStart, pageSize);
        return ret;
    }

    function ViewItem({ value }: { value: RowMed }) {
        if (ViewItemAtom === undefined) {
            return <div className="px-3 py-2">BizAtom {entityAtom.name} is not defined</div>
        }
        return <div className="px-3 py-2">
            <ViewItemAtom value={value.atom} />
        </div>;
    }
    // pageSize={8}
    // pageMoreSize={2}
    return <PageQueryMore header={`选择${caption ?? entityAtom.caption}`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
    >
        {searchBox}
    </PageQueryMore>;
}
