import { GenProps, useGen } from '../../tool';
import { PageQueryMore } from '../../coms';
import { GenAtom } from './GenAtom';

export function PageAtomList({ Gen }: GenProps<GenAtom>) {
    const { caption, ViewItemAtom: ViewItemID, searchAtoms: searchItems, listTop, phrase } = useGen(Gen);

    let searchParam = {
        item: phrase,
        key: undefined as string,
    };
    function ViewItem({ value }: { value: any }) {
        return <div className="px-3 py-2">
            <ViewItemID value={value} />
        </div>;
    }
    return <PageQueryMore header={`${caption}列表`}
        query={searchItems}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        pageSize={4}
        pageMoreSize={1}
    >
        {listTop}
    </PageQueryMore>;
}
