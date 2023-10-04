import { UqApp, useUqApp } from "app/UqApp";
import { BI, PageQueryMore } from "app/coms";
import { Link, Route } from "react-router-dom";
import { IDView, Page } from "tonwa-app";
import { EntitySheet } from "app/Biz";
import { EasyTime, FA, List, to62 } from "tonwa-com";
import { PageSheetEdit, ViewSheetTime } from "app/hooks";
import { useCallback } from "react";
import { Atom, Bin, Sheet } from "uqs/UqDefault";
import { ViewNotifyCount } from "app/tool";

function PageSheetCenter() {
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const sheetEntities = biz.sheets;
    const query = useCallback(async (param: any, pageStart: any, pageSize: number) => {
        let { $page } = await uq.GetMyDrafts.page({}, pageStart, pageSize);
        return $page;
    }, []);
    function ViewSheetType({ value }: { value: EntitySheet; }) {
        let { caption, name, id: entityId, coreDetail } = value;
        let pendEntityId: number;
        if (coreDetail !== undefined) {
            pendEntityId = coreDetail.pend?.entity?.id;
        }
        return <Link
            to={`/sheet/${to62(entityId)}`}
        >
            <div className="px-3 py-2 align-items-center d-flex">
                <BI name="card-list" className="fs-larger me-3 text-primary" />
                <span className="text-body">{caption ?? name}</span>
                <ViewNotifyCount phrase={pendEntityId} />
            </div>
        </Link>
    }
    function ViewSheetItem({ value }: { value: (Sheet & Bin & { phrase: string; }) }) {
        const { id, no, phrase, i } = value;
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
        return <Link to={`/sheet/${to62(entitySheet.id)}/${to62(id)}`}>
            <div className="d-flex px-3 py-3">
                <FA name="file" className="me-3 text-danger" />
                <span className="d-inline-block w-min-8c">{sheetCaption}</span>
                <span className="d-inline-block w-min-10c">{no}</span>
                <span className="d-inline-block w-min-8c">
                    <IDView uq={uq} id={i} Template={ViewTarget} />
                </span>
                <div className="flex-grow-1" />
                <ViewSheetTime id={id} />
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
