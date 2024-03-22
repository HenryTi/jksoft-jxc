import { Page } from "tonwa-app";
import { SheetStore } from "./store";

export function PageSheet({ store }: { store: SheetStore; }) {
    return <Page header={store.caption}>
        PageSheet
    </Page>;
}
