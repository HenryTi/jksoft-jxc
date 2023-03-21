import { usePart } from '../../tool';
import { PageQueryMore } from '../../coms';
import { PartProps } from '../Part';
import { PartID } from './PartID';

export function PageIDList({ Part }: PartProps<PartID>) {
    const { caption, ViewItemID, searchItems, listTop, baseID } = usePart(Part);

    let searchParam = {
        base: baseID.getId(),           // 运行Promise，自动先调用返回
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
