import { EntityMain } from "app/Biz/EntitySheet";
import { GenBizEntity, QueryMore } from "app/tool";
import { Sheet } from "uqs/UqDefault";

export abstract class GenMain extends GenBizEntity<EntityMain> {
    readonly bizEntityType = 'main';
    get entity(): EntityMain { return this.biz.mains[this.bizEntityName] }
    abstract get targetCaption(): string;
    abstract get ViewTargetBand(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get ViewTarget(): (props: { sheet: Sheet; }) => JSX.Element;
    abstract get QuerySearchItem(): QueryMore;
}
