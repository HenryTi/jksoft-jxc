import { Page, useModal } from "tonwa-app";
import { useState } from "react";
import { FA, List, Sep } from "tonwa-com";
import { PendRow } from "../store";
import { PagePendProps } from "../binEdit/model";
import { ViewPendRowCandidate } from "../binEdit/ViewPendRow";
import { ValRow } from "../tool";

export function PagePend(props: PagePendProps) {
    let { divStore, caption } = props;
    let { entityBin: { pend: entityPend }, pendRows } = divStore;
    const modal = useModal();
    let { name: pendName, hasPrice, hasAmount } = entityPend;
    let [selectedItems, setSelectedItems] = useState<{ [id: number]: PendRow; }>({});

    if (caption === undefined) {
        caption = entityPend.caption ?? pendName;
    }
    // let hasPrice = predefinedFields.findIndex(v => v === 'price') >= 0;
    // let hasAmount = predefinedFields.findIndex(v => v === 'amount') >= 0;
    function onClick() {
        let pendRows = Object.values(selectedItems).sort((a, b) => {
            let aPend = a.pend, bPend = b.pend;
            if (aPend < bPend) return -1;
            if (aPend === bPend) return 0;
            return 1;
        });
        let ret: ValRow[] = [];
        for (let pendRow of pendRows) {
            const { pend, detail, value } = pendRow;
            let rowProps: ValRow = {
                ...detail,
                value,
                origin: detail.id,             // origin detail id
                pend,
                pendValue: value,
                id: undefined,              // 保存之后才有的新输入的 detail id。编辑时有
            };
            detail.id = undefined;          // 取的是origin detail id
            ret.push(rowProps);
        }
        modal.close(ret);
    }
    function ViewItemPendRow({ value: pendRow }: { value: PendRow }) {
        return <ViewPendRowCandidate pendRow={pendRow} divStore={divStore} />;
    }
    function onItemSelect(item: PendRow, isSelected: boolean) {
        const { pend } = item;
        if (isSelected === true) {
            selectedItems[pend] = item;
        }
        else {
            delete selectedItems[pend];
        }
        setSelectedItems({ ...selectedItems });
    }
    let onItemSelectFunc: any, btnFinish: any;
    if (pendRows.length > 0) {
        /*
        if (div.div === undefined) {
            onItemSelectFunc = onItemSelect;
            btnFinish = <button className="btn btn-primary" onClick={onClick}>选入</button>;
        }
        else {
        */
        btnFinish = <button className="btn btn-primary" onClick={() => modal.close([])}>
            下一步
            <FA name="angle-right" className="ms-2" />
        </button>;
        //}
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
