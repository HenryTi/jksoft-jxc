import { Link, useParams } from 'react-router-dom';
import { PageQueryMore } from '../../coms';
import { List } from 'tonwa-com';
import { EntityAtom } from 'app/Biz';
import { Page } from 'tonwa-app';
import { GenBizAtom, OptionsUseBizAtom, useBizAtom } from './useBizAtom';

interface OptionsList {
    ViewItemAtom: (props: { value: any; }) => JSX.Element;
    top?: JSX.Element;
}

export function useBizAtomList(options: OptionsUseBizAtom & OptionsList) {
    const { top } = options;
    const gen = useBizAtom(options);
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
    return <PageList entityAtom={entityAtom} gen={gen} top={top} {...options} />;
}

function PageList({ entityAtom, gen, top, ViewItemAtom }: OptionsList & { entityAtom: EntityAtom; gen: GenBizAtom; }) {
    let { pathView, searchAtoms } = gen;
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
    return <PageQueryMore header={`${caption}列表`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        none={none}
    >
        {top}
    </PageQueryMore>;
}

function PageTypes({ entityAtom, gen }: { entityAtom: EntityAtom; gen: GenBizAtom; }) {
    const { pathList } = gen;
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
