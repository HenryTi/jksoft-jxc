import { Link, useParams } from 'react-router-dom';
import { GenProps, useGen } from '../../tool';
import { PageQueryMore } from '../../coms';
import { GenAtom } from './GenAtom';
import { List } from 'tonwa-com';
import { EntityAtom } from 'app/Biz';
import { Page } from 'tonwa-app';

export function PageAtomList({ Gen }: GenProps<GenAtom>) {
    const gen = useGen(Gen);
    const { entity } = gen;
    const { atom: atomName } = useParams();
    let entityAtom = gen.getEntityAtom(atomName) ?? entity;
    const { children } = entityAtom;
    switch (children.length) {
        case 0: break;
        case 1: entityAtom = children[0]; break;
        default:
            return <PageTypes entityAtom={entityAtom} gen={gen} />;
    }
    return <PageList entityAtom={entityAtom} gen={gen} />;
}

function PageList({ entityAtom, gen }: { entityAtom: EntityAtom; gen: GenAtom; }) {
    let { genAtomList, genAtomView, searchAtoms, ViewItemAtom } = gen;
    let { listTop } = genAtomList;
    let { caption } = entityAtom;
    let searchParam = {
        atom: entityAtom.phrase,
        key: undefined as string,
    };
    function ViewItem({ value }: { value: any }) {
        return <Link to={`../${genAtomView.path}/${value.id}`}>
            <div className="px-3 py-2">
                <ViewItemAtom value={value} />
            </div>
        </Link>;
    }
    // pageSize={20}
    // pageMoreSize={1}
    const none = <div className='m-3 small text-muted'>[无{caption}]</div>;
    return <PageQueryMore header={`${caption}列表`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        none={none}
    >
        {listTop}
    </PageQueryMore>;
}

function PageTypes({ entityAtom, gen }: { entityAtom: EntityAtom; gen: GenAtom; }) {
    const { genAtomList, caption } = gen;
    const { children } = entityAtom;
    function ViewItem({ value }: { value: EntityAtom; }) {
        const { name, caption } = value;
        return <Link to={`../${genAtomList.path}/${name}`}>
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
