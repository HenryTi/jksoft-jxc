import { EntityPend, RefEntity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { ViewSpec } from "app/hooks/View";
import { UseQueryOptions } from "app/tool";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";
import { List } from "tonwa-com";
import { ReturnGetPend$page } from "uqs/UqDefault";

export function ModalInputPend({ entityPend: refPend }: { entityPend: RefEntity<EntityPend>; }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { closeModal } = useModal();
    let { caption, entity: entityPend } = refPend;
    let { name: pendName, id: entityId } = entityPend;
    let { data: pendRows } = useQuery([pendName], async () => {
        let result = await uq.GetPend.page({ pend: entityId, key: '' }, undefined, 100);
        return result.$page;
    }, UseQueryOptions);

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
    return <Page header={caption}>
        <div className="p-3 border-bottom">pend: {pendName}</div>
        <List items={pendRows} ViewItem={ViewPendRow} className="" />
        <div className="p-3">
            <button className="btn btn-primary" onClick={onClick}>输入</button>
        </div>
    </Page>
}
