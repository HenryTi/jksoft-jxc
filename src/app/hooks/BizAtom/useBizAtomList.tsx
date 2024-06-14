import { Link } from 'react-router-dom';
import { PageQueryMore } from '../../coms';
import { FA, List } from 'tonwa-com';
import { EntityID } from 'app/Biz';
import { Page } from 'tonwa-app';
import { OptionsUseBizAtom, pathAtom, useBizAtom } from './useBizAtom';

interface OptionsList {
    ViewItemAtom: (props: { value: any; }) => JSX.Element;
    pathAtomView: (atomPhraseId: number | string, id?: number) => string;
    pathAtomNew: (atomPhraseId: number | string, id?: number) => string;
    top?: JSX.Element;
}

export function useBizAtomList(options: OptionsUseBizAtom & OptionsList) {
    const { top, header, pathAtomNew, pathAtomView } = options;
    const useBizAtomReturn = useBizAtom(options);
    const { entity, searchAtoms } = useBizAtomReturn;
    let entityAtom = entity;
    const { subClasses: children } = entity;
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
    const sortField = 'id';
    const none = <div className='m-3 small text-muted'>[无{caption}]</div>;
    return {
        header: header ?? caption,
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
        const { subClasses: children } = entityAtom;
        function ViewItem({ value }: { value: EntityID; }) {
            const { id, caption } = value;
            return <Link to={`../${pathAtom.list(id)}`}>
                <div className="px-3 py-2">
                    {caption}
                </div>
            </Link>;
        }
        function onItemClick(item: EntityID) {
            // closeModal(item);
        }
        return <Page header={`${caption}列表 - 大类`}>
            <List items={children} ViewItem={ViewItem} onItemClick={onItemClick} />
        </Page>
    }

    function PageList() {
        return <PageQueryMore header={header ?? caption} right={right}
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
