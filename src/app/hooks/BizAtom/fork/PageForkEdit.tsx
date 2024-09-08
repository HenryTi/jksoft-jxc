import { Page } from "tonwa-app";
import { ViewAtomProps } from "../useBizAtomView";
import { ForkStore, ViewForkTop } from "./ForkStore";
import { RowCols } from "app/hooks/tool";
import { ViewBud } from "app/hooks";

export function PageForkEdit({ store, value }: { store: ForkStore; value: any; }) {
    const { entity } = store;
    const { id, no, ex, buds } = value;
    const { caption, keys } = entity;
    let vTitle: any;
    if (ex) {
        vTitle = <div><b>{ex}</b> {no}</div>;
    }
    else if (no) {
        vTitle = <div><b>{no}</b></div>;
    }
    return <Page header={caption}>
        <div className="p-3 tonwa-bg-gray-2">
            <ViewForkTop store={store} />
            {vTitle}
            <div><small className="text-body-tertiary me-1">ID:</small>{id}</div>
            <RowCols>
                {keys.map(v => {
                    const { id: budId } = v;
                    return <ViewBud key={budId} bud={v} value={buds[budId]} />
                })}
            </RowCols>
        </div>
        <ViewAtomProps entity={entity} value={value} />
    </Page>;
}
