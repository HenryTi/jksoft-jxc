import { EntityReport } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { useCallback } from "react";
import { ParamGetReport } from "uqs/UqDefault";

interface SpecRow {
    id: number;
    phrase: number;
    base: number;
    value: number;
}

interface ReportRow {
    id: number;
    phrase: number;
    no: string;
    ex: string;
    value: number;
    specs: SpecRow[];
}

export function PageReport({ entityReport }: { entityReport: EntityReport; }) {
    const { uq } = useUqApp();
    const { id, from } = entityReport;
    /*
    const { data } = useQuery([id], async () => {
        let params = {
            a: 1,
            b: 2,
        };
        let { $page } = await uq.GetReport.page({ phrase: id, params }, undefined, 100);
        return $page;
    }, UseQueryOptions);
    */
    const param: ParamGetReport = {
        reportPhrase: id,
        atomPhrase: from.id,
        atomId: undefined,
        dateStart: '2023-10-3',
        dateEnd: '2023-10-6',
        params: { a: 1 }
    };
    const query = useCallback(async (queryParam: any, pageStart: any, pageSize: number) => {
        let { $page, specs } = await uq.GetReport.page(queryParam, pageStart, pageSize);
        let ret: ReportRow[] = [];
        let coll: { [id: number]: ReportRow } = {};
        for (let row of $page) {
            let rr: ReportRow = { ...row, specs: [] };
            const { id } = rr;
            coll[id] = rr;
            ret.push(rr);
        }
        for (let spec of specs) {
            let { base } = spec;
            let rr = coll[base];
            if (rr === undefined) continue;
            rr.specs.push(spec);
        }
        return ret;
    }, []);

    function ViewItem({ value: rr }: { value: ReportRow }) {
        const { id, phrase, no, ex, value, specs } = rr;
        return <div className="">
            <div className="px-3 py-3 tonwa-bg-gray-2">
                {id} {phrase} {no} <b>{ex}</b> {value}
            </div>
            <div className="ms-5 border-start">
                {specs.map(v => {
                    let { id, phrase, base, value } = v;
                    return <div key={id} className="d-flex ps-3 pe-3 py-2 border-bottom">
                        <div className="flex-grow-1">{id} {phrase} {base}</div>
                        <b>{value}</b>
                    </div>
                })}
            </div>
        </div>;
    }
    return <PageQueryMore header={entityReport.caption ?? entityReport.name}
        query={query}
        param={param}
        sortField="id"
        ViewItem={ViewItem}
    >
        <div className="p-3 border-bottom">{entityReport.caption ?? entityReport.name}</div>
    </PageQueryMore>;
}

