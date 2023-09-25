import { UqApp, useUqApp } from "app/UqApp";
import { BI, PageQueryMore } from "app/coms";
import { Link, Route } from "react-router-dom";
import { IDView, Page } from "tonwa-app";
import { EntitySheet } from "app/Biz";
import { FA, List, to62 } from "tonwa-com";
import { PageSheetEdit } from "app/hooks";
import { useCallback } from "react";
import { Atom, Sheet } from "uqs/UqDefault";
// import { PageSheetEdit } from "./PageSheetEdit";

function PageSheetCenter() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const sheetEntities = biz.sheetEntities();
    const query = useCallback(async (param: any, pageStart: any, pageSize: number) => {
        let { $page } = await uq.GetMyDrafts.page({}, pageStart, pageSize);
        return $page;
    }, []);
    function ViewSheetType({ value }: { value: EntitySheet; }) {
        let { caption, name, entityId } = value;
        return <Link
            to={`/sheet/${to62(entityId)}`}
        >
            <div className="px-3 py-2 align-items-center d-flex">
                <BI name="card-list" className="fs-larger me-3 text-primary" />
                <span className="text-body">{caption ?? name}</span>
            </div>
        </Link>
    }
    function ViewSheetItem({ value }: { value: (Sheet & { phrase: string; }) }) {
        const { id, no, phrase, target } = value;
        let entitySheet = biz.entities[phrase];
        let sheetCaption: string;
        if (entitySheet === undefined) {
            sheetCaption = phrase;
        }
        else {
            const { caption, name } = entitySheet;
            sheetCaption = caption ?? name;
        }
        function ViewTarget({ value }: { value: Atom; }) {
            return <span>{value.ex}</span>;
        }
        return <Link to={`/sheet/${to62(entitySheet.entityId)}/${to62(id)}`}>
            <div className="px-3 py-3">
                <FA name="file" className="me-3 text-danger" />
                <span className="d-inline-block w-min-8c">{sheetCaption}</span>
                <span className="d-inline-block w-min-10c">{no}</span>
                <span className="d-inline-block w-min-8c">
                    <IDView uq={uq} id={target} Template={ViewTarget} />
                </span>
            </div>
        </Link>;
    }
    return <PageQueryMore header="单据中心"
        query={query}
        param={{}}
        sortField={'id'}
        ViewItem={ViewSheetItem}
        none={<div className="small text-secondary p-3">[无]</div>}
    >
        <List items={sheetEntities} ViewItem={ViewSheetType} />

        <div className="tonwa-bg-gray-2 small text-secondary mt-4 px-3 pt-2 pb-1">单据草稿</div>
    </PageQueryMore>;
}


export const pathSheetCenter = 'sheet-center';
export function routeSheetCenter(uqApp: UqApp) {
    return <>
        <Route path={pathSheetCenter} element={<PageSheetCenter />} />
        <Route path={'sheet/:sheet/:id'} element={<PageSheetEdit />} />
        <Route path={'sheet/:sheet'} element={<PageSheetEdit />} />
    </>;
}
