import { Page, useModal } from "tonwa-app";
import { SpecBaseValue, useSpecStore } from "./SpecStore";
import { FA, List, useEffectOnce } from "tonwa-com";
import { EntitySpec } from "app/Biz";
import { useAtomValue } from "jotai";
import { Spec } from "uqs/UqDefault";
import { PageSpecNew } from "./PageSpecNew";

export function PageSpecList({ entitySpec, baseValue }: { entitySpec: EntitySpec; baseValue: SpecBaseValue; }) {
    const modal = useModal();
    const store = useSpecStore(entitySpec, baseValue);
    const items = useAtomValue(store.itemsAtom);
    useEffectOnce(() => {
        store.load();
    });
    async function onAdd() {
        const specValue: Spec = await modal.open(<PageSpecNew store={store} />);
        if (specValue === undefined) return;
        await store.addSpec(specValue);
    }
    const right = <button className="btn btn-sm btn-success me-2" onClick={onAdd}><FA name="plus" /></button>;
    return <Page header={store.header} right={right}>
        <div className="p-3 tonwa-bg-gray-2">
            {store.topViewAtom()}
        </div>
        <List items={items} />
    </Page>;
}
