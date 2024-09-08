import { Page, useModal } from "tonwa-app";
import { ForkStore, useForkStore, ViewForkTop } from "./ForkStore";
import { FA, List, useEffectOnce } from "tonwa-com";
import { BizBud, EntityFork } from "app/Biz";
import { useAtomValue } from "jotai";
import { PageForkNew } from "./PageForkNew";
import { RowColsSm } from "app/hooks/tool";
import { ViewBud } from "app/hooks";
import { PageForkEdit } from "./PageForkEdit";
import { AtomIDValue } from "../AtomIDValue";

export function ViewForkList({ store }: { store: ForkStore }) {
    const modal = useModal();
    const items = useAtomValue(store.itemsAtom);
    const { showKeys, showBuds } = store.entity;
    function ViewSpecItem({ value }: { value: any; }) {
        const { no, ex } = value;
        let vEx: any, vNo: any;
        if (ex !== undefined) {
            vEx = ex;
            vNo = no;
        }
        else {
            vEx = <b className="w-16c">{no}</b>;
        }
        function ViewBuds({ buds }: { buds: BizBud[]; }) {
            if (buds.length === 0) return null;
            return <RowColsSm>
                {buds.map(v => {
                    const { id: budId } = v;
                    return <ViewBud key={budId} bud={v} value={value[budId]} />
                })}
            </RowColsSm>
        }
        return <div className="px-3 py-2">
            <RowColsSm><b className="w-16c">{vEx}</b> <span>{vNo}</span></RowColsSm>
            <ViewBuds buds={showKeys} />
            <ViewBuds buds={showBuds} />
        </div>;
    }

    function onItemClick(item: any) {
        let itemStore = store; // new SpecStore();
        modal.open(<PageForkEdit value={item} store={itemStore} />);
    }

    return <List items={items} ViewItem={ViewSpecItem} onItemClick={onItemClick} />;
}

export function PageForkList({ store }: { store: ForkStore }) {
    const modal = useModal();
    const right = <button className="btn btn-sm btn-success me-2" onClick={onAdd}><FA name="plus" /></button>;

    async function onAdd() {
        await modal.open(<PageForkNew store={store} />);
    }
    return <Page header={store.entity.caption} right={right}>
        <div className="p-3 tonwa-bg-gray-2">
            <ViewForkTop store={store} />
        </div>
        <ViewForkList store={store} />
    </Page>;
}

export function ViewForkListAutoLoad({ fork, value }: { fork: EntityFork; value: AtomIDValue; }) {
    let modal = useModal();
    let store = useForkStore(modal, fork, value);
    useEffectOnce(() => {
        store.load();
    });
    return <div>
        <div className="mt-3 px-3 pt-2 pb-1 border-top border-bottom tonwa-bg-gray-1">{fork.caption}</div>
        <ViewForkList store={store} />
    </div>;
}
