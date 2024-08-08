import { ViewAtomTitles } from "app/hooks/tool";
import { ViewSpecAtomBold } from "app/hooks/View";
import { EntityStore } from "app/tool";

export function ViewId({ id, store }: { id: number; store: EntityStore; }) {
    return <div className="mb-1">
        <ViewSpecAtomBold id={id} store={store} />
        <ViewAtomTitles id={id} store={store} />
    </div>;
}
