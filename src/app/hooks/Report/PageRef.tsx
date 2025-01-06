import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { Page } from "tonwa-app";
import { EasyTime, from62 } from "tonwa-com";
import { ViewFork } from "../View";

export function PageRef() {
    const { id: id62/*, d: detail62*/ } = useParams();
    return <PageRefId id={Number(id62)} />;
}

export function PageRefId({ id }: { id: number; }) {
    const { uq } = useUqApp();
    const { data } = useQuery([id], async () => {
        // id 可以是sheetId，也可以是detailId
        let ret = await uq.GetSheet.query({ id /*, detail*/ });
        return ret;
    }, UseQueryOptions);

    const { main: [main], details, origins } = data;
    const header = '单据详情';
    let content: any;
    if (main === undefined) {
        content = <div className="p-3">不可看</div>;
    }
    else {
        const { id: sheetId, no, i } = main;
        content = <><div className="px-3 py-3 tonwa-bg-gray-2 border-bottom">
            <small className="text-secondary">单据编号: </small>
            <b>{no}</b>
            <span className="ms-3 small text-secondary">
                <EasyTime date={sheetId / (1024 * 1024) * 60} />
            </span>

        </div>
            <div className="px-3 py-2 tonwa-bg-gray-1">
                <div><ViewFork id={i} /></div>
            </div>
            <div className="border-top">
                {details.map(v => {
                    return <div key={v.id} className="px-3 py-2 d-flex border-bottom">
                        <div className="flex-grow-1">
                            <ViewFork id={v.i} />
                        </div>
                        <div className="fw-bold">{v.value}</div>
                    </div>
                })}
            </div>
            <div className="px-3 py-2 d-none">
                orgiins: {JSON.stringify(origins)}
            </div>
        </>;
    }
    return <Page header={header}>
        {content}
    </Page>;
}
