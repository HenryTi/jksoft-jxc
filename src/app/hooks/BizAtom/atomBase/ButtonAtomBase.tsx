import { FA, List, RadioAsync, SearchBox, useEffectOnce } from 'tonwa-com';
import { EntityAtom, EntityID } from "tonwa";
import { Page, useModal } from 'tonwa-app';
import { useState } from 'react';
import { AtomStore } from '../AtomStore';
import { useBizAtomView } from '../useBizAtomView';
import { ViewAtomPrimesOfStore, ViewAtomTitlesOfStore, ViewForkAtomBold } from 'app/hooks/View';
import { RowCols } from 'app/hooks/tool';
import { PageQueryMore } from 'app/coms';

export function ButtonAtomBase({ entityAtom, store }: { entityAtom: EntityAtom; store: AtomStore; }) {
    const modal = useModal();
    function onClick() {
        modal.open(<PageDirectAtom rootAtom={entityAtom} entityAtom={entityAtom} store={store} />);
    }
    return <button className="btn btn-sm btn-success me-2" onClick={onClick}>
        编辑大类
    </button>;
}

function PageDirectAtom({ rootAtom, entityAtom, store }: { rootAtom: EntityAtom; entityAtom: EntityAtom; store: AtomStore; }) {
    const [searchKey, setSearchKey] = useState(undefined as string);
    const param = {
        searchKey,
        phrase: entityAtom.id,
    }
    async function onSearch(key: string) {
        setSearchKey(key);
    }
    let leafs = rootAtom.getAllLeafs();
    function ViewItem({ value: { id, phrase } }: { value: { id: number; phrase: number; } }) {
        const { entity } = store;
        const { page } = useBizAtomView({ atomName: entity.name, entityAtom: entity, id, readOnly: true });
        function onClick() {
            store.modal.open(page);
        }
        const radioItems: [item: string | number, caption: string, value: string | number, defaultCheck: boolean,][] = leafs.map(v => {
            let { id: leafId, caption } = v;
            return [leafId, caption, leafId, phrase === leafId];
        });
        async function onCheckChanged(item: string | number) {
            await store.setIDBase(id, item as number);
        }
        return <div className="text-decoration-none px-3 py-2 ">
            <div className="cursor-pointer pb-2" onClick={onClick}>
                <div>
                    <ViewForkAtomBold id={id} store={store} />
                    <ViewAtomTitlesOfStore id={id} store={store} />
                </div>
                <RowCols contentClassName="">
                    <ViewAtomPrimesOfStore id={id} store={store} />
                </RowCols>
            </div>
            <RowCols>
                <RadioAsync name={String(id)} items={radioItems} onCheckChanged={onCheckChanged} classNameRadio="form-check-label" />
            </RowCols>
        </div>;
    }
    return <PageQueryMore header={'编辑大类 - ' + entityAtom.caption}
        query={store.searchItems}
        sortField="id"
        param={param}
        ViewItem={ViewItem}
    >
        <ViewTypes rootAtom={rootAtom} entityAtom={entityAtom} store={store} />
        <SearchBox className="px-3 py-1 border-bottom" placeholder="编号或名称" onSearch={onSearch} />
    </PageQueryMore>;
}


function ViewTypes({ entityAtom, store, rootAtom }: { rootAtom: EntityAtom; entityAtom: EntityAtom; store: AtomStore; }) {
    const modal = useModal();
    const { subClasses: children } = entityAtom;
    function ViewItem({ value }: { value: EntityID; }) {
        const { id, caption } = value;
        function onClick() {
            modal.open(<PageDirectAtom rootAtom={rootAtom} entityAtom={value} store={store} />);
        }
        return <div className="px-3 py-2 mx-3 my-2 border rounded-2 bg-white cursor-pointer" onClick={onClick}>
            {caption}
        </div>;
    }

    if (children.length === 0) return null;
    return <div className="p-3 tonwa-bg-gray-2 mb-3 container-fluid">
        <RowCols>
            {children.map(v => <ViewItem key={v.id} value={v} />)}
        </RowCols>
    </div>;
}
