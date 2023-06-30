import { GenBizEntity } from "app/tool";
import { EntitySheet } from "app/Biz/EntitySheet";
import { Atom, Sheet } from "uqs/UqDefault";

export abstract class GenSheet extends GenBizEntity<EntitySheet> {
    readonly bizEntityType = 'sheet';
    get path() { return this.bizEntityName; }
    abstract get bizMain(): string;
    abstract get targetCaption(): string;
    abstract get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get selectTarget(): (header?: string) => Promise<Atom>;
}

export abstract class GenSheetNoTarget extends GenSheet {
    readonly targetCaption = undefined as string;
    readonly ViewTargetBand = undefined as (props: { sheet: Sheet; }) => JSX.Element;
    readonly ViewTarget = undefined as (props: { sheet: Sheet; }) => JSX.Element;
    readonly selectTarget = undefined as (header?: string) => Promise<Atom>;
}
