import { useRef, useState, JSX } from "react";
import { SearchBox } from "tonwa-com";
import { Page, PageError, useModal } from "tonwa-app";
import { BizBud, EntityID, EntityFork, BizPhraseType } from "../../Biz";
import { RowMed, createIDSelectStore } from "./IDSelectStore";
import { AtomData } from "../../Store";
import { RowColsSm, ViewBud } from "../../View";
import { ViewAtom } from "../../View/Form/ViewAtom";
import { PageQueryMore } from "../../View/Common/PageQueryMore";
import { ViewAtomId } from "../../View/Form/ViewAtomId";

export function useIDSelect() {
    const modal = useModal();
    return async function (ID: EntityID, params?: object, buds?: number[], viewTop?: any) {
        let ret = await modal.open<AtomData>(<PageIDSelect entity={ID} params={params} buds={buds} />);
        return ret;
    }
}

export interface PropsIDSelect {
    entity: EntityID;
    params?: any;
    buds?: number[];
    loadOnOpen?: boolean;
    caption?: string;
    placeholder?: string;
    onSelected?: (atomId: number) => Promise<void>;
}

export function PageIDSelect(props: PropsIDSelect) {
    const modal = useModal();
    const { params, buds, loadOnOpen, caption, placeholder, entity, onSelected } = props;
    const { current: selectStore } = useRef(createIDSelectStore(modal, entity));
    const [searchParam, setSearchParam] = useState(loadOnOpen === false ? undefined : { ...params, key: undefined as string });
    if (entity === undefined) {
        return <PageError>没有定义ATOM或FORK</PageError>;
    }
    const entityAtomCaption = entity.caption;
    const searchBox = <SearchBox className="px-3 py-2"
        onSearch={onSearch}
        placeholder={placeholder ?? (entityAtomCaption + ' 编号或描述')} />;
    async function onSearch(key: string) {
        setSearchParam({
            ...params,
            key
        });
    }
    async function onItemClick(selectedItem: any) {
        let ret: any;
        switch (entity.bizPhraseType) {
            default:
                debugger;
                break;
            case BizPhraseType.atom:
                ret = selectedItem.atom;
                break;
            case BizPhraseType.fork:
                ret = selectedItem;
                break;
        }
        if (onSelected !== undefined) {
            await onSelected(ret.id);
        }
        else {
            modal.close(ret);
        }
    }
    // let atomBudsSearch = useAtomBudsSearch({ entity: atom, buds, });
    async function searchAtoms(param: any, pageStart: any, pageSize: number) {
        if (selectStore === undefined) {
            alert('no ATOM or FORK defined');
            return [];
        }
        let ret = await selectStore.search(param, pageStart, pageSize);
        return ret;
    }

    function ViewAtomItem({ value }: { value: RowMed }) {
        return <div className="px-3 py-2">
            <ViewAtom value={value.atom} />
        </div>;
    }
    function ViewSpecItem({ value }: { value: any; }) {
        const keyValues: [number, number | string][] = value.keys;
        const { showKeys, showBuds, noBud, exBud } = entity as EntityFork;
        function ViewSpecBud({ bud }: { bud: BizBud; }) {
            if (bud === undefined) return null;
            const { id } = bud;
            let val = keyValues.find(kv => kv[0] === id);
            let v = val[1];
            return <ViewBud bud={bud} value={v} />;
        }
        return <div className="px-3 py-2" key={value.id}>
            <RowColsSm>
                <ViewSpecBud bud={noBud} />
                <ViewSpecBud bud={exBud} />
                {showKeys.map(v => <ViewSpecBud key={v.id} bud={v} />)}
                {showBuds.map(v => <ViewSpecBud key={v.id} bud={v} />)}
            </RowColsSm>
        </div>;
    }

    function onClear() {
        modal.close(null);
    }
    let top: any;
    let ViewItem: ({ value }: { value: any; }) => JSX.Element;
    switch (entity.bizPhraseType) {
        default: debugger; break;
        case BizPhraseType.fork:
            ViewItem = ViewSpecItem;
            top = <div className="p-3"><ViewAtomId id={params.base} /></div>;
            break;
        case BizPhraseType.atom:
            ViewItem = ViewAtomItem;
            break;
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
        {top}
        {searchBox}
    </PageQueryMore>;
}
