import { Link, useParams } from 'react-router-dom';
import { PageQueryMore } from '../../coms';
import { FA, List } from 'tonwa-com';
import { EntityAtom } from 'app/Biz';
import { Page } from 'tonwa-app';
import { OptionsUseBizAtom, pathAtomNew, useBizAtom } from './useBizAtom';

interface OptionsList {
    ViewItemAtom: (props: { value: any; }) => JSX.Element;
    top?: JSX.Element;
}

export function useBizAtomList(options: OptionsUseBizAtom & OptionsList) {
    const { top } = options;
    const useBizAtomReturn = useBizAtom(options);
    const { entity, pathList, pathView, searchAtoms } = useBizAtomReturn;
    const { atom: atomName } = useParams();
    let entityAtom = useBizAtomReturn.getEntityAtom(atomName) ?? entity;
    const { children } = entityAtom;
    switch (children.length) {
        case 0: break;
        case 1: entityAtom = children[0]; break;
        default:
            return <PageTypes />;
    }
    const right = <Link className="btn btn-sm btn-success me-2" to={`../${pathAtomNew(entityAtom.name)}`}>
        <FA name="plus" />
    </Link>;
    return <PageList />;

    function PageTypes() {
        let caption = entityAtom.caption ?? entityAtom.name;
        const { children } = entityAtom;
        function ViewItem({ value }: { value: EntityAtom; }) {
            const { name, caption } = value;
            return <Link to={`../${pathList}/${name}`}>
                <div className="px-3 py-2">
                    {caption}
                </div>
            </Link>;
        }
        function onItemClick(item: EntityAtom) {
            // closeModal(item);
        }
        return <Page header={`${caption}列表 - 大类`}>
            <List items={children} ViewItem={ViewItem} onItemClick={onItemClick} />
        </Page>
    }

    function PageList() {
        const { ViewItemAtom } = options;
        let caption = entityAtom.caption ?? entityAtom.name;
        let searchParam = {
            atom: entityAtom.phrase,
            key: undefined as string,
        };
        function ViewItem({ value }: { value: any }) {
            return <Link to={`../${pathView}/${value.id}`}>
                <div className="px-3 py-2">
                    <ViewItemAtom value={value} />
                </div>
            </Link>;
        }
        // pageSize={20}
        // pageMoreSize={1}
        const none = <div className='m-3 small text-muted'>[无{caption}]</div>;
        return <PageQueryMore header={`${caption}列表`} right={right}
            query={searchAtoms}
            param={searchParam}
            sortField="id"
            ViewItem={ViewItem}
            none={none}
        >
            {top}
        </PageQueryMore>;
    }
}
