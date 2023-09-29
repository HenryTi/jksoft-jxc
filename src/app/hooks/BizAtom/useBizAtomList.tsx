import { Link, useParams } from 'react-router-dom';
import { PageQueryMore } from '../../coms';
import { FA, List, from62 } from 'tonwa-com';
import { EntityAtom, EntityAtomID } from 'app/Biz';
import { Page } from 'tonwa-app';
import { OptionsUseBizAtom, pathAtomList, pathAtomNew, pathAtomView, useBizAtom } from './useBizAtom';
import { useUqApp } from 'app/UqApp';

interface OptionsList {
    ViewItemAtom: (props: { value: any; }) => JSX.Element;
    top?: JSX.Element;
}

export function useBizAtomList(options: OptionsUseBizAtom & OptionsList) {
    const { top } = options;
    const useBizAtomReturn = useBizAtom(options);
    const { entity, searchAtoms } = useBizAtomReturn;
    // const { atom } = useParams();
    // const atomPhraseId = from62(atom);
    // let entityAtom = biz.entityIds[atomPhraseId] as EntityAtom; // useBizAtomReturn.getEntityAtom(atomName) ?? entity;
    let entityAtom = entity;
    const { children } = entity;
    switch (children.length) {
        case 0: break;
        case 1: entityAtom = children[0] as any; break;
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
    let searchParam = {
        atom: entityAtom.id,
        key: undefined as string,
    };
    function ViewItem({ value }: { value: any }) {
        return <Link to={`../${pathAtomView(entityAtom.id, value.id)}`}>
            <div className="px-3 py-2">
                <ViewItemAtom value={value} />
            </div>
        </Link>;
    }
    // pageSize={20}
    // pageMoreSize={1}
    const sortField = 'id';
    const none = <div className='m-3 small text-muted'>[无{caption}]</div>;
    return {
        header: caption,
        right,
        query: searchAtoms,
        param: searchParam,
        sortField,
        ViewItem,
        none,
        page: <PageList />,
        top,
    };

    function PageTypes() {
        let caption = entityAtom.caption ?? entityAtom.name;
        const { children } = entityAtom;
        function ViewItem({ value }: { value: EntityAtomID; }) {
            const { id, caption } = value;
            return <Link to={`../${pathAtomList(id)}`}>
                <div className="px-3 py-2">
                    {caption}
                </div>
            </Link>;
        }
        function onItemClick(item: EntityAtomID) {
            // closeModal(item);
        }
        return <Page header={`${caption}列表 - 大类`}>
            <List items={children} ViewItem={ViewItem} onItemClick={onItemClick} />
        </Page>
    }

    function PageList() {
        return <PageQueryMore header={caption} right={right}
            query={searchAtoms}
            param={searchParam}
            sortField={sortField}
            ViewItem={ViewItem}
            none={none}
        >
            {top}
        </PageQueryMore>;
    }
}
