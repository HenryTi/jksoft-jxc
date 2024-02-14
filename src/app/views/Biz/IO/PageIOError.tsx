import { useUqApp } from "app";
import { PageQueryMore } from "app/coms";

export function PageIOError({ siteAtomApp }: { siteAtomApp: number }) {
    const { uq } = useUqApp();
    return <PageQueryMore header="连接错误"
        query={uq.GetIOError}
        param={{ siteAtomApp }}
        sortField="id"
    >
    </PageQueryMore>;
}
