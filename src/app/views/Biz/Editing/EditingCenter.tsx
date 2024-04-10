import { useUqApp } from "app/UqApp";
import { BI, PageQueryMore } from "app/coms";
import { Link, Route } from "react-router-dom";
import { IDView, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { EntitySheet } from "app/Biz";
import { FA, List, to62, wait } from "tonwa-com";
import { useCallback, useState } from "react";
import { Atom, Sheet } from "uqs/UqDefault";
import { Bin, ViewNotifyCount } from "app/tool";
import { centers } from "app/views/center";
import { PageSearch } from "./PageSearch";
import { ViewSheetTime } from "app/hooks";

function PageEditingCenter() {
    const modal = useModal();
    const uqApp = useUqApp();
    const { uq, biz } = uqApp;
    const sheetEntities = biz.sheets;
    const query = useCallback(async (param: any, pageStart: any, pageSize: number) => {
        let { $page } = await uq.GetMyDrafts.page({}, pageStart, pageSize);
        return $page;
    }, []);
    const [visible, setVisible] = useState(true);
    function ViewSheetType({ value }: { value: EntitySheet; }) {
        let { caption, name, id: entityId, coreDetail } = value;
        let pendEntityId: number;
        let vNotifyCount: any;
        if (coreDetail !== undefined) {
            pendEntityId = coreDetail.pend?.id;
            if (pendEntityId !== undefined) {
                vNotifyCount = <div className="position-absolute" style={{ right: "0.3rem", top: "-0.5rem" }}>
                    <ViewNotifyCount phrase={pendEntityId} />
                </div>;
            }
        }
        return <Link
            to={`/sheet/${to62(entityId)}`}
        >
            <div className="px-1 py-2 align-items-center d-flex">
                <div className="position-relative">
                    <FA name="file-text" className="my-2 mx-4 text-primary" size="lg" />
                    {vNotifyCount}
                </div>
                <span className="text-body">{caption ?? name}</span>
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
            <div className="d-flex ps-1 pe-3 py-3 align-items-center">
                <FA name="file-text-o" className="mx-4 text-danger" size="lg" />
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
    async function onRemoveDraft() {
        if (await modal.open(<PageConfirm header="单据草稿" message="真的要删除全部单据草稿吗？" yes="删除" no="不删除" />) !== true) return;
        setVisible(false);
        await uq.DeleteMyDrafts.submit({});
        await wait(10);
        setVisible(true);
    }
    return visible === false ?
        <PageSpinner />
        :
        <PageQueryMore header={centers.editing.caption}
            query={query}
            param={{}}
            sortField={'id'}
            ViewItem={ViewSheetItem}
            none={<div className="small text-secondary p-3">[无]</div>}
        >
            <List items={sheetEntities} ViewItem={ViewSheetType} />
            <Link to={`/sheet/search`}>
                <div className="px-1 py-2 align-items-center d-flex border-bottom">
                    <FA name="search" className="mx-4 my-2 text-warning" />
                    单据搜索
                </div>
            </Link>
            <div className="d-flex tonwa-bg-gray-2 ps-3 pe-2 pt-2 align-items-end">
                <div className="small text-secondary pb-1 flex-grow-1">
                    我的草稿
                </div>
                <button className="btn btn-sm btn-link" onClick={onRemoveDraft}>
                    清除草稿
                </button>
            </div>
        </PageQueryMore>;
}

export function routeEditingCenter() {
    return <>
        <Route path={centers.editing.path} element={<PageEditingCenter />} />
        <Route path={'sheet/search'} element={<PageSearch />} />
    </>;
}
