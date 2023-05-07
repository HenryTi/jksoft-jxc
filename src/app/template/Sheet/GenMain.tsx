import { EntityMain } from "app/Biz/EntitySheet";
import { GenBizEntity } from "app/tool";
import { Atom, Sheet } from "uqs/UqDefault";

export abstract class GenMain extends GenBizEntity<EntityMain> {
    readonly bizEntityType = 'main';
    get entity(): EntityMain { return this.biz.mains[this.bizEntityName] }
    abstract get targetCaption(): string;
    abstract get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get selectTarget(): (header?: string) => Promise<Atom>;
}
