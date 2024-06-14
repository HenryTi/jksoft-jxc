import { useRef, useState } from "react";
import { SearchBox } from "tonwa-com";
import { PageQueryMore } from "app/coms";
import { useModal } from "tonwa-app";
import { AtomPhrase } from "app/tool";
import { EntityID } from "app/Biz";
import { Atom } from "uqs/UqDefault";
import { RowMed, IDSelectStore, createIDSelectStore } from "./IDSelectStore";

export function useIDSelect() {
    const { openModal } = useModal();
    return async function (ID: EntityID, buds?: number[], viewTop?: any) {
        let ret = await openModal<AtomPhrase>(<PageIDSelect entity={ID} buds={buds} />);
        return ret;
    }
}

export interface PropsIDSelect {
    entity: EntityID;
    param?: any;
    buds?: number[];
    loadOnOpen?: boolean;
    caption?: string;
    placeholder?: string;
    onSelected?: (atomId: number) => Promise<void>;
}

export function PageIDSelect(props: PropsIDSelect) {
    const { param, buds, loadOnOpen, caption, placeholder, entity, onSelected } = props;
    const { current: selectStore } = useRef(createIDSelectStore(entity));
    const { closeModal } = useModal();
    const [searchParam, setSearchParam] = useState(loadOnOpen === false ? undefined : { key: undefined as string });
    const entityAtomCaption = entity.caption ?? entity.name;
    const searchBox = <SearchBox className="px-3 py-2"
        onSearch={onSearch}
        placeholder={placeholder ?? (entityAtomCaption + ' 编号或描述')} />;
    async function onSearch(key: string) {
        setSearchParam({
            ...param,
            key
        });
    }
    async function onItemClick(selectedItem: RowMed) {
        let ret = selectedItem.atom;
        if (onSelected !== undefined) {
            await onSelected(ret.id);
        }
        else {
            closeModal(ret);
        }
    }
    // let atomBudsSearch = useAtomBudsSearch({ entity: atom, buds, });
    async function searchAtoms(param: any, pageStart: any, pageSize: number) {
        let ret = await selectStore.search(param, pageStart, pageSize);
        // let ret = await atomBudsSearch.search(param, pageStart, pageSize);
        return ret;
    }

    function ViewItem({ value }: { value: RowMed }) {
        return <div className="px-3 py-2">
            <ViewAtom value={value.atom} />
        </div>;
    }
    function onClear() {
        closeModal(null);
    }
    let right = <button className="btn btn-sm me-1 btn-primary" onClick={onClear}>清值</button>
    return <PageQueryMore header={`选择${caption ?? entityAtomCaption}`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        onItemClick={onItemClick}
        right={right}
    >
        {searchBox}
    </PageQueryMore>;
}

function ViewAtom({ value }: { value: Atom; }) {
    let { no, ex } = value;
    return <div>
        {ex}
        <span className='ms-3 small text-secondary'>{no}</span>
    </div>;
}
