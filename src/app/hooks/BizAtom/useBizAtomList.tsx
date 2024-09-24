import { Link, useNavigate } from 'react-router-dom';
import { PageQueryMore } from '../../coms';
import { FA, List, SearchBox, useEffectOnce } from 'tonwa-com';
import { EntityAtom, EntityID } from 'app/Biz';
import { Page, useModal } from 'tonwa-app';
import { OptionsUseBizAtom, useBizAtom } from './useBizAtom';
import { AtomStore, pathAtom, useAtomStore } from './AtomStore';
import { ViewAtomPrimesOfStore, ViewAtomTitlesOfStore, ViewSpecAtomBold } from '../View';
import { RowCols } from '../tool';
import { useBizAtomView } from './useBizAtomView';
import { useState } from 'react';
import { ButtonAtomBase } from './atomBase';

interface OptionsList {
    ViewItemAtom: (props: { value: any; }) => JSX.Element;
    pathAtomView: (atomPhraseId: number | string, id?: number) => string;
    pathAtomNew: (atomPhraseId: number | string, id?: number) => string;
    top?: JSX.Element;
}

export function useBizAtomList(options: OptionsUseBizAtom & OptionsList) {
    const { top, header, pathAtomNew, pathAtomView } = options;
    const store = useAtomStore();
    const { entity } = store;
    const { subClasses } = entity;
    let entityAtom = entity;
    let [searchParam, setSearchParam] = useState({
        atom: entityAtom.id,
        searchKey: undefined as string,
    });
    switch (subClasses.length) {
        case 0: break;
        case 1: entityAtom = subClasses[0] as any; break;
        default:
            return {
                page: <PageTypes />,
            };
    }
    const right = <Link className="btn btn-sm btn-success me-2" to={`../${pathAtomNew(entityAtom.id)}`}>
        <FA name="plus" />
    </Link>;
    const { ViewItemAtom } = options;
    let { caption, name } = entityAtom;
    caption = caption ?? name;
    const sortField = 'id';
    const none = <div className='m-3 small text-muted'>[无{caption}]</div>;
    return {
        header: header ?? caption,
        right,
        query: store.searchItems,
        param: searchParam,
        sortField,
        ViewItem,
        none,
        page: <PageList />,
        top,
        store,
    };

    async function onSearch(key: string) {
        setSearchParam({
            ...searchParam,
            searchKey: key,
        });
    }

    function PageTypes() {
        let caption = entityAtom.caption;
        const { subClasses: children, superClass } = entityAtom;
        let right: any;
        if (superClass === undefined) {
            right = <ButtonAtomBase entityAtom={entityAtom} store={store} />
        }
        function ViewItem({ value }: { value: EntityID; }) {
            const { id, caption } = value;
            return <Link to={`../${pathAtom.list(id)}`}>
                <div className="px-3 py-2">
                    {caption}
                </div>
            </Link>;
        }
        function onItemClick(item: EntityID) {
            // modal.close(item);
        }
        return <Page header={`${caption}列表 - 大类`} right={right}>
            <List items={children} ViewItem={ViewItem} onItemClick={onItemClick} />
        </Page>
    }

    function ViewItem({ value: { id, phrase } }: { value: { id: number; phrase: number; } }) {
        // const navigate = useNavigate();
        // const atomValue = store.bizAtomColl[id];
        const { page } = useBizAtomView({ atomName: entity.name, entityAtom: entity, id });
        function onClick() {
            // navigate(`../${pathAtomView(phrase, id)}`);
            store.modal.open(page);
        }
        return <div className="text-decoration-none px-3 py-2 cursor-pointer" onClick={onClick}>
            <div>
                <ViewSpecAtomBold id={id} store={store} />
                <ViewAtomTitlesOfStore id={id} store={store} />
            </div>
            <RowCols contentClassName="">
                <ViewAtomPrimesOfStore id={id} store={store} />
            </RowCols>
        </div>;
    }

    function PageList() {
        return <PageQueryMore header={header ?? caption} right={right}
            query={store.searchItems}
            param={searchParam}
            sortField={sortField}
            ViewItem={ViewItem}
            none={none}
        >
            {top}
            <SearchBox className="px-3 py-1 border-bottom tonwa-bg-gray-2"
                onSearch={onSearch} placeholder={caption + ' 名称或编号'} allowEmptySearch={true}
                initKey={searchParam.searchKey} />
        </PageQueryMore>;
    }
}
