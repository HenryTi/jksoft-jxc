import { useUqApp } from "app/UqApp";
import { PageQueryMore } from "app/coms";
import { pathTo } from "app/tool";
import { Link, useParams } from "react-router-dom";
import { EasyTime, FA, from62 } from "tonwa-com";
import { ParamGetHistory, ReturnGetHistory$page } from "uqs/UqDefault";
import { ViewFork } from "../View";
import { pathSheetRef } from "./useReport";
// import { useSubject } from "./useReport";
// import { EnumTitle } from "uqs/UqDefault";

export function PageHistory() {
    const { uq, biz } = useUqApp();
    const { title: title62, id: id62 } = useParams();
    const id = from62(id62);
    const title = from62(title62);
    const param: ParamGetHistory = {
        objId: id,
        title,
    };
    function ViewItem({ value: row }: { value: ReturnGetHistory$page; }) {
        let { id, value, ref, plusMinus, sheetNo, sheetPhrase, binPhrase } = row;
        let entity = biz.entityFromId(binPhrase);
        if (entity === undefined) {
            return <div className="px-3 py-2">
                <FA name="exclamation-circle" className="text-danger me-2" />
                <span className="text-secondary">数据错误。应该是以前版本的数据 id:{id} ref:{ref} {binPhrase}</span>
            </div>;
        }
        let { caption, name } = entity;
        return <Link to={pathTo(pathSheetRef, ref, undefined)}>
            <div className="px-3 py-2 d-flex">
                <div className="w-8c small text-secondary"><EasyTime date={(id / (1024 * 1024)) * 60} /></div>
                <div className="me-3">{sheetNo}</div>
                <div className="flex-grow-1">
                    {caption ?? name}
                </div>
                <div className="fw-bold">{value}</div>
            </div>
        </Link>;
        // ref: {ref} plusMinus: {plusMinus} sheetPhrase: {sheetPhrase} binPhrase: {binPhrase}
    }
    return <PageQueryMore header="流水"
        query={uq.GetHistory}
        param={param}
        sortField="id"
        ViewItem={ViewItem}
    >
        <div className="p-3 tonwa-bg-gray-2">
            <ViewFork id={id} />
        </div>
    </PageQueryMore>;
}
