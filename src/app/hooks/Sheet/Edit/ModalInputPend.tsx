import { EntityPend, RefEntity } from "app/Biz";
import { useUqApp } from "app/UqApp";
import { UseQueryOptions } from "app/tool";
import { useQuery } from "react-query";
import { Page, useModal } from "tonwa-app";

export function ModalInputPend({ entityPend: refPend }: { entityPend: RefEntity<EntityPend>; }) {
    const uqApp = useUqApp();
    const { uq } = uqApp;
    const { closeModal } = useModal();
    let { caption, entity: entityPend } = refPend;
    let { name: pendName, entityId } = entityPend;
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
    return <Page header={caption}>
        <div className="p-3">
            <div>pend: {pendName}</div>
            <div>{JSON.stringify(pendRows)}</div>
            <button className="btn btn-primary" onClick={onClick}>输入</button>
        </div>
    </Page>
}
