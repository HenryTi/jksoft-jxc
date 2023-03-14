import { useUqApp } from 'app/UqApp';
import { PageQueryMore } from '../../coms';
import { PartProps } from '../Part';
import { PartID } from './PartID';

export function PageIDList({ Part }: PartProps<PartID>) {
    const uqApp = useUqApp();
    const { caption, ViewItem, query, listTop } = uqApp.partOf(Part);
    let searchParam = {
        key: undefined as string,
    };
    return <PageQueryMore header={`${caption}列表`}
        query={query}
        param={searchParam}
        sortField="id"
        ViewItem={ViewItem}
        pageSize={4}
        pageMoreSize={1}
    >
        {listTop}
    </PageQueryMore>;
}
