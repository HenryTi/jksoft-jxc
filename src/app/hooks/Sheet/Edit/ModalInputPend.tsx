import { EntityPend, PropPend } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { ViewSpec } from "app/hooks/View";
import { UseQueryOptions } from "app/tool";
import { useState } from "react";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";
import { List } from "tonwa-com";
import { ReturnGetPendRetSheet } from "uqs/UqDefault";
import { PendRow, RowProps } from "./SheetStore";

export function ModalInputPend({ propPend }: { propPend: PropPend; }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { closeModal } = useModal();
    let { caption, entity: entityPend, search } = propPend;
    let { name: pendName, id: entityId, predefined } = entityPend;
    let { data: pendRows } = useQuery([pendName], async () => {
        let { $page, retSheet, retAtom } = await uq.GetPend.page({ pend: entityId, key: '' }, undefined, 100);
        let collSheet: { [id: number]: ReturnGetPendRetSheet } = {};
        for (let v of retSheet) {
            collSheet[v.id] = v;
        };
        let ret: PendRow[] = [];
        for (let v of $page) {
            let pendRow: PendRow = {
                pend: v.pend,
                sheet: collSheet[v.sheet],
                detail: v,
                value: v.pendValue,
            };
            ret.push(pendRow);
        }
        return ret;
    }, UseQueryOptions);
    let [selectedItems, setSelectedItems] = useState<{ [id: number]: PendRow; }>({});

    if (caption === undefined) {
        caption = entityPend.caption ?? pendName;
    }
    function onClick() {
        let pendRows = Object.values(selectedItems).sort((a, b) => {
            let aPend = a.pend, bPend = b.pend;
            if (aPend < bPend) return -1;
            if (aPend === bPend) return 0;
            return 1;
        });
        let ret: RowProps[] = [];
        for (let pendRow of pendRows) {
            const { pend, detail, value } = pendRow;
            let rowProps: RowProps = {
                ...detail,
                origin: detail.id,             // origin detail id
                pendFrom: pend,
                pendValue: value,
                id: undefined,              // 保存之后才有的新输入的 detail id。编辑时有
            };
            detail.id = undefined;          // 取的是origin detail id
            ret.push(rowProps);
        }
        closeModal(ret);
    }
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex text-end align-items-center">
            <span className="me-3 small text-secondary">{caption}</span>
            <span className="w-min-4c">{value}</span>
        </div>;
    }
    const digits = 2;
    function ViewPendRow({ value: pendRow }: { value: PendRow }) {
        const { detail: { i, price, amount, value } } = pendRow;
        return <div className="d-flex w-100">
            <div className="">
                <div className="py-2">
                    <ViewSpec id={i} />
                </div>
            </div>
            <div className="flex-grow-1" />
            <div className="">
                <div className="py-2 d-flex flex-column align-items-end">
                    <ViewValue caption={'单价'} value={price?.toFixed(digits)} />
                    <ViewValue caption={'金额'} value={amount?.toFixed(digits)} />
                    <ViewValue caption={'数量'} value={<span className="fs-larger fw-bold">{value}</span>} />
                </div>
            </div >
        </div>
            ;
        // <div className="col py-2 text-break">{JSON.stringify(pendRow)}</div>
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
    return <Page header={caption}>
        <div className="p-3 border-bottom">
            <div className="d-flex">
                <div className="me-3">pend: {pendName}</div>
                <div className="me-3">search: {JSON.stringify(search)}</div>
                {
                    Object.values(predefined).map(v => {
                        const { name, caption, entity } = v;
                        return <div key={name} className="me-3">
                            {name}: {caption}
                        </div>;
                    })
                }
            </div>
            <div>{Object.keys(selectedItems).map(v => v).join(', ')}</div>
        </div>
        <List items={pendRows} ViewItem={ViewPendRow} className="" onItemSelect={onItemSelect} />
        <div className="p-3">
            <button className="btn btn-primary" onClick={onClick}>选入</button>
        </div>
    </Page>
}
