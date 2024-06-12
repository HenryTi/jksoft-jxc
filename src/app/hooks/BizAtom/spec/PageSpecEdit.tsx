import { Page } from "tonwa-app";
import { ViewAtomProps } from "../useBizAtomView";
import { SpecStore } from "./SpecStore";

export function PageSpecEdit({ store, value }: { store: SpecStore; value: any; }) {
    const { entity } = store;
    return <Page header="edit">
        <ViewAtomProps entity={entity} value={{ id: undefined, main: {}, buds: [] }} />
    </Page>;
}
