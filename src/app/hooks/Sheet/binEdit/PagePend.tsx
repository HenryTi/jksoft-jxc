import { Page, useModal } from "tonwa-app";
import { BinDetail } from "../SheetStore";
import { useState } from "react";
import { List, Sep } from "tonwa-com";
import { PendRow } from "../SheetStore";
import { PagePendProps } from "./model";
import { ViewPendBand } from "./ViewPendBand";

export function PagePend(props: PagePendProps) {
    let { binStore, caption } = props;
    let { entityBin: { pend: entityPend, div: div }, pendRows } = binStore;
    const modal = useModal();
    let { name: pendName, predefinedFields } = entityPend;
    let [selectedItems, setSelectedItems] = useState<{ [id: number]: PendRow; }>({});

    if (caption === undefined) {
        caption = entityPend.caption ?? pendName;
    }
    let hasPrice = predefinedFields.findIndex(v => v === 'price') >= 0;
    let hasAmount = predefinedFields.findIndex(v => v === 'amount') >= 0;
    function onClick() {
        let pendRows = Object.values(selectedItems).sort((a, b) => {
            let aPend = a.pend, bPend = b.pend;
            if (aPend < bPend) return -1;
            if (aPend === bPend) return 0;
            return 1;
        });
        let ret: BinDetail[] = [];
        for (let pendRow of pendRows) {
            const { pend, detail, value/*, sheet*/ } = pendRow;
            let rowProps: BinDetail = {
                ...detail,
                value,
                origin: detail.id,             // origin detail id
                pendFrom: pend,
                pendValue: value,
                //sheet,
                id: undefined,              // 保存之后才有的新输入的 detail id。编辑时有
            };
            detail.id = undefined;          // 取的是origin detail id
            ret.push(rowProps);
        }
        modal.close(ret);
    }
    function ViewItemPendRow({ value: pendRow }: { value: PendRow }) {
        return <ViewPendBand value={pendRow} hasPrice={hasPrice} hasAmount={hasAmount} {...props} />;
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
    if (div.div === undefined) {
        onItemSelectFunc = onItemSelect;
        btnFinish = <button className="btn btn-primary" onClick={onClick}>选入</button>;
    }
    else {
        btnFinish = <button className="btn btn-outline-primary" onClick={() => modal.close()}>完成</button>;
    }
    return <Page header={caption}>
        <List items={pendRows} ViewItem={ViewItemPendRow} className="" onItemSelect={onItemSelectFunc} sep={<Sep sep={5} />} />
        <div className="p-3">
            {btnFinish}
        </div>
    </Page>;
}
