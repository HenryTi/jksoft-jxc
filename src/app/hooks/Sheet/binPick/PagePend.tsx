import { Page, useModal } from "tonwa-app";
import { FA, List, Sep } from "tonwa-com";
import { DivStore, PendRow } from "../store";
import { ViewPendRowEdit } from "../binEdit/ViewPendRowEdit";

export function PagePend(props: { divStore: DivStore; caption: string; }) {
    let { divStore, caption } = props;
    let { entityBin: { pend: entityPend }, pendRows } = divStore;
    const modal = useModal();
    let { name: pendName } = entityPend;

    if (caption === undefined) {
        caption = entityPend.caption ?? pendName;
    }
    function ViewItemPendRow({ value: pendRow }: { value: PendRow }) {
        return <ViewPendRowEdit pendRow={pendRow} divStore={divStore} />;
    }
    let onItemSelectFunc: any, btnFinish: any;
    if (pendRows.length > 0) {
        btnFinish = <button className="btn btn-primary" onClick={() => modal.close([])}>
            下一步
            <FA name="angle-right" className="ms-2" />
        </button>;
    }
    else {
        btnFinish = <button className="btn btn-outline-info" onClick={() => modal.close([])}>
            关闭
        </button>;
    }
    const footer = <div className="px-3 py-2">
        {btnFinish}
    </div>

    return <Page header={caption} footer={footer}>
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
