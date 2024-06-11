import { Page, useModal } from "tonwa-app";
import { Spec } from "uqs/UqDefault";
import { SpecStore } from "./SpecStore";

export function PageSpecNew({ store }: { store: SpecStore; }) {
    const modal = useModal();
    const specValue: Spec = {
        id: 3,
        base: store.baseValue.id,
    };
    function onFinish() {
        modal.close(specValue);
    }
    return <Page header="new">
        <div className="p-3">
            <button className="btn btn-primary" onClick={onFinish}>完成</button>
        </div>
    </Page>;
}
