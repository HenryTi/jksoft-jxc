import { Link } from 'react-router-dom';
import { GenProps, useGen } from '../../tool';
import { PageQueryMore } from '../../coms';
import { GenAtom } from './GenAtom';

export function PageAtomList({ Gen }: GenProps<GenAtom>) {
    const { genAtomList, searchAtoms, ViewItemAtom, genAtomView } = useGen(Gen);
    const { caption, listTop, phrase } = genAtomList;
    let searchParam = {
        item: phrase,
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
    return <PageQueryMore header={`${caption}列表`}
        query={searchAtoms}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
    >
        {listTop}
    </PageQueryMore>;
}
