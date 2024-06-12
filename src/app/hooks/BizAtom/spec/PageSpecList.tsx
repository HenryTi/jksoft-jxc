import { Page, useModal } from "tonwa-app";
import { useSpecStore } from "./SpecStore";
import { FA, List, useEffectOnce } from "tonwa-com";
import { BizBud, EntitySpec } from "app/Biz";
import { useAtomValue } from "jotai";
import { PageSpecNew } from "./PageSpecNew";
import { RowColsSm } from "app/hooks/tool";
import { ViewBud } from "app/hooks";
import { PageSpecEdit } from "./PageSpecEdit";
import { AtomIDValue } from "../AtomIDValue";

export function PageSpecList({ entitySpec, baseValue }: { entitySpec: EntitySpec; baseValue: AtomIDValue; }) {
    const modal = useModal();
    const store = useSpecStore(entitySpec, baseValue);
    const items = useAtomValue(store.itemsAtom);
    useEffectOnce(() => {
        store.load();
    });
    const right = <button className="btn btn-sm btn-success me-2" onClick={onAdd}><FA name="plus" /></button>;

    async function onAdd() {
        await modal.open(<PageSpecNew store={store} />);
    }

    const { showKeys, showBuds } = entitySpec;
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

    function onItemClick({ item }: { item: any; }) {
        modal.open(<PageSpecEdit value={item} store={store} />);
    }

    return <Page header={store.header} right={right}>
        <div className="p-3 tonwa-bg-gray-2">
            {store.topViewAtom()}
        </div>
        <List items={items} ViewItem={ViewSpecItem} onItemClick={onItemClick} />
    </Page>;
}
