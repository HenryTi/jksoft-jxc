import { Page, useModal } from "tonwa-app";
import { FA, List, Sep, setAtomValue } from "tonwa-com";
import { DivStore, PendRow } from "../store";
import { ViewPendRowEdit } from "../binEdit/ViewPendRowEdit";
import { ViewSteps } from "../dash/ViewSteps";

export function PagePend(props: { divStore: DivStore; caption: string; }) {
    let { divStore, caption } = props;
    let { entityBin: { pend: entityPend }, pendRows, sheetStore } = divStore;
    const { sheetConsole: { steps }, atomLoaded } = sheetStore;
    const modal = useModal();
    let { name: pendName } = entityPend;

    if (caption === undefined) {
        caption = entityPend.caption ?? pendName;
    }
    function ViewItemPendRow({ value: pendRow }: { value: PendRow }) {
        return <ViewPendRowEdit pendRow={pendRow} divStore={divStore} />;
    }
    let onItemSelectFunc: any, btnFinish: any;
    function BtnNext() {
        function onNext() {
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

    return <Page header={caption} footer={footer}>
        <ViewSteps sheetSteps={steps} />
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
