import { EntityAtom } from "app/Biz";
import { Page } from "tonwa-app";

export function PageAtomMap({ entity }: { entity: EntityAtom; }) {
    return <Page header="对照表">
        {entity.caption ?? entity.name}
    </Page>;
}
