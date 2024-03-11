import { useUqApp } from "app";
import { PageMoreCacheData, PageQueryMore, useQueryMore } from "app/coms";
import { Page } from "tonwa-app";
import { ButtonAsync } from "tonwa-com";
import { ReturnGetIOError$page } from "uqs/UqDefault";

export function PageIOError({ siteAtomApp }: { siteAtomApp: number }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { view, items } = useQueryMore<any, ReturnGetIOError$page>({
        param: { siteAtomApp },
        sortField: 'id',
        pageStart: undefined,
        pageSize: undefined,
        pageMoreSize: undefined,
        query: uq.GetIOError,
        ViewItem,
        getKey: (v) => v.id,
    });

    function ViewItem({ value }: { value: ReturnGetIOError$page; }) {
        async function onRetry() {
            let queueId = value.id;
            await uq.IORetry.submit({ id: queueId });
            items.removeItem(value);
        }
        return <div className="d-flex">
            <div className="flex-fill px-3 py-2">{JSON.stringify(value)}</div>
            <div className="px-3 py-2 text-end w-min-6c">
                <ButtonAsync className="btn btn-sm btn-link" onClick={onRetry}>重试</ButtonAsync>
            </div>
        </div>
    }
    return <Page header="连接错误">
        <div className="border-2 border-top border-bottom">
            {view}
        </div>
    </Page>;
}
