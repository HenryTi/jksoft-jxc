import { useQueryMore } from "app/coms";
import { useCallback, useMemo } from "react";
import { Page } from "tonwa-app";
import { wait } from "tonwa-com";

let rowId = 1;

interface Row {
    id: number; name: string;
}
export function PageTest() {
    const memoRowId = useMemo(() => rowId, []);
    const { view } = useQueryMore<any, Row>({
        param: undefined,
        sortField: 'id',
        pageStart: undefined,
        pageSize: undefined,
        pageMoreSize: undefined,
        query: useCallback(async function (param: any, pageStart: any, pageSize: number) {
            await wait(2000);
            let ret: Row[] = [];
            for (let i = 0; i < pageSize; i++) {
                if (rowId > memoRowId + 100) break;
                ret.push({ id: rowId++, name: 'dddd' });
            }
            return ret;
        }, []),
        ViewItem,
        getKey: (v) => v.id,
    });
    function ViewItem({ value }: { value: any }) {
        return <div className="p-5 border-bottom">
            {JSON.stringify(value)}
        </div>
    }
    return <Page header="test">
        {view}
    </Page>;
}
