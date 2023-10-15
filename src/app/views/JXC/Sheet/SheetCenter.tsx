import { useUqApp } from "app/UqApp";
import { BI, PageQueryMore } from "app/coms";
import { Link, Route } from "react-router-dom";
import { IDView } from "tonwa-app";
import { EntitySheet } from "app/Biz";
import { FA, List, to62 } from "tonwa-com";
import { PageSheetEdit, ViewSheetTime } from "app/hooks";
import { useCallback, useState } from "react";
import { Atom, Sheet } from "uqs/UqDefault";
import { ViewNotifyCount } from "app/tool";
import { pathSheetCenter } from "app/views/pathes";

interface Bin {
    id: number;
    origin: number;
    i: number;
    x: number;
    value: number;
    amount: number;
    price: number;
}

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
        const [del, setDel] = useState(0);
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
        if (entitySheet === undefined) {
            async function onDelMyDraft() {
                setDel(1);
                await uq.RemoveDraft.submit({ id });
                setDel(2);
            }
            let cnText = 'px-3 py-2 small text-secondary flex-fill ';
            const cnRight = 'px-3 text-secondary py-2 ';
            let right: any;
            switch (del) {
                default:
                    right = <div className={cnRight + 'cursor-pointer'} onClick={onDelMyDraft}><FA name="trash" /></div>;
                    break;
                case 1:
                    right = <div className={cnRight}><FA name='spinner' spin={true} /></div>;
                    break;
                case 2:
                    right = <div className={cnRight}>已删除</div>;
                    cnText += 'text-decoration-line-through';
                    break;
            }

            return <div className="d-flex">
                <div className={cnText}>{id}: 单据定义不存在</div>
                {right}
            </div>;
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

export function routeSheetCenter() {
    return <>
        <Route path={pathSheetCenter} element={<PageSheetCenter />} />
        <Route path={'sheet/:sheet/:id'} element={<PageSheetEdit />} />
        <Route path={'sheet/:sheet'} element={<PageSheetEdit />} />
    </>;
}
