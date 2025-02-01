import { useMemo, useRef, useState } from "react";
import { Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { FA, List, useEffectOnce, wait } from "tonwa-com";
import { Entity, EntitySheet, StoreEntity } from "tonwa";
import { PageSheetEdit, PageSheetNew } from "./PageSheetEntry";
import { DashConsole, getUserBudValue } from "../../../Store";
import { Sheet } from "uqs/UqDefault";
import { Bin, ViewNotifyCount } from "app/tool";
import { PageSheetList } from "./PageSheetList";
import { useAtomValue } from "jotai";
import { ViewReaction, ViewItemMain } from "app/hooks/View";
import { PageCmdLog, ViewBud } from "app/hooks";
import { useSiteRole } from "app/views/Site/useSiteRole";

export function PageSheetDash({ entitySheet }: { entitySheet: EntitySheet; }) {
    const modal = useModal();
    const [visible, setVisible] = useState(true);
    const { caption, name, biz, coreDetail } = entitySheet;
    const { current: dashConsole } = useRef(new DashConsole(modal, entitySheet));
    let useSiteRoleReturn = useSiteRole();
    let { isAdmin } = useSiteRoleReturn.userSite;
    const sheetStore = useMemo(() => dashConsole.createSheetStore(), []);
    const { myDraftsStore } = dashConsole;
    const myDrafts = useAtomValue(myDraftsStore.atomMyDrafts);
    const [hasUserDefaults, setHasUserDefaults] = useState(undefined as boolean);
    useEffectOnce(() => {
        (async () => {
            await Promise.all([
                dashConsole.loadUserDefaults(sheetStore),
                myDraftsStore.loadMyDrafts(),
            ]);
            setHasUserDefaults(true);
        })();
    });
    async function onNew() {
        let ret = await modal.open(<PageSheetNew store={sheetStore} />);
    }
    async function onList() {
        modal.open(<PageSheetList dashConsole={dashConsole} />);
    }
    async function onRemoveDraft() {
        if (await modal.open(<PageConfirm header="单据草稿" message="真的要清除全部单据草稿吗？" yes="清除" no="不清除" />) !== true) return;
        setVisible(false);
        await myDraftsStore.deleteAllMyDrafts();
        await wait(10);
        setVisible(true);
    }
    function ViewSheetItem({ value }: { value: (Sheet & Bin & { rowCount: number; }) }) {
        const { id, no, base, i } = value;
        const [del, setDel] = useState(0);
        let entitySheetInView = biz.entityFromId(base);
        if (entitySheetInView === undefined) {
            pageHeader = String('Sheet Type ID: ' + base);
        }
        else {
            const { caption } = entitySheetInView;
            pageHeader = caption;
        }
        if (entitySheetInView === undefined) {
            async function onDelMyDraft() {
                setDel(1);
                // await uq.RemoveDraft.submit({ id });
                await biz.client.RemoveDraft(id);
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
        function onSheet() {
            modal.open(<PageSheetEdit sheetId={id} store={dashConsole.createSheetStore()} />);
        }
        return <div className="d-flex cursor-pointer" onClick={onSheet}>
            <FA name="file" className="ps-4 pt-3 pe-2 text-info" size="lg" />
            <div className="flex-fill">
                <ViewItemMain value={value} isMy={true} store={myDraftsStore} />
            </div>
        </div>;
    }
    if (visible === false) return <PageSpinner />;
    let pageHeader = (caption ?? name) + ' - 工作台';
    if (hasUserDefaults === false) {
        return <Page header={pageHeader}>
            <div>
                <FA className="text-danger me-2" name="exclamation-circle" />
                请联系管理员设置本单据
            </div>
        </Page>
    }

    let btnLog: any;
    if (isAdmin === true) {
        btnLog = <button className="btn btn-outline-primary me-2" onClick={onLog}>
            Log
        </button>;
        function onLog() {
            modal.open(<PageCmdLog />);
        }
    }

    function viewUserDefaults() {
        if (hasUserDefaults === undefined) return;
        let { biz, userBuds } = entitySheet;
        let { userDefaults } = biz;
        if (userBuds === undefined || userDefaults === undefined) return null;
        return <div className="container-fluid pt-2">
            <div className="row row-cols-6">
                {userBuds.map(v => {
                    let userBudValue = getUserBudValue(entitySheet, v);
                    return <ViewBud key={v.id} bud={v} value={userBudValue} store={sheetStore} />;
                })}
            </div>
        </div>;
    }

    return <Page header={pageHeader}>
        <div className="d-flex px-3 py-2 tonwa-bg-gray-1 border-bottom">
            <button className="btn btn-primary me-3" onClick={onNew}>
                <FA name="file" className="me-2" />
                新开单
            </button>
            <div className="flex-fill">
                <ViewNotifyCount phrase={coreDetail?.pend?.id} />
            </div>
            {btnLog}
            <button className="btn btn-outline-primary" onClick={onList}>
                已归档
            </button>
        </div>
        <ViewReaction atomContent={dashConsole.atomViewSubmited} className="ms-3 mt-3 me-auto" />
        {viewUserDefaults()}
        <div className="d-flex tonwa-bg-gray-2 ps-3 pe-2 pt-1 mt-2 align-items-end">
            <div className="pb-1 flex-grow-1">
                草稿 <small className="text-secondary ms-3">(最多10份)</small>
            </div>
            {
                myDrafts !== undefined && myDrafts.length > 0 &&
                <button className="btn btn-sm btn-link" onClick={onRemoveDraft}>
                    清除
                </button>
            }
        </div>
        <List
            ViewItem={ViewSheetItem}
            items={myDrafts as any[]}
            none={<div className="small text-secondary p-3">[无]</div>}
        />
    </Page>;
}
