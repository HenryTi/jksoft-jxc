import { Page, useModal } from "tonwa-app";
import { ForkStore, useForkStore, ViewForkTop } from "./ForkStore";
import { FA, List, useEffectOnce } from "tonwa-com";
import { BizBud, EntityFork } from "tonwa";
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
        const { no, ex, buds: budsValue } = value;
        let vEx: any, vNo: any;
        if (ex !== undefined) {
            vEx = ex;
            vNo = no;
        }
        else {
            vEx = <b>{no}</b>;
        }
        function ViewBuds({ buds }: { buds: BizBud[]; }) {
            if (buds.length === 0) return null;
            return <RowColsSm>
                {buds.map(v => {
                    const { id: budId } = v;
                    return <ViewBud key={budId} bud={v} value={budsValue[budId]} />
                })}
            </RowColsSm>
        }
        return <div className="px-3 py-2">
            <RowColsSm><b className="w-min-6c">{vEx}</b> <span>{vNo}</span></RowColsSm>
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
        <div className="p-3 tonwa-bg-gray-2 d-flex">
            <ViewForkTop store={store} />
            <div className="flex-fill" />
            <div>ddd</div>
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
    async function onAddFork() {
        await modal.open(<PageForkNew store={store} />);
    }
    return <div>
        <div className="mt-3 ps-3 pe-2 py-1 border-top border-bottom tonwa-bg-gray-1 d-flex align-items-end">
            <div className="flex-fill">{fork.caption}</div>
            <div>
                <button className="btn btn-sm btn-outline-success" onClick={onAddFork}>
                    <FA name="plus" />
                </button>
            </div>
        </div>
        <ViewForkList store={store} />
    </div>;
}
