import { EntityPend, PropPend } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { ViewSpec } from "app/hooks/View";
import { UseQueryOptions } from "app/tool";
import { useRef, useState } from "react";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";
import { List } from "tonwa-com";
import { ReturnGetPend$page } from "uqs/UqDefault";

export function ModalInputPend({ propPend }: { propPend: PropPend; }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { closeModal } = useModal();
    let { caption, entity: entityPend, search } = propPend;
    let { name: pendName, id: entityId, predefined } = entityPend;
    let { data: pendRows } = useQuery([pendName], async () => {
        let result = await uq.GetPend.page({ pend: entityId, key: '' }, undefined, 100);
        return result.$page;
    }, UseQueryOptions);
    let [selectedItems, setSelectedItems] = useState<{ [id: number]: ReturnGetPend$page; }>({});

    if (caption === undefined) {
        caption = entityPend.caption ?? pendName;
    }
    function onClick() {
        closeModal('待处理 xxx yyy');
    }
    function ViewValue({ caption, value }: { caption: string; value: string | number | JSX.Element; }) {
        return <div className="d-flex text-end align-items-center">
            <span className="me-3 small text-secondary">{caption}</span>
            <span className="w-min-4c">{value}</span>
        </div>;
    }
    const digits = 2;
    function ViewPendRow({ value: row }: { value: ReturnGetPend$page }) {
        const { i, price, amount, value } = row;
        return <div className="container">
            <div className="row">
                <div className="col py-2">
                    <ViewSpec id={i} />
                </div>
                <div className="col py-2 text-break">{JSON.stringify(row)}</div>
                <div className="col py-2 d-flex flex-column align-items-end me-2">
                    <ViewValue caption={'单价'} value={price.toFixed(digits)} />
                    <ViewValue caption={'金额'} value={amount.toFixed(digits)} />
                    <ViewValue caption={'数量'} value={<span className="fs-larger fw-bold">{value}</span>} />
                </div >
            </div>
        </div>;
    }
    function onItemSelect(item: ReturnGetPend$page, isSelected: boolean) {
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
            <button className="btn btn-primary" onClick={onClick}>输入</button>
        </div>
    </Page>
}
