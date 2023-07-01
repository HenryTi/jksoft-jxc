import { useState } from "react";
import { SearchBox } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { uqAppModal, useModal } from "tonwa-app";
import { GenAtomBudsSearch, GenBuds, RowMed } from "../Bud";
import { UqApp, useUqApp } from "app/UqApp";
import { AtomPhrase, PropsAtomSelect } from "app/tool";
import { EntityAtom } from "app/Biz";
import { EnumAtom } from "uqs/UqDefault";

export async function selectAtom(uqApp: UqApp, atomName: EnumAtom, assigns?: string[]) {
    const { openModal } = uqAppModal(uqApp);
    let ret = await openModal<AtomPhrase>(<PageAtomSelect atomName={atomName} assigns={assigns} />);
    return ret;
}

export function PageAtomSelect(props: PropsAtomSelect) {
    const { assigns, loadOnOpen, caption, placeholder, atomName } = props;
    const uqApp = useUqApp();
    const { biz } = uqApp;
    const { closeModal } = useModal();

    let entityAtom: EntityAtom = biz.entities[atomName] as EntityAtom;
    if (entityAtom === undefined) {
        debugger;
        let err = (atomName === undefined ? 'no atomName' : `${atomName} not defined`) + ' in PageAtomSelect';
        throw new Error(err);
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
