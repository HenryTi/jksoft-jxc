import { UqApp } from "app/UqApp";
import { GenBizEntity } from "app/tool";
import { EntitySheet } from "app/Biz/EntitySheet";
import { GenMain } from "./GenMain";

export abstract class GenSheet extends GenBizEntity<EntitySheet> {
    readonly bizEntityType = 'sheet';
    get path() { return this.bizEntityName; }
    get entity(): EntitySheet { return this.biz.sheets[this.bizEntityName] }
    protected abstract GenMain(): new (uqApp: UqApp) => GenMain;
    readonly genMain: GenMain;

    constructor(uqApp: UqApp) {
        super(uqApp);
        this.genMain = uqApp.objectOf(this.GenMain());
    }
}
