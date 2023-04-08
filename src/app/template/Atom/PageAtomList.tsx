import { GenProps, useGen } from '../../tool';
import { PageQueryMore } from '../../coms';
import { GenAtom } from './GenAtom';
import { Link } from 'react-router-dom';

export function PageAtomList({ Gen }: GenProps<GenAtom>) {
    const { caption, ViewItemAtom, searchAtoms, listTop, phrase, pathView } = useGen(Gen);
    let searchParam = {
        item: phrase,
        key: undefined as string,
    };
    function ViewItem({ value }: { value: any }) {
        return <Link to={`../${pathView}/${value.id}`}>
            <div className="px-3 py-2">
                <ViewItemAtom value={value} />
            </div>
        </Link>;
    }
    return <PageQueryMore header={`${caption}列表`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        pageSize={4}
        pageMoreSize={1}
    >
        {listTop}
    </PageQueryMore>;
}
