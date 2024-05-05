import { useCallback, useRef, useState } from "react";
import { IDView, Page, PageConfirm, PageSpinner, useModal } from "tonwa-app";
import { FA, List, useEffectOnce, wait } from "tonwa-com";
import { Entity, EntitySheet } from "app/Biz";
import { PageSheetEdit, PageSheetNew } from "./PageSheetEntry";
import { DashConsole } from "./DashConsole";
import { Atom, Sheet } from "uqs/UqDefault";
import { Bin } from "app/tool";
import { PageSheetList } from "./PageSheetList";
import { useAtomValue } from "jotai";
import { ViewItemMain } from "app/hooks/View";
import { ViewReaction } from "app/hooks/View/ViewReaction";
import { ViewBud } from "app/hooks";

export function PageSheetDash({ entitySheet }: { entitySheet: EntitySheet; }) {
    const modal = useModal();
    const [visible, setVisible] = useState(true);
    const { caption, name, uq, biz } = entitySheet;
    const { current: sheetConsole } = useRef(new DashConsole(modal, entitySheet));
    const myDrafts = useAtomValue(sheetConsole.atomMyDrafts);
    useEffectOnce(() => {
        (async () => {
            Promise.all([
                biz.loadUserDefaults(),
                sheetConsole.loadMyDrafts()
            ]);
        })();
    });
    async function onNew() {
        let ret = await modal.open(<PageSheetNew store={sheetConsole.createSheetStore()} />);
    }
    async function onList() {
        modal.open(<PageSheetList entitySheet={entitySheet} sheetConsole={sheetConsole} />);
    }
    async function onRemoveDraft() {
        if (await modal.open(<PageConfirm header="单据草稿" message="真的要删除全部单据草稿吗？" yes="删除" no="不删除" />) !== true) return;
        setVisible(false);
        await uq.DeleteMyDrafts.submit({ entitySheet: entitySheet.id });
        await wait(10);
        setVisible(true);
    }
    function ViewSheetItem({ value }: { value: (Sheet & Bin & { rowCount: number; }) }) {
        const { id, no, base, i } = value;
        const [del, setDel] = useState(0);
        let entitySheetInView = biz.entityFromId(base);
        // let sheetCaption: string;
        if (entitySheetInView === undefined) {
            sheetCaption = String('Sheet Type ID: ' + base);
        }
        else {
            const { caption, name } = entitySheetInView;
            sheetCaption = caption ?? name;
        }
        /*
        function ViewTarget({ value }: { value: Atom; }) {
            return <span>{value.ex}</span>;
        }
        */
        if (entitySheetInView === undefined) {
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
        // Link to={`/${sheet}/${to62(entitySheet.id)}/${to62(id)}`}
        function onSheet() {
            modal.open(<PageSheetEdit sheetId={id} store={sheetConsole.createSheetStore()} />);
        }
        return <div className="d-flex cursor-pointer" onClick={onSheet}>
            <FA name="file" className="ps-4 pt-3 pe-2 text-info" size="lg" />
            <div className="flex-fill">
                <ViewItemMain value={value} isMy={true} />
            </div>
        </div>;
        /*
        <div className="d-flex px-3 py-3 align-items-center cursor-pointer" onClick={onSheet}>
            <FA name="file-text-o" className="me-3 text-danger" />
            <div className="w-8c"><ViewSheetTime id={id} /></div>
            <span className="d-inline-block w-min-10c">{no}</span>
            <span className="d-inline-block w-min-8c">
                <IDView uq={uq} id={i} Template={ViewTarget} />
            </span>
        </div>;
        */
    }
    if (visible === false) return <PageSpinner />;

    let sheetCaption = caption ?? name;
    return <Page header={sheetCaption + ' - 工作台'}>
        <div className="d-flex px-3 py-2 tonwa-bg-gray-1 border-bottom">
            <button className="btn btn-primary me-3" onClick={onNew}>
                <FA name="file" className="me-2" />
                新开单
            </button>
            <div className="flex-fill" />
            <button className="btn btn-outline-primary" onClick={onList}>
                已归档
            </button>
        </div>
        <ViewReaction atomContent={sheetConsole.atomViewSubmited} className="ms-3 mt-3 me-auto" />
        <ViewUserDefaults entity={entitySheet} />
        <div className="d-flex tonwa-bg-gray-2 ps-3 pe-2 pt-1 mt-4 align-items-end">
            <div className="pb-1 flex-grow-1">
                草稿 <small className="text-secondary ms-3">(最多10份)</small>
            </div>
            <button className="btn btn-sm btn-link" onClick={onRemoveDraft}>
                全部清除
            </button>
        </div>
        <List
            ViewItem={ViewSheetItem}
            items={myDrafts as any[]}
            none={<div className="small text-secondary p-3">[无]</div>}
        />
    </Page>;
}

function ViewUserDefaults({ entity }: { entity: Entity; }) {
    let { biz, user } = entity;
    let { userDefaults } = biz;
    if (userDefaults === undefined) return null;
    return <div className="px-3 pt-3 row row-cols-6">
        {user.map(v => {
            return <ViewBud key={v.id} bud={v} value={userDefaults[v.id]} />;
        })}
    </div>;
}