import { Page, useModal } from "tonwa-app";
import { ButtonAsync, FA, List, Sep, setAtomValue, theme, wait } from "tonwa-com";
import { FormBudsStore, PendRow } from "../../../Store";
import { ViewPendRowEdit } from "../binEdit/ViewPendRowEdit";
import { ViewSteps } from "../dash/ViewSteps";
import { RowCols } from "app/hooks/tool";
import { PickPendStore } from "../../../Store/PickPendStore";
import { useAtomValue } from "jotai";

export function PagePend({ pendStore }: { pendStore: PickPendStore; }) {
    let { binStore, pickPend } = pendStore;
    let { caption, name } = pickPend;
    let { entity: { pend: entityPend }, atomPendRows, sheetStore } = binStore;
    const { sheetConsole: { steps }, atomLoaded } = sheetStore;
    const modal = useModal();
    let pendRows = useAtomValue(atomPendRows);

    if (caption === name) {
        caption = entityPend.caption;
    }
    function ViewItemPendRow({ value: pendRow }: { value: PendRow }) {
        return <ViewPendRowEdit pendRow={pendRow} binStore={binStore} />;
    }
    let onItemSelectFunc: any;
    function BtnNext() {
        function onNext() {
            steps?.next();
            modal.close([]);
        }
        return <button className="btn btn-primary" onClick={onNext}>
            下一步
            <FA name="angle-right" className="ms-2" />
        </button>;
    }
    function BtnClose() {
        let content = steps === undefined ? '关闭' :
            <><FA name="angle-left" className="me-2" />上一步</>;
        function onClose() {
            let ret: any = undefined;
            if (steps !== undefined) {
                steps.prev();
                setAtomValue(atomLoaded, false);
            }
            else {
                ret = [];
            }
            modal.close(ret);
        }
        return <button className="btn btn-outline-info" onClick={onClose}>
            {content}
        </button>;
    }
    let footer: any, cnFooter = ' px-3 py-2 ';
    if (pendRows.length > 0) {
        footer = <div className={'d-flex ' + cnFooter}>
            <BtnNext />
            <div className="flex-fill" />
            {steps && <BtnClose />}
        </div>
    }
    else {
        footer = <div className={cnFooter}><BtnClose /></div>;
    }

    async function onSearch() {
        await wait(100);
        await pendStore.searchPend();
    }

    function ViewParams() {
        let { paramsEditing } = pendStore;
        let formBudsStore = new FormBudsStore(modal, paramsEditing);
        return <div className={'border-bottom border-primary py-2 tonwa-bg-gray-2 ' + theme.bootstrapContainer}>
            <RowCols>
                {formBudsStore.buildEditBuds()}
                <div className="d-flex align-items-end mb-2">
                    <ButtonAsync className="btn btn-outline-primary" onClick={onSearch}>
                        <FA name="search" /> 查询
                    </ButtonAsync>
                </div>
            </RowCols>
        </div>
    }

    return <Page header={caption} footer={footer}>
        <ViewSteps sheetSteps={steps} />
        <ViewParams />
        <div className="bg-white">
            <List items={pendRows}
                ViewItem={ViewItemPendRow} className=""
                onItemSelect={onItemSelectFunc}
                sep={<Sep sep={2} />}
                none={<div className="p-3 small text-secondary tonwa-bg-gray-2 border-bottom">
                    <FA name="times-circle" className="me-3 text-danger" size="lg" />
                    无内容
                </div>} />
        </div>
    </Page>;
}
